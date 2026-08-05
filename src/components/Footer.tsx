'use client';
import React from 'react';
import Link from 'next/link';
import { Zap, Globe, Award, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50/50 border-t border-gray-100 mt-16 pt-12 pb-8 px-6 md:px-12 text-gray-500 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400/70 select-none">
            <div className="w-7 h-7 bg-slate-200/50 rounded-lg flex items-center justify-center opacity-70">
              <Zap size={14} className="text-slate-400" />
            </div>
            <span className="font-bold text-[13px] tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>EnglishAI</span>
          </div>
          <p className="leading-relaxed text-gray-400 max-w-[200px]">
            Master your IELTS Listening & Reading skills with the power of advanced language models.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a href="#" className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-violet-600 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-violet-600 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.018 0 12 0 12s0 3.982.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.982 24 12 24 12s0-3.982-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-violet-600 transition-all shadow-sm">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>

        {/* Company column */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3.5 uppercase tracking-wider text-[10px]">Company</h4>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/about" className="hover:text-violet-600 transition-colors">
                About Us
              </Link>
            </li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Premium Plans</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Academic Integrity</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Jobs</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Blog</a></li>
          </ul>
        </div>

        {/* Study Tools column */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3.5 uppercase tracking-wider text-[10px]">Study Tools</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/listening" className="hover:text-violet-600 transition-colors">AI Listening Quiz</Link></li>
            <li><Link href="/reading" className="hover:text-violet-600 transition-colors">AI Reading Practice</Link></li>
            <li><Link href="/" className="hover:text-violet-600 transition-colors">Progress Dashboard</Link></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Ask AI Assistant</a></li>
          </ul>
        </div>

        {/* Legal column */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3.5 uppercase tracking-wider text-[10px]">Legal</h4>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-violet-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Cookie Settings</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Cookie Statement</a></li>
            <li><a href="#" className="hover:text-violet-600 transition-colors">Copyright & DMCA</a></li>
          </ul>
        </div>

        {/* Reviews and Badges */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-gray-800 mb-0.5 uppercase tracking-wider text-[10px]">App & Trust</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100/60 border border-gray-200/50 max-w-[180px]">
              <Award size={16} className="text-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-700 text-[10px] truncate">10,000+ Reviews</p>
                <p className="text-[9px] text-gray-400">100% Verified Community</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100/60 border border-gray-200/50 max-w-[180px]">
              <Shield size={16} className="text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-gray-700 text-[10px] truncate">Secure Platform</p>
                <p className="text-[9px] text-gray-400">100% GDPR Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-[11px]">
        <p>© 2026 EnglishAI. Built for IELTS excellence.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Globe size={11} /> English (US)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Status: All systems functional</span>
        </div>
      </div>
    </footer>
  );
}
