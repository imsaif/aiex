export default function PatternLoading() {
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

      {/* Pattern header skeleton */}
      <div className="max-w-7xl mx-auto pt-20 md:pt-24 pb-8 px-6">
        {/* Breadcrumb */}
        <div className="h-4 w-40 rounded bg-background-tertiary animate-pulse mb-6" />

        {/* Category badge */}
        <div className="h-6 w-32 rounded-full bg-background-tertiary animate-pulse mb-6" />

        {/* Title */}
        <div className="h-12 w-2/3 rounded bg-background-tertiary animate-pulse mb-4" />

        {/* Description */}
        <div className="h-6 w-full rounded bg-background-secondary animate-pulse mb-2" />
        <div className="h-6 w-3/4 rounded bg-background-secondary animate-pulse mb-10" />

        {/* Problem / Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface-primary dark:bg-surface-secondary rounded-lg border border-border-primary p-6 h-48 animate-pulse">
            <div className="h-6 w-24 rounded bg-background-tertiary mb-4" />
            <div className="h-4 w-full rounded bg-background-secondary mb-2" />
            <div className="h-4 w-5/6 rounded bg-background-secondary mb-2" />
            <div className="h-4 w-2/3 rounded bg-background-secondary" />
          </div>
          <div className="bg-surface-primary dark:bg-surface-secondary rounded-lg border border-border-primary p-6 h-48 animate-pulse">
            <div className="h-6 w-24 rounded bg-background-tertiary mb-4" />
            <div className="h-4 w-full rounded bg-background-secondary mb-2" />
            <div className="h-4 w-5/6 rounded bg-background-secondary mb-2" />
            <div className="h-4 w-2/3 rounded bg-background-secondary" />
          </div>
        </div>

        {/* Examples skeleton */}
        <div className="h-64 w-full rounded-lg bg-background-tertiary animate-pulse" />
      </div>
    </div>
  );
}
