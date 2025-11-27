import { NavLink } from 'react-router-dom';
import { Home, List, Info, KeyRound, X, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { useEffect } from 'react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard', end: true },
  { to: '/dashboard/codes', icon: List, label: 'Meus Códigos' },
  { to: '/dashboard/change-password', icon: KeyRound, label: 'Alterar Senha' },
  { to: '/dashboard/help', icon: FileText, label: 'Central de Ajuda' },
  { to: '/dashboard/about', icon: Info, label: 'Sobre' },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Bloquear scroll do body quando o menu está aberto no mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:z-30',
          isOpen ? 'translate-x-0 z-60 top-0 h-screen' : '-translate-x-full'
        )}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-gray-900">Menu de Navegação</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100%-56px)] lg:h-full">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Principal
              </p>
            </div>
            <ul className="space-y-1 px-3 pb-4">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={clsx(
                          'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
                          isActive ? 'bg-blue-100' : 'bg-gray-100'
                        )}>
                          <item.icon
                            className={clsx(
                              'h-4 w-4',
                              isActive ? 'text-blue-700' : 'text-gray-600'
                            )}
                          />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer da Sidebar */}
          <div className="border-t border-gray-200 p-4 shrink-0">
            <a
              href="https://github.com/isousax/ConsultaF-cil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">GitHub</p>
                <p className="text-xs text-gray-500 truncate">Repositório</p>
              </div>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};
