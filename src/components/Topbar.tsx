'use client';
import React, { useState } from 'react';
import { Bell, Search, Menu, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { setSidebarOpen, sidebarOpen, user, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-14 md:h-16 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-lg transition-colors shrink-0"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          {subtitle && <p className="hidden md:block text-xs -mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">

        <button className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg md:rounded-xl"
          style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ background: 'var(--accent-primary)', border: '2px solid white' }} />
        </button>

        {user && (
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 md:gap-2 bg-gray-50 border border-gray-100 rounded-lg md:rounded-xl p-0.5 md:p-1 md:pr-2 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer select-none"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #5b5bd6, #7c3aed)' }}>
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-gray-800 leading-tight">{user.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-semibold bg-violet-50 text-violet-600 border border-violet-200 px-1 py-0.25 rounded">
                    {user.level}
                  </span>
                  <span className="text-[9px] font-semibold text-amber-600 flex items-center gap-0.5">
                    🔥 {user.streak}
                  </span>
                </div>
              </div>
              <ChevronDown size={14} className={`hidden md:block text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {dropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in-up">
                  <a href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <UserIcon size={14} className="text-gray-400" />
                    <span>Profile</span>
                  </a>
                  <a href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={14} className="text-gray-400" />
                    <span>Settings</span>
                  </a>
                  <div className="h-px bg-gray-100 my-1" />
                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-none bg-none text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
