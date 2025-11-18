export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="text-base sm:text-lg font-semibold text-slate-900">
        Tag Adder
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-sm">
        <a
          href="#manager"
          className="text-slate-700 hover:text-slate-900 hover:underline"
        >
          Manager
        </a>
        <a
          href="#coming-soon-1"
          className="text-slate-400 cursor-not-allowed"
        >
          Coming Soon
        </a>
        <a
          href="#coming-soon-2"
          className="text-slate-400 cursor-not-allowed"
        >
          Coming Soon
        </a>
      </div>
    </nav>
  )
}