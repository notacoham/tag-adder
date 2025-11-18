export const Navbar = ({ activeTab, onChangeTab }) => {
  const baseLink =
    'px-2 sm:px-3 py-1 rounded-full text-sm transition-colors cursor-pointer'

  const activeLink = `${baseLink} bg-slate-900 text-white`
  const inactiveLink = `${baseLink} text-slate-700 hover:text-slate-900 hover:bg-slate-100`

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="text-base sm:text-lg font-semibold text-slate-900">
        Tag Adder
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChangeTab('manager')}
          className={activeTab === 'manager' ? activeLink : inactiveLink}
        >
          Manager
        </button>
        <button
          type="button"
          onClick={() => onChangeTab('specialist')}
          className={activeTab === 'specialist' ? activeLink : inactiveLink}
        >
          Specialist
        </button>
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
          Coming Soon
        </span>
      </div>
    </nav>
  )
}