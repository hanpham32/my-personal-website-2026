import fs from 'fs';
import path from 'path';

const BOOKS_JSON_PATH = './books_read.json';
const CSV_PATH = './goodreads_library_export.csv';
const OUTPUT_DIR = './public/book_covers';
const MANIFEST_PATH = './book_covers_manifest.json';
const API_BASE = 'https://covers.openlibrary.org/b';
const DELAY_MS = 1000;

interface Book {
  title: string;
  author: string;
  rating: string;
  isbn?: string;
}

interface BookResult extends Book {
  filename: string | null;
  status: 'success' | 'not_found';
  error?: string;
}

function log(message: string) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${timestamp}] ${message}`);
}

function sanitizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function sanitizeAuthor(author: string): string {
  const parts = author.split(' ');
  const lastName = parts[parts.length - 1];
  return sanitizeTitle(lastName);
}

function generateFilename(title: string, author: string): string {
  const sanitizedTitle = sanitizeTitle(title);
  const sanitizedAuthor = sanitizeAuthor(author);
  return `${sanitizedTitle}-${sanitizedAuthor}.jpg`;
}

function extractISBN(isbnStr: string | undefined): string | null {
  if (!isbnStr || isbnStr === '=""') return null;
  return isbnStr.replace(/["=]/g, '');
}

function loadISBNMap(): Map<string, string> {
  const isbnMap = new Map<string, string>();
  
  if (!fs.existsSync(CSV_PATH)) {
    log(`WARNING: ${CSV_PATH} not found, will use title-based search only`);
    return isbnMap;
  }
  
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n');
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const cols = line.split(',');
    if (cols.length < 8) continue;
    
    const title = cols[1]?.replace(/^"|"$/g, '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase() || '';
    const isbn13 = cols[7]?.match(/(\d{10,13})/)?.[1] || '';
    const isbn = cols[6]?.match(/(\d{10,13})/)?.[1] || '';
    
    const finalIsbn = isbn13 || isbn;
    if (title && finalIsbn) {
      isbnMap.set(title, finalIsbn);
    }
  }
  
  log(`Loaded ISBNs for ${isbnMap.size} books from CSV`);
  return isbnMap;
}

function findISBN(title: string, author: string, isbnMap: Map<string, string>): string | null {
  const titleLower = title.toLowerCase();
  
  if (isbnMap.has(titleLower)) {
    return isbnMap.get(titleLower) || null;
  }
  
  const authorLastName = author.split(' ').pop()?.toLowerCase() || '';
  for (const [csvTitle, isbn] of isbnMap) {
    if (csvTitle.includes(authorLastName) && csvTitle.includes(titleLower.split(' ')[0])) {
      return isbn;
    }
  }
  
  return null;
}

async function downloadCover(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    
    if (!response.ok) {
      return null;
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType && !contentType.startsWith('image/')) {
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (buffer.length < 1000) {
      return null;
    }
    
    return buffer;
  } catch {
    return null;
  }
}

async function tryDownloadCover(
  url: string,
  method: string
): Promise<{ data: Buffer | null; url: string }> {
  log(`  → Trying ${method}: ${url}`);
  const data = await downloadCover(url);
  return { data, url };
}

async function main() {
  log('========================================');
  log('Starting book cover download...');
  log('========================================');

  if (!fs.existsSync(BOOKS_JSON_PATH)) {
    log(`ERROR: ${BOOKS_JSON_PATH} not found!`);
    process.exit(1);
  }

  const booksData = JSON.parse(fs.readFileSync(BOOKS_JSON_PATH, 'utf-8'));
  const isbnMap = loadISBNMap();
  
  const years = Object.keys(booksData).sort();
  log(`Found ${years.length} years to process: ${years.join(', ')}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const manifest: Record<string, BookResult[]> = {};
  let totalFound = 0;
  let totalNotFound = 0;

  for (const year of years) {
    const books: Book[] = booksData[year];
    log('');
    log(`========== Processing year ${year} (${books.length} books) ==========`);

    const yearDir = path.join(OUTPUT_DIR, year);
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
      log(`Created year directory: ${yearDir}`);
    }

    manifest[year] = [];

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const filename = generateFilename(book.title, book.author);
      const filepath = path.join(yearDir, filename);

      log(`[${year}] ${i + 1}/${books.length} - "${book.title}" by ${book.author}`);
      log(`  → Filename: ${filename}`);

      const isbn = findISBN(book.title, book.author, isbnMap);
      
      let coverData: Buffer | null = null;
      let successMethod = '';

      if (isbn && isbn.length > 5) {
        const result = await tryDownloadCover(`${API_BASE}/isbn/${isbn}-M.jpg`, 'ISBN');
        if (result.data) {
          coverData = result.data;
          successMethod = 'ISBN';
        }
      }

      if (!coverData) {
        const result = await tryDownloadCover(
          `${API_BASE}/title/${sanitizeTitle(book.title)}-M.jpg`,
          'title'
        );
        if (result.data) {
          coverData = result.data;
          successMethod = 'title';
        }
      }

      if (coverData) {
        fs.writeFileSync(filepath, coverData);
        log(`  ✓ SUCCESS: Downloaded cover via ${successMethod} to ${year}/${filename}`);
        
        manifest[year].push({
          ...book,
          isbn: isbn || undefined,
          filename,
          status: 'success'
        });
        totalFound++;
      } else {
        log(`  ✗ NOT FOUND: No cover available for "${book.title}"`);
        
        manifest[year].push({
          ...book,
          isbn: isbn || undefined,
          filename: null,
          status: 'not_found',
          error: 'Cover not available on Open Library'
        });
        totalNotFound++;
      }

      if (i < books.length - 1) {
        log(`  → Waiting ${DELAY_MS}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
  }

  log('');
  log('========================================');
  log('SUMMARY');
  log('========================================');
  log(`Total books processed: ${totalFound + totalNotFound}`);
  log(`Covers found: ${totalFound}`);
  log(`Covers not found: ${totalNotFound}`);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  log(`Manifest saved to: ${MANIFEST_PATH}`);

  log('');
  log('Books without covers (for manual lookup):');
  for (const year of years) {
    const notFound = manifest[year].filter(b => b.status === 'not_found');
    if (notFound.length > 0) {
      log(`  ${year}: ${notFound.length} books`);
      for (const book of notFound) {
        log(`    - "${book.title}" by ${book.author}`);
      }
    }
  }

  log('');
  log('========================================');
  log('Done!');
  log('========================================');
}

main().catch(err => {
  log(`ERROR: ${err.message}`);
  process.exit(1);
});
