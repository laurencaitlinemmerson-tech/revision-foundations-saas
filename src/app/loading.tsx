export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--lilac)] border-t-[var(--purple)] animate-spin mx-auto mb-4" />
        <p className="text-[var(--plum)] font-medium">Loading...</p>
      </div>
    </div>
  );
}
