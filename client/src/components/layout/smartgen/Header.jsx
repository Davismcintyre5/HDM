import { Link, useNavigate } from 'react-router-dom';
import { HiSun, HiMoon, HiLogout, HiUser } from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Dropdown from '../../ui/Dropdown';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[var(--accent)] text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/smartgen" className="flex items-center gap-2 font-bold">
          <span>✨</span>
          <span>SmartGen</span>
        </Link>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-white/10" aria-label="Toggle theme">
            {theme === 'dark' ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
          </button>

          {user ? (
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-1 rounded hover:bg-white/10">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              }
            >
              <Link to="/smartgen/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                <HiUser className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={() => { logout(); navigate('/smartgen'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-[var(--bg-tertiary)]"
              >
                <HiLogout className="w-4 h-4" /> Logout
              </button>
            </Dropdown>
          ) : (
            <Link to="/smartgen/login" className="px-4 py-1.5 rounded-lg bg-white text-[var(--accent)] text-sm font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}