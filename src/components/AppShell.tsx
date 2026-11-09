'use client';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { useQuizStore } from '@/store/useQuizStore';
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
  const [mounted, setMounted] = React.useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const loadBookmarks = useBookmarkStore((s) => s.loadBookmarks);
  const loadPublishedQuizzes = useQuizStore((s) => s.loadPublishedQuizzes);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    restoreSession();
    loadBookmarks();
    loadPublishedQuizzes();
  }, [restoreSession, loadBookmarks, loadPublishedQuizzes]);

  const pageInfo = pageTitles[pathname] || { title: 'EnglishAI', subtitle: '' };

  // If receiving OAuth callback, allow rendering callback page
  if (pathname === '/auth/callback') {
    return <>{children}</>;
  }

  // If viewing about page, render landing page in full-screen mode
  if (pathname === '/about') {
    return <LandingPage />;
  }

  // Prevent flashing LandingPage when refreshing while logged in
  const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

  if (!mounted) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          background: 'var(--bg-primary, #f8fafc)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(108,99,255,0.2)',
          borderTopColor: '#6c63ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  // If not logged in and no stored token, render landing page
  if (!isLoggedIn && !hasLocalToken) {
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
