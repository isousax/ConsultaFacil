import { Link } from 'react-router-dom';
import { LogOut, Menu, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header = ({ onMenuClick, showMenuButton = false }: HeaderProps) => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side - Logo e Menu Mobile */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
          )}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              CF
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gray-900 block leading-none">
                ConsultaFácil
              </span>
              <span className="text-xs text-gray-500 block leading-none mt-0.5">
                Gestão de Consultas
              </span>
            </div>
          </Link>
        </div>

        {/* Right side - User Info */}
        {user && (
          <div className="flex items-center gap-2">
            {/* Botão de Logout Mobile */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
              aria-label="Sair da conta"
            >
              <LogOut className="h-5 w-5" />
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                aria-label="Menu do usuário"
              >
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 leading-none">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 leading-none mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-blue-700 text-white font-semibold text-sm shadow-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair da conta
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
