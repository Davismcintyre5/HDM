import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="theme-smartgen min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
      <div className="text-center text-xs text-[var(--text-muted)] pb-6">
        © {new Date().getFullYear()} HDM Technologies
      </div>
    </div>
  );
}