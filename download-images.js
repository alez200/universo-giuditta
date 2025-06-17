const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');
const { URL } = require('url');

const subjectsDir = path.join(__dirname, 'subjects');
const imagesDir = path.join(__dirname, 'resources', 'images', 'subjects');

// Funzione per ottenere l'estensione del file dall'URL
function getExtensionFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const ext = path.extname(pathname);
    return ext || '.jpg'; // Default a .jpg se non c'è estensione
  } catch (err) {
    return '.jpg'; // Default a .jpg in caso di errore
  }
}

// Funzione per scaricare un'immagine
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${filename}`);
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Funzione per estrarre gli array slides
async function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Cerca l'array slides nel contenuto
  const slidesMatch = content.match(/const\s+slides\s*=\s*(\[[\s\S]*?\]);/);
  
  if (!slidesMatch) {
    console.log(`No slides array found in ${filePath}`);
    return;
  }
  
  try {
    // Evalua l'array slides in modo sicuro
    const slidesStr = slidesMatch[1];
    const slides = eval(slidesStr);
    const subjectName = path.basename(filePath, '.html');
    
    console.log(`Found ${slides.length} slides in ${subjectName}`);
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.image) {
        const imageUrl = slide.image;
        const ext = getExtensionFromUrl(imageUrl);
        const imageName = `${subjectName}_${i + 1}${ext}`;
        const imagePath = path.join(imagesDir, imageName);
        
        try {
          await downloadImage(imageUrl, imagePath);
        } catch (err) {
          console.error(`Error downloading ${imageUrl}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

// Processa tutti i file HTML nella cartella subjects
async function main() {
  // Assicurati che la directory delle immagini esista
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const files = fs.readdirSync(subjectsDir)
    .filter(file => file.endsWith('.html'));
  
  console.log(`Found ${files.length} HTML files to process`);
  
  for (const file of files) {
    const filePath = path.join(subjectsDir, file);
    await processFile(filePath);
  }
}

main().catch(console.error); 