export default function AuditLoading() {
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

      {/* Audit tool layout skeleton */}
      <div className="relative min-h-[500px] md:min-h-[600px] lg:h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
        {/* Dark gradient background matching the actual page */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

        <div className="flex-1 relative z-10 p-4 xl:p-6 flex gap-4">
          {/* Left panel - Upload area skeleton */}
          <div className="flex-1 bg-background-primary/90 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col items-center justify-center gap-6 p-8">
            {/* Upload icon placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-background-tertiary animate-pulse" />

            {/* Title placeholder */}
            <div className="h-7 w-64 rounded bg-background-tertiary animate-pulse" />

            {/* Subtitle placeholder */}
            <div className="h-5 w-80 rounded bg-background-secondary animate-pulse" />

            {/* Upload button placeholder */}
            <div className="h-12 w-48 rounded-xl bg-background-tertiary animate-pulse mt-2" />

            {/* Format text placeholder */}
            <div className="h-4 w-56 rounded bg-background-secondary animate-pulse" />
          </div>

          {/* Right panel - Welcome/Results skeleton (desktop only) */}
          <div className="hidden lg:flex w-[380px] flex-shrink-0 bg-background-primary/90 rounded-2xl shadow-2xl flex-col p-6 gap-4">
            {/* Title */}
            <div className="h-6 w-40 rounded bg-background-tertiary animate-pulse" />

            {/* Description lines */}
            <div className="h-4 w-full rounded bg-background-secondary animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-background-secondary animate-pulse" />

            {/* Feature cards */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-background-secondary rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-background-tertiary" />
                  <div className="h-5 w-32 rounded bg-background-tertiary" />
                </div>
                <div className="h-4 w-full rounded bg-background-tertiary/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
