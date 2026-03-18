import fs from 'fs';
import path from 'path';

const BLOG_DIR = './src/content/blog';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getTitle(): string {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npm run new-post "Your Post Title"');
    process.exit(1);
  }
  return args.join(' ');
}

function main() {
  const title = getTitle();
  const date = new Date().toISOString().split('T')[0];
  const slug = slugify(title);
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(BLOG_DIR, filename);
  
  const content = `---
title: "${title}"
date: "${date}"
---

Write your content here...
`;

  fs.writeFileSync(filepath, content);
  console.log(`Created: ${filename}`);
}

main();
