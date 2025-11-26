import { Link } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header = ({ onMenuClick, showMenuButton = false }: HeaderProps) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              CF
            </div>
            <span className="text-xl font-bold text-gray-900">
              ConsultaFácil
            </span>
          </Link>
        </div>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{user.full_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
