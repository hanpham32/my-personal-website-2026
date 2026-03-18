import fs from 'fs';
import path from 'path';

const BLOG_DIR = './src/content/blog';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getDateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  
  let renamed = 0;
  let skipped = 0;
  const changes: string[] = [];

  for (const file of files) {
    const filepath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
    if (!titleMatch) {
      console.log(`Skipping ${file}: no title found`);
      skipped++;
      continue;
    }

    const title = titleMatch[1];
    const date = getDateFromFilename(file);
    
    if (!date) {
      console.log(`Skipping ${file}: no date in filename`);
      skipped++;
      continue;
    }

    const newSlug = slugify(title);
    const newFilename = `${date}-${newSlug}.md`;
    
    if (newFilename !== file) {
      const newPath = path.join(BLOG_DIR, newFilename);
      fs.renameSync(filepath, newPath);
      changes.push(`${file} → ${newFilename}`);
      renamed++;
    }
  }

  console.log(`\nRenamed: ${renamed}`);
  console.log(`Skipped: ${skipped}`);
  
  if (changes.length > 0) {
    console.log('\nChanges:');
    changes.forEach(c => console.log(`  ${c}`));
  } else {
    console.log('\nNo changes needed.');
  }
}

main();
