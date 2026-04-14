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

      {/* Intake hero skeleton — matches the actual initial paint */}
      <section className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-5xl mx-auto">
            {/* Chip */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-6 w-40 rounded-full bg-background-tertiary animate-pulse" />
            </div>

            {/* H1 */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="h-10 sm:h-12 md:h-14 w-full max-w-xl rounded bg-background-tertiary animate-pulse" />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col items-center gap-2 mb-10 sm:mb-12">
              <div className="h-5 w-full max-w-lg rounded bg-background-secondary animate-pulse" />
              <div className="h-5 w-3/4 max-w-md rounded bg-background-secondary animate-pulse" />
            </div>

            {/* Product type card grid — 5 items, 2 cols on mobile, 5 on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-3 p-4 sm:p-5 border border-border-primary rounded-xl bg-background-primary shadow-card ${
                    i === 4 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-background-tertiary animate-pulse" />
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="h-4 w-24 rounded bg-background-tertiary animate-pulse" />
                    <div className="h-3 w-full rounded bg-background-secondary animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Demo link */}
            <div className="flex justify-center mt-10">
              <div className="h-4 w-32 rounded bg-background-secondary animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
