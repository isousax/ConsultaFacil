import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { Footer } from '../../components/layout/Footer';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header - z-50 */}
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        showMenuButton={true}
      />

      {/* Layout Container - abaixo do header */}
      <div className="flex pt-16">
        {/* Sidebar - z-30, abaixo do header */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <div className="min-h-[calc(100vh-4rem)] bg-white/40">
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
              <Outlet />
            </div>
          </div>
          
          {/* Footer dentro do main */}
          <Footer />
        </main>
      </div>
    </div>
  );
};