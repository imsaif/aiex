export default function AuthorFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-16">
      <div>
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">About the author</p>
        <p className="text-base text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Imran Mohammed</strong> is a product designer who studies how the best AI products are designed. He studies and documents AI/UX patterns from shipped products (36 and counting) and is building{' '}
          <a href="https://gist.design" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Gist.design</a>, an AI design thinking partner. His weekly analysis reaches thousands of designers on Medium.
        </p>
        <div className="flex items-center gap-x-2 mt-3 text-sm">
          <a href="https://www.imranaidesign.com/" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Portfolio</a>
          <span className="text-text-tertiary">·</span>
          <a href="https://gist.design" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">Gist.design</a>
          <span className="text-text-tertiary">·</span>
          <a href="https://github.com/imsaif/aiex" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
