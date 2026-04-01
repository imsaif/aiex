const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  sourceDir: './public/images',
  quality: 80, // JPEG/WebP quality
  maxWidth: 1920, // Maximum width for images
  formats: ['webp', 'avif'], // Additional formats to generate
  skipExisting: true, // Skip if optimized version exists
  gifThreshold: 500 * 1024, // 500KB - only convert GIFs larger than this
};

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Check if FFmpeg is available
function isFFmpegAvailable() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);

  // Skip if not an image
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return;
  }

  // Special handling for GIFs
  if (ext === '.gif') {
    const stats = await fs.stat(filePath);
    if (stats.size > config.gifThreshold) {
      console.log(`Large GIF found: ${filePath}`);
      
      if (isFFmpegAvailable()) {
        console.log(`Converting large GIF: ${filePath}`);
        try {
          // Convert to WebM
          execSync(`ffmpeg -i "${filePath}" -c:v libvpx-vp9 -crf 30 -b:v 0 "${path.join(dirName, fileName)}.webm"`);
          // Convert to MP4
          execSync(`ffmpeg -i "${filePath}" -c:v libx264 -crf 23 -preset medium "${path.join(dirName, fileName)}.mp4"`);
        } catch (error) {
          console.error(`Error converting GIF ${filePath}:`, error);
        }
      } else {
        console.log(`FFmpeg not available, skipping GIF conversion for: ${filePath}`);
      }
    }
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Skip if image is already small enough
    if (metadata.width <= config.maxWidth) {
      return;
    }

    // Resize image if too large
    image.resize({
      width: config.maxWidth,
      withoutEnlargement: true,
      fit: 'inside'
    });

    // Generate additional formats
    for (const format of config.formats) {
      const outputPath = path.join(dirName, `${fileName}.${format}`);
      
      // Skip if file exists and skipExisting is true
      if (config.skipExisting) {
        try {
          await fs.access(outputPath);
          continue;
        } catch {
          // File doesn't exist, continue with optimization
        }
      }

      console.log(`Generating ${format} for: ${filePath}`);
      
      const formatOptions = {
        quality: config.quality
      };

      if (format === 'avif') {
        formatOptions.speed = 8; // Faster encoding
      }

      await image
        .toFormat(format, formatOptions)
        .toFile(outputPath);
    }

    // Optimize original file
    const optimizedPath = path.join(dirName, `${fileName}.optimized${ext}`);
    await image
      .toFormat(ext.replace('.', ''), { quality: config.quality })
      .toFile(optimizedPath);

    // Replace original with optimized version
    await fs.unlink(filePath);
    await fs.rename(optimizedPath, filePath);

    console.log(`Optimized: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function processDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await optimizeImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// Add script to package.json
async function updatePackageJson() {
  try {
    const packageJson = require('../package.json');
    if (!packageJson.scripts['optimize-images']) {
      packageJson.scripts['optimize-images'] = 'node scripts/optimize-images.js';
      await fs.writeFile(
        '../package.json',
        JSON.stringify(packageJson, null, 2)
      );
      console.log('Added optimize-images script to package.json');
    }
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// Main execution
async function main() {
  console.log('Starting image optimization...');
  
  if (!isFFmpegAvailable()) {
    console.log('FFmpeg not available - GIF conversion will be skipped');
  }
  
  await updatePackageJson();
  await processDirectory(config.sourceDir);
  console.log('Image optimization complete!');
}

main().catch(console.error); 