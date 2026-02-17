export default function Loading() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Navbar skeleton */}
      <nav className="w-full py-5 border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-background-tertiary animate-pulse" />
            <div className="w-12 h-5 rounded bg-background-tertiary animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-5 rounded bg-background-tertiary animate-pulse" />
            <div className="w-14 h-5 rounded bg-background-tertiary animate-pulse" />
            <div className="w-14 h-5 rounded bg-background-tertiary animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero skeleton */}
      <section className="pt-16 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="h-14 w-3/4 mx-auto rounded bg-background-tertiary animate-pulse mb-9" />
            <div className="h-8 w-2/3 mx-auto rounded bg-background-tertiary animate-pulse mb-12" />
            <div className="h-10 w-48 mx-auto rounded bg-background-tertiary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Pattern grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-primary dark:bg-surface-secondary rounded-2xl p-8 border border-border-primary h-64 animate-pulse"
            >
              <div className="h-5 w-3/4 rounded bg-background-tertiary mb-4" />
              <div className="h-4 w-full rounded bg-background-secondary mb-2" />
              <div className="h-4 w-5/6 rounded bg-background-secondary mb-2" />
              <div className="h-4 w-2/3 rounded bg-background-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
