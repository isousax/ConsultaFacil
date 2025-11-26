import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { Footer } from '../../components/layout/Footer';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        showMenuButton={true}
      />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 bg-gray-50 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
