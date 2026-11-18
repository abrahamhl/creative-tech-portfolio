import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

async function build() {
  console.log('Building portfolio static site...');
  
  // Create dist if it doesn't exist
  const distDir = path.join(ROOT, 'dist');
  await fs.mkdir(distDir, { recursive: true });

  // Read template
  const templatePath = path.join(ROOT, 'src', 'template.html');
  let html = await fs.readFile(templatePath, 'utf-8');

  // We could inject dynamic data here if we had `data.json`
  // For the PoC, we just prove the SSG build step works
  
  html = html.replace('<!-- INJECT_BUILD_TIME -->', `<!-- Built at: ${new Date().toISOString()} -->`);

  // Write output
  const outputPath = path.join(distDir, 'index.html');
  await fs.writeFile(outputPath, html);
  
  // Preserve human-readable CV and specialist employer landing routes in the build output.
  // No hidden download or personal data processing.
  for (const route of ['cv', 'industry-ai']) {
    await fs.cp(path.join(ROOT, route), path.join(distDir, route), { recursive: true, force: true });
  }

  // Fail explicitly if a recruiter-facing page is accidentally omitted.
  for (const required of ['index.html', 'cv/index.html', 'industry-ai/index.html']) {
    await fs.access(path.join(distDir, required));
  }

  
  console.log('Build complete! Output written to dist/index.html');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
