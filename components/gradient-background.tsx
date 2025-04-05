export function GradientBackground() {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-purple-900/20 via-black to-black z-0" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-pink-700/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-black to-transparent z-0" />
    </>
  )
}

