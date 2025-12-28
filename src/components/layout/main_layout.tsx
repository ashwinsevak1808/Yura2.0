import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import { ToastContainer } from '../ui/toast';
import WhatsAppWidget from '../ui/whatsapp-widget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ToastContainer />
      <WhatsAppWidget />
    </div>
  );
};