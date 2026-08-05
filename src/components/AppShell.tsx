'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '@/context/AppContext';
import AuthModal from './AuthModal';
import LandingPage from './LandingPage';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your learning progress' },
  '/listening': { title: 'Listening Practice', subtitle: 'Improve your listening skills with YouTube videos' },
  '/reading': { title: 'Reading Practice', subtitle: 'Boost your reading skills with IELTS-standard exercises' },
  '/mytests': { title: 'My Tests', subtitle: 'Manage your created quizzes, saved tests, and test history' },
  '/profile': { title: 'Profile', subtitle: 'Personal information and statistics' },
  '/about': { title: 'About Us', subtitle: 'Learn more about EnglishAI' },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, sidebarOpen } = useApp();
  const pathname = usePathname();

  const pageInfo = pageTitles[pathname] || { title: 'EnglishAI', subtitle: '' };

  // If not logged in, always render landing page
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  // If viewing about page, render landing page in full-screen mode
  if (pathname === '/about') {
    return <LandingPage />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div 
        className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
        }}
      >
        <Topbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main 
          style={{ 
            flex: 1, 
            padding: '28px 32px 0 32px', 
            minWidth: 0, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
