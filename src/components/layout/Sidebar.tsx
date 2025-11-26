import { NavLink } from 'react-router-dom';
import { Home, List, Info, KeyRound, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/dashboard/codes', icon: List, label: 'Meus Códigos' },
  { to: '/dashboard/change-password', icon: KeyRound, label: 'Alterar Senha' },
  { to: '/about', icon: Info, label: 'Sobre' },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 h-full w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={clsx(
                          'h-5 w-5',
                          isActive ? 'text-blue-700' : 'text-gray-500'
                        )}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
