export default function NewsLoading() {
  return (
    <main className="min-h-screen bg-background-primary">
      {/* Navbar placeholder */}
      <div className="h-16 border-b border-border-primary" />

      {/* Hero skeleton */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="h-6 w-48 bg-background-secondary rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-12 w-64 bg-background-secondary rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-96 bg-background-secondary rounded-lg mx-auto mb-8 animate-pulse" />
            <div className="h-12 w-80 bg-background-secondary rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* List skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="h-8 w-48 bg-background-secondary rounded mb-8 animate-pulse" />
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-border-secondary">
              <div className="w-2 h-2 rounded-full bg-background-secondary animate-pulse" />
              <div className="w-16 h-4 bg-background-secondary rounded animate-pulse" />
              <div className="flex-1 h-4 bg-background-secondary rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
