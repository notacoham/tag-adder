export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="text-lg font-semibold">
        Tag Adder
      </div>
      <div className="flex items-center gap-6 text-sm">
        <a href="#manager" className="hover:underline">Manager</a>
        <a href="#coming-soon-1" className="text-gray-400 cursor-not-allowed">Coming Soon</a>
        <a href="#coming-soon-2" className="text-gray-400 cursor-not-allowed">Coming Soon</a>
      </div>
    </nav>
  )
}