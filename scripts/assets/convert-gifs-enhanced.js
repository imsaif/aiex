/**
 * Enhanced GIF to Modern Format Converter
 * Converts large GIF files to WebM, MP4, and AVIF formats
 * Based on 2025 optimization research - targeting 80-85% size reduction
 */

const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// 2025 Optimization Configuration
const OPTIMIZATION_CONFIG = {
  // Video conversion settings (research-optimized)
  webm: {
    codec: 'libvpx-vp9',
    crf: 30,
    bitrate: '0', // Variable bitrate for best compression
    pixelFormat: 'yuva420p',
    passes: 2, // Two-pass encoding for optimal quality
    speed: 1,  // Slower encoding for better compression
  },
  
  mp4: {
    codec: 'libx264', 
    crf: 23,
    preset: 'medium',
    pixelFormat: 'yuv420p',
    movflags: '+faststart' // Web optimization
  },
  
  // AVIF animated settings
  avif: {
    speed: 8,
    quality: 75,
    effort: 6
  },
  
  // Processing thresholds
  minSize: 500 * 1024,   // Only convert files > 500KB (matches current threshold)
  targetReduction: 0.8,  // Target 80% size reduction
  maxConcurrent: 3       // Max parallel conversions
};

// Directory configuration
const config = {
  sourceDir: './public/images/examples',
  logLevel: 'info'
};

// Logging utility
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase().padEnd(5);
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Check if FFmpeg is available
function isFFmpegAvailable() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Get file size in bytes
async function getFileSizeInBytes(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

// Check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Convert GIF to WebM using optimized settings
async function convertToWebM(gifPath, outputPath) {
  const { webm } = OPTIMIZATION_CONFIG;
  
  try {
    log(`Converting to WebM: ${path.basename(gifPath)}`);
    
    // Two-pass WebM encoding for optimal compression
    const pass1Cmd = `ffmpeg -i "${gifPath}" \\
      -c:v ${webm.codec} \\
      -crf ${webm.crf} \\
      -b:v ${webm.bitrate} \\
      -pix_fmt ${webm.pixelFormat} \\
      -speed ${webm.speed} \\
      -pass 1 \\
      -an \\
      -f webm \\
      -y /dev/null`;
    
    const pass2Cmd = `ffmpeg -i "${gifPath}" \\
      -c:v ${webm.codec} \\
      -crf ${webm.crf} \\
      -b:v ${webm.bitrate} \\
      -pix_fmt ${webm.pixelFormat} \\
      -speed ${webm.speed} \\
      -pass 2 \\
      -an \\
      -y "${outputPath}"`;
    
    execSync(pass1Cmd.replace(/\\\\/g, ''));
    execSync(pass2Cmd.replace(/\\\\/g, ''));
    
    return true;
  } catch (error) {
    log(`WebM conversion failed for ${gifPath}: ${error.message}`, 'error');
    return false;
  }
}

// Convert GIF to MP4 using optimized settings
async function convertToMP4(gifPath, outputPath) {
  const { mp4 } = OPTIMIZATION_CONFIG;
  
  try {
    log(`Converting to MP4: ${path.basename(gifPath)}`);
    
    const cmd = `ffmpeg -i "${gifPath}" \\
      -c:v ${mp4.codec} \\
      -crf ${mp4.crf} \\
      -preset ${mp4.preset} \\
      -pix_fmt ${mp4.pixelFormat} \\
      -movflags ${mp4.movflags} \\
      -an \\
      -y "${outputPath}"`;
    
    execSync(cmd.replace(/\\\\/g, ''));
    return true;
  } catch (error) {
    log(`MP4 conversion failed for ${gifPath}: ${error.message}`, 'error');
    return false;
  }
}

// Convert GIF to AVIF using Sharp
async function convertToAVIF(gifPath, outputPath) {
  const { avif } = OPTIMIZATION_CONFIG;
  
  try {
    log(`Converting to AVIF: ${path.basename(gifPath)}`);
    
    const image = sharp(gifPath, { animated: true });
    await image
      .avif({ 
        quality: avif.quality,
        effort: avif.effort,
        speed: avif.speed
      })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    log(`AVIF conversion failed for ${gifPath}: ${error.message}`, 'warn');
    return false;
  }
}

// Process a single GIF file
async function processGifFile(gifPath) {
  const baseName = path.basename(gifPath, '.gif');
  const dirName = path.dirname(gifPath);
  const basePath = path.join(dirName, baseName);
  
  const webmPath = `${basePath}.webm`;
  const mp4Path = `${basePath}.mp4`;
  const avifPath = `${basePath}.avif`;
  
  const originalSize = await getFileSizeInBytes(gifPath);
  const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(2);
  
  log(`Processing ${baseName}.gif (${originalSizeMB}MB)`);
  
  // Skip if file is too small
  if (originalSize < OPTIMIZATION_CONFIG.minSize) {
    log(`Skipping small file: ${baseName}.gif (${originalSizeMB}MB)`, 'info');
    return { skipped: true, reason: 'too small' };
  }
  
  const results = {
    original: originalSize,
    webm: { created: false, size: 0, reduction: 0 },
    mp4: { created: false, size: 0, reduction: 0 },
    avif: { created: false, size: 0, reduction: 0 }
  };
  
  // Convert to WebM (priority format)
  if (!await fileExists(webmPath)) {
    if (await convertToWebM(gifPath, webmPath)) {
      results.webm.created = true;
      results.webm.size = await getFileSizeInBytes(webmPath);
      results.webm.reduction = ((originalSize - results.webm.size) / originalSize * 100).toFixed(1);
    }
  } else {
    log(`WebM already exists: ${baseName}.webm`);
    results.webm.size = await getFileSizeInBytes(webmPath);
    results.webm.reduction = ((originalSize - results.webm.size) / originalSize * 100).toFixed(1);
  }
  
  // Convert to MP4 (fallback format)
  if (!await fileExists(mp4Path)) {
    if (await convertToMP4(gifPath, mp4Path)) {
      results.mp4.created = true;
      results.mp4.size = await getFileSizeInBytes(mp4Path);
      results.mp4.reduction = ((originalSize - results.mp4.size) / originalSize * 100).toFixed(1);
    }
  } else {
    log(`MP4 already exists: ${baseName}.mp4`);
    results.mp4.size = await getFileSizeInBytes(mp4Path);
    results.mp4.reduction = ((originalSize - results.mp4.size) / originalSize * 100).toFixed(1);
  }
  
  // Convert to AVIF (cutting-edge format)
  if (!await fileExists(avifPath)) {
    if (await convertToAVIF(gifPath, avifPath)) {
      results.avif.created = true;
      results.avif.size = await getFileSizeInBytes(avifPath);
      results.avif.reduction = ((originalSize - results.avif.size) / originalSize * 100).toFixed(1);
    }
  } else {
    log(`AVIF already exists: ${baseName}.avif`);
    if (await fileExists(avifPath)) {
      results.avif.size = await getFileSizeInBytes(avifPath);
      results.avif.reduction = ((originalSize - results.avif.size) / originalSize * 100).toFixed(1);
    }
  }
  
  return results;
}

// Find all GIF files in directory
async function findGifFiles(directory) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await findGifFiles(fullPath));
    } else if (entry.name.toLowerCase().endsWith('.gif')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Generate summary report
function generateSummary(results) {
  const processed = results.filter(r => !r.skipped);
  const skipped = results.filter(r => r.skipped);
  
  let totalOriginal = 0;
  let totalWebM = 0;
  let totalMP4 = 0;
  let totalAVIF = 0;
  
  processed.forEach(result => {
    totalOriginal += result.original;
    totalWebM += result.webm.size;
    totalMP4 += result.mp4.size;
    totalAVIF += result.avif.size;
  });
  
  const webmReduction = ((totalOriginal - totalWebM) / totalOriginal * 100).toFixed(1);
  const mp4Reduction = ((totalOriginal - totalMP4) / totalOriginal * 100).toFixed(1);
  const avifReduction = totalAVIF > 0 ? ((totalOriginal - totalAVIF) / totalOriginal * 100).toFixed(1) : '0';
  
  log('\\n=== CONVERSION SUMMARY ===');
  log(`Files processed: ${processed.length}`);
  log(`Files skipped: ${skipped.length}`);
  log(`Original total: ${(totalOriginal / (1024 * 1024)).toFixed(2)}MB`);
  log(`WebM total: ${(totalWebM / (1024 * 1024)).toFixed(2)}MB (${webmReduction}% reduction)`);
  log(`MP4 total: ${(totalMP4 / (1024 * 1024)).toFixed(2)}MB (${mp4Reduction}% reduction)`);
  if (totalAVIF > 0) {
    log(`AVIF total: ${(totalAVIF / (1024 * 1024)).toFixed(2)}MB (${avifReduction}% reduction)`);
  }
  log('========================\\n');
}

// Main execution function
async function main() {
  log('🚀 Starting Enhanced GIF Conversion (2025 Optimized)');
  
  // Check FFmpeg availability
  if (!isFFmpegAvailable()) {
    log('❌ FFmpeg not found. Please install FFmpeg first:', 'error');
    log('   macOS: brew install ffmpeg', 'error');
    log('   Ubuntu: sudo apt install ffmpeg', 'error');
    log('   Windows: Download from https://ffmpeg.org/', 'error');
    process.exit(1);
  }
  
  log('✅ FFmpeg detected');
  
  // Find all GIF files
  const gifFiles = await findGifFiles(config.sourceDir);
  log(`📁 Found ${gifFiles.length} GIF files`);
  
  if (gifFiles.length === 0) {
    log('No GIF files found to process', 'warn');
    return;
  }
  
  // Process files
  const results = [];
  for (const gifFile of gifFiles) {
    try {
      const result = await processGifFile(gifFile);
      results.push(result);
    } catch (error) {
      log(`Error processing ${gifFile}: ${error.message}`, 'error');
    }
  }
  
  // Generate summary
  generateSummary(results);
  
  log('🎉 Enhanced GIF conversion complete!');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  processGifFile,
  isFFmpegAvailable,
  OPTIMIZATION_CONFIG
};