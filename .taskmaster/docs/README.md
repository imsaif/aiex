# Optimizing Media for Better Performance

This project includes tools to optimize large GIF files to improve page transition times and overall performance.

## Converting GIFs to Video Formats

Large GIFs (>500KB) should be converted to more efficient video formats (WebM/MP4) to significantly improve load times. We've created a script to automatically handle this conversion.

### Prerequisites

1. Install [FFmpeg](https://ffmpeg.org/download.html) on your system
2. Make sure it's available in your PATH

### Running the Conversion Script

```bash
# Run from the project root
npm run convert-gifs
```

This will:
1. Scan the `public/images/examples` directory for GIFs
2. Convert GIFs larger than 500KB to both WebM and MP4 formats
3. Keep the original GIF for fallback compatibility
4. Report size savings (typically 60-95% smaller)

### Using Optimized Media in Components

Our custom `OptimizedMedia` component automatically:
- Detects if a video version exists for GIFs
- Uses the appropriate format based on browser support
- Applies lazy loading for better performance
- Shows a loading skeleton during media loading

Example usage:

```jsx
import OptimizedMedia from '@/components/ui/OptimizedMedia';

// In your component:
<OptimizedMedia
  src="/images/examples/example.gif" 
  alt="Example"
  width={800}
  height={600}
  priority={false}
/>
```

The component will automatically check for and use `/images/examples/example.webm` and `/images/examples/example.mp4` if they exist.

## Performance Improvements

Converting GIFs to video formats typically results in:
- 60-95% smaller file sizes
- Much faster page transitions
- Lower memory usage
- Smoother playback

This approach has been implemented across the site to provide a more responsive experience, especially during navigation between pages. 