'use client';
import React, { useState } from 'react';
import {
  User, Mail, Calendar, Trophy, Flame, BookOpen, Headphones,
  Target, Edit3, Save, X, Camera, TrendingUp, Star, Award,
  Clock, Zap
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useStatsStore } from '@/store/useStatsStore';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color, fontWeight: 600 }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProfilePage() {
  const { user, exercises } = useApp();
  const weeklyData = useStatsStore((state) => state.weeklyData);
  const monthlyProgress = useStatsStore((state) => state.monthlyProgress);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editLevel, setEditLevel] = useState(user?.level || 'B2');

  if (!user) return null;

  const completed = exercises.filter(e => e.status === 'completed');
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, e) => s + (e.score || 0), 0) / completed.length)
    : 0;
  const listeningCount = exercises.filter(e => e.type === 'listening').length;
  const readingCount = exercises.filter(e => e.type === 'reading').length;
  const bestScore = completed.length > 0 ? Math.max(...completed.map(e => e.score || 0)) : 0;

  const currentLevelIdx = CEFR_LEVELS.indexOf(editLevel);
  const levelProgress = ((currentLevelIdx + 1) / CEFR_LEVELS.length) * 100;

  const stats = [
    { label: 'Total Exercises', value: exercises.length, icon: BookOpen, color: 'purple', change: '+3 this week' },
    { label: 'Average Score', value: `${avgScore}%`, icon: Target, color: 'green', change: '+5% vs last month' },
    { label: 'Current Streak', value: `${user?.streak || 0} days`, icon: Flame, color: 'orange', change: 'Personal best!' },
    { label: 'Study Time', value: '28h', icon: Clock, color: 'blue', change: 'This month' },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full max-w-5xl mx-auto py-2">
      {/* Profile Header */}
      <div className="card p-5 md:p-6" style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(167,139,250,0.06))',
        border: '1px solid rgba(108,99,255,0.2)'
      }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 md:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-md shadow-indigo-200"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #10b981)', boxShadow: '0 0 30px rgba(108,99,255,0.4)' }}>
              {user.name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-white cursor-pointer transition-colors shadow"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)' }}>
              <Camera size={11} color="white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            {editing ? (
              <div className="flex flex-col gap-3.5 items-center sm:items-start">
                <input
                  className="w-full max-w-xs px-3 py-1.5 text-sm font-semibold rounded-xl border border-gray-200 outline-none focus:border-indigo-500 transition-all bg-gray-50/50"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Enter your name..."
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select CEFR Goal</span>
                  <div className="flex gap-1.5 flex-wrap justify-center sm:justify-start">
                    {CEFR_LEVELS.map(lvl => (
                      <button key={lvl} onClick={() => setEditLevel(lvl)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                          editLevel === lvl
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <button className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm" onClick={() => setEditing(false)}>
                    <Save size={12} /> Save
                  </button>
                  <button className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all" onClick={() => setEditing(false)}>
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 mb-1">
                  <h2 className="sg text-lg md:text-xl font-bold text-gray-800">{editName}</h2>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{editLevel}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 mb-3 text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Mail size={12} />
                    <span>{user.email}</span>
                  </div>
                  <span className="hidden sm:inline opacity-30">•</span>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Calendar size={12} />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 border border-amber-100 text-amber-600">
                    <Flame size={13} className="animate-pulse" />
                    <span><b>{user.streak}</b> day streak</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <Trophy size={13} />
                    <span>Best: <b>{bestScore}%</b></span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer ml-auto sm:ml-0" onClick={() => setEditing(true)}>
                    <Edit3 size={12} /> Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CEFR Level Progress Stepper / Roadmap */}
        <div className="mt-5 pt-4 border-t border-gray-200/40">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-700">CEFR Learning Road</span>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/50">
              Goal: {editLevel} → {CEFR_LEVELS[Math.min(currentLevelIdx + 1, 5)]}
            </span>
          </div>

          <div className="relative flex items-center justify-between w-full px-2 py-2">
            {/* Background Line */}
            <div className="absolute top-1/2 left-4 right-4 h-[3px] bg-indigo-100/30 -translate-y-1/2 rounded-full" />
            {/* Active Progress Line */}
            <div 
              className="absolute top-1/2 left-4 h-[3px] bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] -translate-y-1/2 rounded-full transition-all duration-500" 
              style={{ width: `${(currentLevelIdx / (CEFR_LEVELS.length - 1)) * 94}%` }}
            />

            {/* Stepper Nodes */}
            {CEFR_LEVELS.map((lvl, i) => {
              const isActive = i <= currentLevelIdx;
              const isCurrent = lvl === editLevel;
              return (
                <div key={lvl} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (editing) setEditLevel(lvl);
                    }}
                    disabled={!editing}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#6c63ff] to-[#a78bfa] text-white shadow shadow-indigo-100'
                        : 'bg-white border border-gray-200 text-gray-400 hover:border-indigo-300'
                    } ${isCurrent ? 'ring-[3px] ring-emerald-100 scale-110' : ''} ${editing ? 'cursor-pointer' : ''}`}
                  >
                    {lvl}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Merged Dashboard Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10" style={{
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: stat.color === 'purple' ? 'rgba(108,99,255,0.2)' : stat.color === 'green' ? 'rgba(16,185,129,0.2)' : stat.color === 'orange' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
              }}>
                <stat.icon size={16} color={stat.color === 'purple' ? '#a78bfa' : stat.color === 'green' ? '#34d399' : stat.color === 'orange' ? '#fbbf24' : '#60a5fa'} />
              </div>
              <TrendingUp size={12} color="var(--accent-green)" />
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 800, marginBottom: '2px' }}>{stat.value}</div>
            <div className="text-xs md:text-sm mb-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            <div className="text-[10px] md:text-[11px]" style={{ color: 'var(--accent-green)' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Merged Dashboard Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-3 md:p-5">
          <div className="flex justify-between items-center mb-3 md:mb-5">
            <div>
              <h3 className="text-sm md:text-base font-bold">Weekly Activity</h3>
              <p className="text-[10px] md:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Exercises per day</p>
            </div>
            <div className="badge badge-blue">7 days</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="listening" name="Listening" fill="#6c63ff" radius={[4,4,0,0]} />
              <Bar dataKey="reading" name="Reading" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-3 md:p-5">
          <div className="flex justify-between items-center mb-3 md:mb-5">
            <div>
              <h3 className="text-sm md:text-base font-bold">Score Progress</h3>
              <p className="text-[10px] md:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 6 months</p>
            </div>
            <div className="badge badge-green">+20pts</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={monthlyProgress}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="score" name="Score" stroke="#6c63ff" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Merged Bottom Row: Skills Breakdown & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skills Breakdown */}
        <div className="card p-3 md:p-5">
          <h3 className="text-sm md:text-base font-bold mb-3 md:mb-5">Skills Breakdown</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Listening', value: 85, color: '#6c63ff', count: listeningCount },
              { label: 'Reading', value: 72, color: '#10b981', count: readingCount },
              { label: 'Vocabulary', value: 78, color: '#f59e0b', count: 0 },
              { label: 'Grammar', value: 65, color: '#3b82f6', count: 0 },
            ].map(skill => (
              <div key={skill.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs md:text-sm font-medium">{skill.label}</span>
                  <span className="text-xs md:text-sm font-bold" style={{ color: skill.color }}>{skill.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${skill.value}%`, background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg md:rounded-xl" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={14} color="#a78bfa" />
              <span className="text-xs md:text-sm font-semibold" style={{ color: '#a78bfa' }}>AI Suggestion</span>
            </div>
            <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Your Grammar score is weakest. Try B2-level Reading exercises.
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-3 md:p-5">
          <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4">Achievements</h3>
          <div className="flex flex-col gap-2 md:gap-3">
            {[
              { icon: '🔥', label: '12-day Streak', unlocked: true },
              { icon: '🎯', label: 'Perfect Score', unlocked: true },
              { icon: '📚', label: '5 Reading exercises', unlocked: true },
              { icon: '🏆', label: 'Top Learner', unlocked: false },
              { icon: '⚡', label: '30-day Streak', unlocked: false },
              { icon: '🌟', label: 'Level C1', unlocked: false },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2.5" style={{ opacity: a.unlocked ? 1 : 0.35 }}>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-lg shrink-0"
                  style={{ background: a.unlocked ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${a.unlocked ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }}>
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-semibold truncate">{a.label}</div>
                  <div className="text-[10px] md:text-xs" style={{ color: 'var(--text-muted)' }}>{a.unlocked ? 'Unlocked' : 'Locked'}</div>
                </div>
                {a.unlocked && <Award size={14} color="#fbbf24" style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="card p-3 md:p-5">
        <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4">Recent Study History</h3>
        <div className="flex flex-col gap-1.5 md:gap-2">
          {exercises.slice(0, 5).map(ex => (
            <div key={ex.id} className="flex items-center gap-2.5 md:gap-4 p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center shrink-0"
                style={{ background: ex.type === 'listening' ? 'rgba(108,99,255,0.15)' : 'rgba(16,185,129,0.15)' }}>
                {ex.type === 'listening' ? <Headphones size={15} color="#a78bfa" /> : <BookOpen size={15} color="#34d399" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm font-medium truncate">{ex.title}</div>
                <div className="text-[10px] md:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ex.topic} • {ex.difficulty}</div>
              </div>
              {ex.score !== undefined && (
                <div className="text-xs md:text-sm font-bold shrink-0" style={{ color: ex.score >= 80 ? '#34d399' : ex.score >= 60 ? '#fbbf24' : '#f87171' }}>
                  {ex.score}%
                </div>
              )}
              <div className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                {new Date(ex.createdAt).toLocaleDateString('en-US')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
