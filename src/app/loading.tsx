export default function Loading() {
  return (
    <div 
      className="min-h-screen bg-cream flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-[3px] w-20 overflow-hidden rounded-full bg-[rgba(26,24,21,0.08)]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--espresso)]" />
        </div>
        <p className="text-[var(--espresso)] font-medium">Loading...</p>
        <span className="sr-only">Please wait while the page loads</span>
      </div>
    </div>
  );
}
