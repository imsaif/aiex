const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class BuildOptimizer {
  constructor() {
    this.config = {
      outputDir: './.next',
      publicDir: './public',
      srcDir: './src',
      buildMetrics: './build-metrics.json',
      performanceThresholds: {
        bundleSize: 250000, // 250KB warning threshold
        chunkCount: 50, // Maximum chunks before warning
        buildTime: 120000, // 2 minutes build time warning
      }
    };
    this.metrics = {
      startTime: Date.now(),
      bundleSize: 0,
      chunkCount: 0,
      warnings: [],
      errors: []
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = level.toUpperCase().padEnd(5);
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async analyzeBundleSize() {
    try {
      const nextDir = path.join(this.config.outputDir, 'static');
      if (await this.pathExists(nextDir)) {
        const size = await this.getDirectorySize(nextDir);
        this.metrics.bundleSize = size;
        
        if (size > this.config.performanceThresholds.bundleSize) {
          this.metrics.warnings.push(`Bundle size ${Math.round(size/1024)}KB exceeds threshold`);
        }
        
        this.log(`Bundle size: ${Math.round(size/1024)}KB`);
      }
    } catch (error) {
      this.metrics.errors.push(`Bundle analysis failed: ${error.message}`);
    }
  }

  async analyzeChunks() {
    try {
      const chunksDir = path.join(this.config.outputDir, 'static', 'chunks');
      if (await this.pathExists(chunksDir)) {
        const files = await fs.readdir(chunksDir);
        const jsFiles = files.filter(f => f.endsWith('.js'));
        this.metrics.chunkCount = jsFiles.length;
        
        if (jsFiles.length > this.config.performanceThresholds.chunkCount) {
          this.metrics.warnings.push(`Chunk count ${jsFiles.length} exceeds threshold`);
        }
        
        this.log(`Generated ${jsFiles.length} JavaScript chunks`);
      }
    } catch (error) {
      this.metrics.errors.push(`Chunk analysis failed: ${error.message}`);
    }
  }

  async validateStaticGeneration() {
    try {
      const pagesDir = path.join(this.config.outputDir, 'server', 'pages');
      if (await this.pathExists(pagesDir)) {
        const htmlFiles = await this.findFilesRecursively(pagesDir, '.html');
        this.log(`Static pages generated: ${htmlFiles.length}`);
      }
    } catch (error) {
      this.metrics.errors.push(`Static generation validation failed: ${error.message}`);
    }
  }

  async optimizeAssets() {
    try {
      // Check if image optimization was run
      const publicImages = path.join(this.config.publicDir, 'images');
      if (await this.pathExists(publicImages)) {
        const imageFiles = await this.findFilesRecursively(publicImages, ['.jpg', '.jpeg', '.png', '.webp', '.avif']);
        const webpFiles = imageFiles.filter(f => f.endsWith('.webp'));
        const avifFiles = imageFiles.filter(f => f.endsWith('.avif'));
        
        this.log(`Total images: ${imageFiles.length}`);
        this.log(`WebP images: ${webpFiles.length}`);
        this.log(`AVIF images: ${avifFiles.length}`);
        
        if (webpFiles.length === 0 && imageFiles.length > 0) {
          this.metrics.warnings.push('No WebP images found - consider running image optimization');
        }
      }
    } catch (error) {
      this.metrics.errors.push(`Asset optimization check failed: ${error.message}`);
    }
  }

  async generateBuildReport() {
    const buildTime = Date.now() - this.metrics.startTime;
    this.metrics.buildTime = buildTime;
    
    if (buildTime > this.config.performanceThresholds.buildTime) {
      this.metrics.warnings.push(`Build time ${Math.round(buildTime/1000)}s exceeds threshold`);
    }

    const report = {
      timestamp: new Date().toISOString(),
      buildTime: Math.round(buildTime / 1000),
      bundleSize: Math.round(this.metrics.bundleSize / 1024),
      chunkCount: this.metrics.chunkCount,
      warnings: this.metrics.warnings,
      errors: this.metrics.errors,
      recommendations: this.generateRecommendations()
    };

    await fs.writeFile(this.config.buildMetrics, JSON.stringify(report, null, 2));
    this.log(`Build report saved to ${this.config.buildMetrics}`);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.bundleSize > this.config.performanceThresholds.bundleSize) {
      recommendations.push('Consider code splitting and dynamic imports to reduce bundle size');
    }
    
    if (this.metrics.chunkCount > this.config.performanceThresholds.chunkCount) {
      recommendations.push('High chunk count detected - review webpack configuration');
    }
    
    if (this.metrics.warnings.some(w => w.includes('WebP'))) {
      recommendations.push('Run image optimization script to generate modern image formats');
    }
    
    return recommendations;
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getDirectorySize(dirPath) {
    let size = 0;
    const files = await this.findFilesRecursively(dirPath);
    
    for (const file of files) {
      const stats = await fs.stat(file);
      size += stats.size;
    }
    
    return size;
  }

  async findFilesRecursively(dir, extensions = null) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await this.findFilesRecursively(fullPath, extensions));
      } else {
        if (!extensions || (Array.isArray(extensions) ? 
            extensions.some(ext => entry.name.endsWith(ext)) : 
            entry.name.endsWith(extensions))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  async run() {
    this.log('Starting build optimization analysis...');
    
    await this.analyzeBundleSize();
    await this.analyzeChunks();
    await this.validateStaticGeneration();
    await this.optimizeAssets();
    
    const report = await this.generateBuildReport();
    
    this.log('Build optimization analysis complete!');
    
    if (report.warnings.length > 0) {
      this.log('⚠️  Warnings:', 'warn');
      report.warnings.forEach(warning => this.log(`  - ${warning}`, 'warn'));
    }
    
    if (report.errors.length > 0) {
      this.log('❌ Errors:', 'error');
      report.errors.forEach(error => this.log(`  - ${error}`, 'error'));
    }
    
    if (report.recommendations.length > 0) {
      this.log('💡 Recommendations:', 'info');
      report.recommendations.forEach(rec => this.log(`  - ${rec}`, 'info'));
    }
    
    this.log(`📊 Build Summary: ${report.buildTime}s, ${report.bundleSize}KB, ${report.chunkCount} chunks`);
    
    return report;
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new BuildOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = BuildOptimizer; 