// Script d'optimisation des images du dossier images/
// Utilise sharp pour convertir en WebP et réduire la taille

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images_optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if(['.jpg', '.jpeg', '.png'].includes(ext)) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, path.parse(file).name + '.webp');
    sharp(inputPath)
      .resize({ width: 800 }) // Redimensionne à 800px max
      .webp({ quality: 75 }) // Convertit en WebP qualité 75
      .toFile(outputPath)
      .then(() => console.log(`Optimisé: ${file} -> ${outputPath}`))
      .catch(err => console.error(`Erreur sur ${file}:`, err));
  }
});

console.log('Optimisation lancée. Les images optimisées sont dans le dossier images_optimized.');
