export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Animated gradient blobs - muted */}
      <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-purple-300/15 dark:bg-purple-400/8 rounded-full blur-3xl animate-blob-1" />
      <div className="absolute top-1/4 right-[15%] w-[500px] h-[500px] bg-blue-300/15 dark:bg-blue-400/8 rounded-full blur-3xl animate-blob-2" />
      <div className="absolute bottom-1/4 left-[20%] w-[500px] h-[500px] bg-pink-300/15 dark:bg-pink-400/8 rounded-full blur-3xl animate-blob-3" />
      <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-green-300/15 dark:bg-green-400/8 rounded-full blur-3xl animate-blob-4" />
    </div>
  )
}

