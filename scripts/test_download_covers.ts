import fs from 'fs';
import path from 'path';

const BOOKS_JSON_PATH = './books_read.json';
const CSV_PATH = './goodreads_library_export.csv';
const OUTPUT_DIR = './public/book_covers';
const API_BASE = 'https://covers.openlibrary.org/b';
const DELAY_MS = 1000;

const TEST_LIMIT = 5;

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

function loadISBNMap(): Map<string, string> {
  const isbnMap = new Map<string, string>();
  
  if (!fs.existsSync(CSV_PATH)) {
    log(`WARNING: ${CSV_PATH} not found`);
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
    log(`  → Found ISBN by exact title match`);
    return isbnMap.get(titleLower) || null;
  }
  
  const authorLastName = author.split(' ').pop()?.toLowerCase() || '';
  for (const [csvTitle, isbn] of isbnMap) {
    if (csvTitle.includes(authorLastName) && csvTitle.includes(titleLower.split(' ')[0])) {
      log(`  → Found ISBN by partial match: "${csvTitle}"`);
      return isbn;
    }
  }
  
  log(`  → No ISBN found for "${title}" by ${author}`);
  return null;
}

async function downloadCover(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    
    if (!response.ok) {
      log(`    Response not OK: ${response.status}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType && !contentType.startsWith('image/')) {
      log(`    Not an image: ${contentType}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (buffer.length < 1000) {
      log(`    Buffer too small: ${buffer.length} bytes`);
      return null;
    }
    
    return buffer;
  } catch (e: any) {
    log(`    Error: ${e.message}`);
    return null;
  }
}

async function main() {
  log('========================================');
  log('TEST MODE: Downloading 5 covers only');
  log('========================================');

  if (!fs.existsSync(BOOKS_JSON_PATH)) {
    log(`ERROR: ${BOOKS_JSON_PATH} not found!`);
    process.exit(1);
  }

  const booksData = JSON.parse(fs.readFileSync(BOOKS_JSON_PATH, 'utf-8'));
  const isbnMap = loadISBNMap();
  
  const years = Object.keys(booksData).sort();

  let count = 0;
  let successCount = 0;
  let failCount = 0;

  for (const year of years) {
    if (count >= TEST_LIMIT) break;
    
    const books = booksData[year];
    const yearDir = path.join(OUTPUT_DIR, year);
    
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }

    for (let i = 0; i < books.length && count < TEST_LIMIT; i++) {
      const book = books[i];
      const filename = generateFilename(book.title, book.author);
      const filepath = path.join(yearDir, filename);

      log(`\n[${count + 1}/${TEST_LIMIT}] ${book.title} (${year})`);
      log(`  Filename: ${filename}`);

      const titleLower = book.title.toLowerCase();
      const isbn = findISBN(book.title, book.author, isbnMap);
      
      if (isbn) log(`  ISBN: ${isbn}`);

      let coverData: Buffer | null = null;
      let method = '';

      if (isbn && isbn.length > 5) {
        const url = `${API_BASE}/isbn/${isbn}-M.jpg`;
        log(`  Trying ISBN: ${url}`);
        coverData = await downloadCover(url);
        if (coverData) method = 'ISBN';
      }

      if (!coverData) {
        const url = `${API_BASE}/title/${sanitizeTitle(book.title)}-M.jpg`;
        log(`  Trying title: ${url}`);
        coverData = await downloadCover(url);
        if (coverData) method = 'title';
      }

      if (coverData) {
        fs.writeFileSync(filepath, coverData);
        log(`  ✓ SUCCESS (${method}): ${year}/${filename}`);
        successCount++;
      } else {
        log(`  ✗ NOT FOUND`);
        failCount++;
      }

      count++;
      
      if (count < TEST_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
  }

  log('\n========================================');
  log('TEST SUMMARY');
  log('========================================');
  log(`Downloaded: ${successCount}`);
  log(`Not found: ${failCount}`);
  log(`Total: ${successCount + failCount}`);
  log('========================================');
}

main().catch(err => {
  log(`ERROR: ${err.message}`);
  process.exit(1);
});
