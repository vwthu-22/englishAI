'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Headphones, BookOpen, ArrowRight, Users } from 'lucide-react';

interface CommunityQuizItem {
  id?: string;
  title: string;
  difficulty: string;
  questionCount?: number;
  moduleType: 'listening' | 'reading';
}

const SUGGESTIONS = [
  { title: 'IELTS Listening: City Planning', difficulty: 'B2', type: 'listening', qs: 10 },
  { title: 'IELTS Reading: Climate Change', difficulty: 'C1', type: 'reading', qs: 15 },
  { title: 'BBC Audio Comprehension', difficulty: 'B1', type: 'listening', qs: 8 },
  { title: 'Academic Vocabulary Boost', difficulty: 'B2', type: 'reading', qs: 12 },
];

interface SuggestedExercisesProps {
  currentType?: 'listening' | 'reading';
}

export default function SuggestedExercises({ currentType: _currentType }: SuggestedExercisesProps = {}) {
  const [communityQuizzes, setCommunityQuizzes] = useState<CommunityQuizItem[]>([]);

  useEffect(() => {
    try {
      const listening: CommunityQuizItem[] = JSON.parse(localStorage.getItem('published_listening_quizzes') || '[]');
      const reading: CommunityQuizItem[] = JSON.parse(localStorage.getItem('published_reading_quizzes') || '[]');
      const all: CommunityQuizItem[] = [
        ...listening.map((q) => ({ ...q, moduleType: 'listening' as const })),
        ...reading.map((q) => ({ ...q, moduleType: 'reading' as const })),
      ].sort(() => Math.random() - 0.5).slice(0, 4);
      setCommunityQuizzes(all);
    } catch {
      setCommunityQuizzes([]);
    }
  }, []);

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid #f1f3f6', paddingTop: '32px' }}>
      {/* Try Next */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Try Next</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>AI-curated exercises based on your level</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {SUGGESTIONS.map((s, i) => (
            <Link key={i} href={s.type === 'listening' ? '/listening' : '/reading'} style={{ textDecoration: 'none' }}>
              <div className="card p-4 group" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', marginBottom: '10px',
                  background: s.type === 'listening' ? 'rgba(108,99,255,0.1)' : 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {s.type === 'listening'
                    ? <Headphones size={17} color="#a78bfa" />
                    : <BookOpen size={17} color="#34d399" />}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>{s.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                    background: s.type === 'listening' ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)',
                    color: s.type === 'listening' ? '#a78bfa' : '#34d399',
                    border: `1px solid ${s.type === 'listening' ? 'rgba(108,99,255,0.2)' : 'rgba(16,185,129,0.2)'}`
                  }}>{s.difficulty}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.qs} Qs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: s.type === 'listening' ? '#a78bfa' : '#34d399' }}>
                  Start <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Exercises */}
      {communityQuizzes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>From the Community</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Exercises shared by other learners</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Users size={12} /> Community picks
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {communityQuizzes.map((quiz, i) => {
              const isL = quiz.moduleType === 'listening';
              return (
                <Link key={i} href={isL ? '/listening' : '/reading'} style={{ textDecoration: 'none' }}>
                  <div className="card p-4 group" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px', marginBottom: '10px',
                      background: isL ? 'rgba(108,99,255,0.1)' : 'rgba(16,185,129,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isL ? <Headphones size={17} color="#a78bfa" /> : <BookOpen size={17} color="#34d399" />}
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{quiz.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                        background: isL ? 'rgba(108,99,255,0.08)' : 'rgba(16,185,129,0.08)',
                        color: isL ? '#a78bfa' : '#34d399',
                        border: `1px solid ${isL ? 'rgba(108,99,255,0.2)' : 'rgba(16,185,129,0.2)'}`
                      }}>{quiz.difficulty}</span>
                      {quiz.questionCount && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{quiz.questionCount} Qs</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: isL ? '#a78bfa' : '#34d399' }}>
                      Start quiz <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
