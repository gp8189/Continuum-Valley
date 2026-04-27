'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SiteContent {
  donorEmail: string;
  investorEmail: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  statuses: {
    foodProduction: string;
    communityVenue: string;
    educationHub: string;
    mutualAid: string;
    franchiseBlueprint: string;
  };
  adminPassword: string;
}

const DEFAULT: SiteContent = {
  donorEmail: 'your@email.com',
  investorEmail: 'your@email.com',
  instagramUrl: '#',
  tiktokUrl: '#',
  youtubeUrl: '#',
  statuses: {
    foodProduction: 'In Development',
    communityVenue: 'In Development',
    educationHub: 'Planned',
    mutualAid: 'Planned',
    franchiseBlueprint: 'Planned',
  },
  adminPassword: 'continuum2026',
};

function statusClass(s: string) {
  const l = s.toLowerCase();
  if (l.includes('active') || l.includes('complete')) return 'status-active';
  if (l.includes('development') || l.includes('building')) return 'status-building';
  return 'status-planned';
}

export default function Home() {
  const [content, setContent] = useState<SiteContent>(DEFAULT);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState<SiteContent>({ ...DEFAULT });

  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then((d: SiteContent) => { setContent(d); setForm(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 6) * 70}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdmin();
      }
      if (e.key === 'Escape') closeAdmin();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  useEffect(() => {
    if (new URLSearchParams(location.search).get('admin') === '1') openAdmin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdmin() {
    setAdminOpen(true);
    setLoggedIn(false);
    setPwInput('');
    setPwError(false);
    setSaveMsg('');
  }

  function closeAdmin() {
    setAdminOpen(false);
    setLoggedIn(false);
    setSaveMsg('');
  }

  function tryLogin() {
    if (pwInput === content.adminPassword) {
      setLoggedIn(true);
      setForm({ ...content });
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 1500);
    }
  }

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    clickCount.current++;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      e.preventDefault();
      openAdmin();
    }
  }, []);

  async function saveChanges() {
    setSaving(true);
    setSaveMsg('');
    try {
      const newPw = form.adminPassword !== content.adminPassword ? form.adminPassword : '';
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, currentPassword: content.adminPassword, newPassword: newPw }),
      });
      if (res.ok) {
        setContent({ ...form });
        setSaveMsg('Changes saved successfully!');
      } else {
        setSaveMsg('Error: Could not save changes.');
      }
    } catch {
      setSaveMsg('Error: Could not reach server.');
    }
    setSaving(false);
  }

  return (
    <>
      <style>{`
        :root {
          --cream: #F1E9D7; --cream-deep: #E8DDC4;
          --forest: #1F3025; --forest-deep: #14201A;
          --moss: #4A5D43; --sage: #8FA382;
          --clay: #C5683C; --clay-deep: #A8512B;
          --ink: #221913; --ink-soft: #4A3F35;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Manrope', sans-serif; background: var(--cream); color: var(--ink); line-height: 1.6; overflow-x: hidden; }
        body::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.13 0 0 0 0 0.10 0 0 0 0 0.07 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); opacity: 0.32; pointer-events: none; z-index: 1; mix-blend-mode: multiply; }
        nav { padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; }
        .logo { font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.4rem; letter-spacing: -0.02em; color: var(--forest); display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; text-decoration: none; }
        .logo-mark { width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--forest); border-radius: 50%; padding: 8px; }
        .logo-mark svg { width: 100%; height: 100%; display: block; }
        .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
        .logo-name { font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.15rem; letter-spacing: -0.02em; color: var(--forest); }
        .logo-tagline { font-family: 'Manrope', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--moss); }
        .logo em { font-style: italic; font-weight: 400; }
        .nav-links { display: flex; gap: 2.5rem; list-style: none; font-size: 0.92rem; font-weight: 500; }
        .nav-links a { color: var(--ink-soft); text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover { color: var(--clay); }
        .nav-cta { background: var(--forest); color: var(--cream) !important; padding: 0.7rem 1.5rem; border-radius: 100px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.3s; }
        .nav-cta:hover { background: var(--clay); transform: translateY(-1px); }
        @media (max-width: 768px) { .nav-links { display: none; } }
        .hero { padding: 4rem 2rem 7rem; position: relative; max-width: 1280px; margin: 0 auto; z-index: 2; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--moss); margin-bottom: 2rem; animation: fadeUp 0.8s ease 0.1s both; }
        .hero-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--moss); }
        h1.hero-headline { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2.8rem, 7vw, 6rem); line-height: 0.97; letter-spacing: -0.035em; color: var(--forest); margin-bottom: 2rem; max-width: 16ch; animation: fadeUp 0.9s ease 0.2s both; }
        h1.hero-headline em { font-style: italic; font-weight: 300; color: var(--clay); }
        .hero-sub { font-size: 1.15rem; color: var(--ink-soft); max-width: 50ch; margin-bottom: 3rem; line-height: 1.7; animation: fadeUp 1s ease 0.35s both; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; animation: fadeUp 1.1s ease 0.5s both; }
        .btn-primary, .btn-secondary { padding: 1rem 2rem; border-radius: 100px; font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem; border: 1.5px solid transparent; cursor: pointer; font-family: inherit; }
        .btn-primary { background: var(--clay); color: var(--cream); border-color: var(--clay); }
        .btn-primary:hover { background: var(--clay-deep); border-color: var(--clay-deep); transform: translateY(-2px); }
        .btn-secondary { color: var(--forest); border-color: var(--forest); background: transparent; }
        .btn-secondary:hover { background: var(--forest); color: var(--cream); }
        .hero-deco { position: absolute; top: 5rem; right: 2rem; width: 360px; max-width: 33%; opacity: 0.8; animation: fadeIn 1.4s ease 0.6s both, gentleFloat 8s ease-in-out 1.5s infinite; z-index: 0; }
        @media (max-width: 900px) { .hero-deco { display: none; } }
        .mission-band { background: var(--clay); padding: 3.5rem 2rem; position: relative; z-index: 2; }
        .mission-band-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 2rem; }
        .mission-icon { font-size: 2.8rem; flex-shrink: 0; }
        .mission-text { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(1.4rem, 3vw, 2.2rem); line-height: 1.2; color: var(--cream); letter-spacing: -0.02em; }
        .mission-text em { font-style: italic; font-weight: 300; opacity: 0.85; }
        @media (max-width: 600px) { .mission-band-inner { flex-direction: column; text-align: center; gap: 1rem; } }
        .origin { background: var(--forest); color: var(--cream); padding: 7rem 2rem; position: relative; z-index: 2; }
        .origin::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--sage), transparent); }
        .origin-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: start; }
        @media (max-width: 768px) { .origin-grid { grid-template-columns: 1fr; gap: 2rem; } }
        .section-eyebrow { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sage); display: flex; align-items: center; gap: 0.6rem; }
        .section-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--sage); }
        .origin-text h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.05; letter-spacing: -0.025em; margin-bottom: 2rem; margin-top: 0.5rem; }
        .origin-text h2 em { font-style: italic; color: var(--clay); font-weight: 300; }
        .origin-text p { font-size: 1.1rem; color: rgba(241,233,215,0.78); margin-bottom: 1.5rem; max-width: 60ch; line-height: 1.75; }
        .pull-quote { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 1.5rem; line-height: 1.45; color: var(--cream); border-left: 2px solid var(--clay); padding-left: 1.5rem; margin-top: 2.5rem; max-width: 38ch; }
        .pillars { padding: 7rem 2rem; max-width: 1280px; margin: 0 auto; position: relative; z-index: 2; }
        .pillars-header { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 5rem; align-items: end; }
        @media (max-width: 768px) { .pillars-header { grid-template-columns: 1fr; gap: 1.5rem; } }
        .pillar-eyebrow { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--moss); display: flex; align-items: center; gap: 0.6rem; }
        .pillar-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--moss); }
        .pillars h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.6rem); line-height: 1; letter-spacing: -0.03em; color: var(--forest); margin-top: 1rem; }
        .pillars h2 em { font-style: italic; color: var(--clay); font-weight: 300; }
        .pillars-intro { font-size: 1.05rem; color: var(--ink-soft); max-width: 42ch; line-height: 1.7; }
        .pillar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        @media (max-width: 900px) { .pillar-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .pillar-grid { grid-template-columns: 1fr; } }
        .pillar { background: var(--cream-deep); padding: 2.5rem 2rem; border-radius: 4px; border: 1px solid rgba(31,48,37,0.08); transition: all 0.5s cubic-bezier(0.16,1,0.3,1); cursor: default; }
        .pillar:hover { background: var(--forest); transform: translateY(-4px); }
        .pillar:hover .pillar-num { color: var(--clay); }
        .pillar:hover .pillar-title, .pillar:hover .pillar-desc { color: var(--cream); }
        .pillar-num { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 3rem; color: var(--clay); line-height: 1; margin-bottom: 1.25rem; transition: color 0.5s ease; }
        .pillar-title { font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.35rem; line-height: 1.15; color: var(--forest); margin-bottom: 0.75rem; letter-spacing: -0.02em; transition: color 0.5s ease; }
        .pillar-desc { font-size: 0.95rem; color: var(--ink-soft); line-height: 1.6; transition: color 0.5s ease; }
        .flagship { background: var(--cream-deep); padding: 7rem 2rem; position: relative; z-index: 2; }
        .flagship-inner { max-width: 1280px; margin: 0 auto; }
        .mission-statement-block { background: var(--forest); color: var(--cream); border-radius: 8px; padding: 3rem 3.5rem; margin-bottom: 5rem; position: relative; overflow: hidden; display: flex; align-items: center; gap: 2rem; }
        .mission-statement-block::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--clay); }
        .mission-statement-block::after { content: ''; position: absolute; top: -60%; right: -5%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(197,104,60,0.18) 0%, transparent 70%); pointer-events: none; }
        .mission-quote-mark { font-family: 'Fraunces', serif; font-size: 8rem; line-height: 0.7; color: var(--clay); opacity: 0.4; flex-shrink: 0; margin-top: 0.5rem; position: relative; z-index: 2; }
        .mission-statement-text { position: relative; z-index: 2; }
        .mission-statement-text p { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(1.3rem, 2.5vw, 1.8rem); line-height: 1.4; letter-spacing: -0.015em; color: var(--cream); font-style: italic; }
        .mission-statement-text p strong { font-style: normal; font-weight: 600; color: #E8956A; }
        .mission-statement-text span { display: block; margin-top: 1rem; font-size: 0.88rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--sage); font-family: 'Manrope', sans-serif; font-weight: 600; font-style: normal; }
        @media (max-width: 640px) { .mission-statement-block { flex-direction: column; gap: 0; padding: 2rem; } .mission-quote-mark { font-size: 4rem; } }
        .flagship-header { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 3.5rem; align-items: end; }
        @media (max-width: 768px) { .flagship-header { grid-template-columns: 1fr; gap: 1.5rem; } }
        .flagship-tag { display: inline-block; background: var(--clay); color: var(--cream); font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; padding: 0.4rem 0.9rem; border-radius: 100px; margin-bottom: 1.25rem; font-weight: 600; }
        .flagship-header h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1; letter-spacing: -0.03em; color: var(--forest); margin-top: 0.75rem; }
        .flagship-header h2 em { font-style: italic; color: var(--clay); font-weight: 300; }
        .flagship-intro { font-size: 1.05rem; color: var(--ink-soft); max-width: 44ch; line-height: 1.7; }
        .flagship-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        @media (max-width: 900px) { .flagship-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .flagship-grid { grid-template-columns: 1fr; } }
        .flagship-item { background: var(--forest); color: var(--cream); padding: 2rem 1.75rem; border-radius: 4px; position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .flagship-item:hover { transform: translateY(-4px); }
        .flagship-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--clay); }
        .flagship-item-icon { font-size: 1.6rem; margin-bottom: 1rem; display: block; }
        .flagship-item-title { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 500; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
        .flagship-item-desc { font-size: 0.9rem; color: rgba(241,233,215,0.72); line-height: 1.6; }
        .flagship-status { display: inline-block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.25rem 0.7rem; border-radius: 100px; margin-top: 1rem; }
        .status-building { background: rgba(197,104,60,0.25); color: #E8956A; }
        .status-planned { background: rgba(143,163,130,0.2); color: var(--sage); }
        .status-active { background: rgba(143,163,130,0.4); color: #c8f0b8; }
        .flagship-item-cta { background: var(--clay); }
        .flagship-item-cta::before { background: rgba(255,255,255,0.2); }
        .cta { padding: 7rem 2rem; max-width: 1280px; margin: 0 auto; text-align: center; position: relative; z-index: 2; }
        .cta-card { background: var(--forest); color: var(--cream); border-radius: 8px; padding: 5rem 3rem; position: relative; overflow: hidden; }
        .cta-card::before { content: ''; position: absolute; top: -50%; left: -10%; width: 600px; height: 600px; background: radial-gradient(circle, var(--moss) 0%, transparent 70%); opacity: 0.4; pointer-events: none; }
        .cta-card::after { content: ''; position: absolute; bottom: -40%; right: -5%; width: 500px; height: 500px; background: radial-gradient(circle, var(--clay) 0%, transparent 70%); opacity: 0.22; pointer-events: none; }
        .cta-content { position: relative; z-index: 2; }
        .cta-card h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.5rem; max-width: 22ch; margin-left: auto; margin-right: auto; }
        .cta-card h2 em { font-style: italic; color: var(--clay); font-weight: 300; }
        .cta-card p { font-size: 1.1rem; color: rgba(241,233,215,0.75); max-width: 52ch; margin: 0 auto 2.5rem; line-height: 1.7; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-cta-primary { background: var(--clay); color: var(--cream); padding: 1.1rem 2.2rem; border-radius: 100px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.3s ease; border: 1.5px solid var(--clay); }
        .btn-cta-primary:hover { background: var(--clay-deep); border-color: var(--clay-deep); transform: translateY(-2px); }
        .btn-cta-secondary { color: var(--cream); padding: 1.1rem 2.2rem; border-radius: 100px; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.3s ease; border: 1.5px solid rgba(241,233,215,0.5); }
        .btn-cta-secondary:hover { border-color: var(--cream); background: rgba(241,233,215,0.08); }
        footer { background: var(--forest-deep); color: var(--cream); padding: 4rem 2rem 2rem; position: relative; z-index: 2; }
        .footer-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(241,233,215,0.1); }
        @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr; gap: 2rem; } }
        .footer-logo-mark { width: 44px; height: 44px; display: block; margin-bottom: 1.25rem; }
        .footer-brand h3 { font-family: 'Fraunces', serif; font-weight: 400; font-size: 1.6rem; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 0.75rem; }
        .footer-brand h3 em { font-style: italic; color: var(--clay); }
        .footer-brand p { color: rgba(241,233,215,0.55); font-size: 0.95rem; max-width: 38ch; line-height: 1.65; }
        .footer-col h4 { font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sage); margin-bottom: 1.25rem; font-weight: 600; }
        .footer-col ul { list-style: none; }
        .footer-col li { margin-bottom: 0.6rem; }
        .footer-col a { color: rgba(241,233,215,0.65); text-decoration: none; font-size: 0.95rem; transition: color 0.3s; }
        .footer-col a:hover { color: var(--clay); }
        .footer-col .coming-soon { color: rgba(241,233,215,0.3); font-size: 0.88rem; font-style: italic; }
        .footer-bottom { max-width: 1280px; margin: 2rem auto 0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: rgba(241,233,215,0.4); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.8; } }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.85s ease, transform 0.85s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .admin-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(20,32,26,0.98); z-index: 9999; overflow-y: auto; padding: 2rem 1rem; }
        .admin-box { max-width: 720px; margin: 2rem auto; background: var(--cream); border-radius: 12px; padding: 2.5rem 2rem; box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
        .admin-box h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: 2rem; color: var(--forest); margin-bottom: 0.4rem; letter-spacing: -0.02em; }
        .admin-box h2 em { font-style: italic; color: var(--clay); }
        .admin-sub { color: var(--ink-soft); font-size: 0.94rem; margin-bottom: 2rem; }
        .admin-section { border-top: 1px solid rgba(31,48,37,0.12); padding-top: 1.5rem; margin-top: 1.5rem; }
        .admin-section h3 { font-family: 'Fraunces', serif; font-size: 1.15rem; color: var(--forest); margin-bottom: 1rem; font-weight: 500; }
        .admin-field { margin-bottom: 1rem; }
        .admin-field label { display: block; font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--moss); font-weight: 600; margin-bottom: 0.4rem; }
        .admin-field input { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid rgba(31,48,37,0.18); border-radius: 6px; background: white; font-family: inherit; font-size: 0.94rem; color: var(--ink); outline: none; transition: border 0.2s; }
        .admin-field input:focus { border-color: var(--clay); }
        .admin-field input.error { border-color: var(--clay-deep) !important; background: #FCEDE5 !important; }
        .admin-actions { padding-top: 1.5rem; margin-top: 2rem; border-top: 2px solid var(--forest); display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .admin-btn { flex: 1; min-width: 130px; padding: 0.9rem 1.2rem; border: none; border-radius: 100px; font-family: inherit; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.25s; }
        .admin-btn-primary { background: var(--forest); color: var(--cream); }
        .admin-btn-primary:hover { background: var(--clay); }
        .admin-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-btn-secondary { background: transparent; color: var(--forest); border: 1.5px solid var(--forest); }
        .admin-btn-secondary:hover { background: var(--forest); color: var(--cream); }
        .save-msg { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.9rem; font-weight: 500; }
        .save-msg.success { background: rgba(79,94,69,0.15); color: var(--forest); border-left: 3px solid var(--moss); }
        .save-msg.error { background: rgba(197,104,60,0.1); color: var(--clay-deep); border-left: 3px solid var(--clay); }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ADMIN OVERLAY */}
      {adminOpen && (
        <div className="admin-overlay">
          {!loggedIn ? (
            <div className="admin-box">
              <h2>Admin <em>Access</em></h2>
              <p className="admin-sub">Enter your password to edit Continuum Valley content.</p>
              <div className="admin-field">
                <label>Password</label>
                <input
                  type="password"
                  className={pwError ? 'error' : ''}
                  value={pwInput}
                  onChange={e => setPwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryLogin()}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              <div className="admin-actions">
                <button className="admin-btn admin-btn-primary" onClick={tryLogin}>Unlock</button>
                <button className="admin-btn admin-btn-secondary" onClick={closeAdmin}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="admin-box">
              <h2>Edit Your <em>Site</em></h2>
              <p className="admin-sub">Update content and click <strong>Save Changes</strong> — saved instantly to your server.</p>
              <div style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.15rem', color: 'var(--forest)', marginBottom: '1rem', fontWeight: 500 }}>Contact Emails</h3>
                <div className="admin-field">
                  <label>Donor Inquiry Email</label>
                  <input type="email" value={form.donorEmail} onChange={e => setForm(f => ({ ...f, donorEmail: e.target.value }))} placeholder="your@email.com" />
                </div>
                <div className="admin-field">
                  <label>Investor Inquiry Email</label>
                  <input type="email" value={form.investorEmail} onChange={e => setForm(f => ({ ...f, investorEmail: e.target.value }))} placeholder="your@email.com" />
                </div>
              </div>
              <div className="admin-section">
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.15rem', color: 'var(--forest)', marginBottom: '1rem', fontWeight: 500 }}>Social Links</h3>
                <div className="admin-field">
                  <label>Instagram URL</label>
                  <input type="url" value={form.instagramUrl} onChange={e => setForm(f => ({ ...f, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." />
                </div>
                <div className="admin-field">
                  <label>TikTok URL</label>
                  <input type="url" value={form.tiktokUrl} onChange={e => setForm(f => ({ ...f, tiktokUrl: e.target.value }))} placeholder="https://tiktok.com/..." />
                </div>
                <div className="admin-field">
                  <label>YouTube URL</label>
                  <input type="url" value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="admin-section">
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.15rem', color: 'var(--forest)', marginBottom: '1rem', fontWeight: 500 }}>Flagship Status Badges</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '1rem' }}>Options: &ldquo;In Development&rdquo; · &ldquo;Active&rdquo; · &ldquo;Planned&rdquo; · &ldquo;Complete&rdquo;</p>
                {([
                  ['foodProduction', 'On-Site Food Production'],
                  ['communityVenue', 'Community Venue'],
                  ['educationHub', 'Education Hub'],
                  ['mutualAid', 'Mutual Aid Network'],
                  ['franchiseBlueprint', 'Franchise Blueprint'],
                ] as [keyof SiteContent['statuses'], string][]).map(([key, label]) => (
                  <div className="admin-field" key={key}>
                    <label>{label} Status</label>
                    <input type="text" value={form.statuses[key]} onChange={e => setForm(f => ({ ...f, statuses: { ...f.statuses, [key]: e.target.value } }))} />
                  </div>
                ))}
              </div>
              <div className="admin-section">
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.15rem', color: 'var(--forest)', marginBottom: '1rem', fontWeight: 500 }}>Admin Password</h3>
                <div className="admin-field">
                  <label>New Password (leave blank to keep current)</label>
                  <input type="text" placeholder="New password..." onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value || content.adminPassword }))} />
                </div>
              </div>
              <div className="admin-actions">
                <button className="admin-btn admin-btn-primary" onClick={saveChanges} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                <button className="admin-btn admin-btn-secondary" onClick={closeAdmin}>Close</button>
              </div>
              {saveMsg && <div className={`save-msg ${saveMsg.startsWith('Changes') ? 'success' : 'error'}`}>{saveMsg}</div>}
            </div>
          )}
        </div>
      )}

      {/* NAV */}
      <nav>
        <a className="logo" href="#" title="Triple-click to admin" onClick={handleLogoClick}>
          <span className="logo-mark">
            <svg viewBox="0 0 52 52" fill="none">
              <path d="M4 40 L14 22 L22 32 L26 18 L34 32 L42 22 L48 40Z" fill="#7A8C6E" opacity="0.35"/>
              <path d="M4 40 L14 22 L22 32 L26 18 L34 32 L42 22 L48 40Z" stroke="#A8B99A" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
              <circle cx="26" cy="15" r="5" fill="#C4714A" opacity="0.9"/>
              <line x1="4" y1="40" x2="48" y2="40" stroke="#F5EFE0" strokeWidth="1.2" opacity="0.2"/>
              <path d="M16 38 Q16 34 20 32" stroke="#A8B99A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M36 38 Q36 34 32 32" stroke="#A8B99A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="logo-text">
            <span className="logo-name">Continuum <em>Valley</em></span>
            <span className="logo-tagline">Community Farm Market</span>
          </span>
        </a>
        <ul className="nav-links">
          <li><a href="#origin">The Vision</a></li>
          <li><a href="#pillars">The Model</a></li>
          <li><a href="#flagship">The Flagship</a></li>
          <li><a href="#join">Contact</a></li>
        </ul>
        <a href="#join" className="nav-cta">Investor Relations</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Flagship &amp; Franchise Model</div>
        <h1 className="hero-headline">A farming system that <em>feeds generations.</em></h1>
        <p className="hero-sub">Continuum Valley is a regenerative farming blueprint. We are building our flagship site to prove the model — creating a turnkey franchise system for farmers to deploy on their own land and feed their own communities.</p>
        <div className="hero-actions">
          <a href={`mailto:${content.donorEmail}`} className="btn-primary">Become a Donor</a>
          <a href={`mailto:${content.investorEmail}`} className="btn-secondary">Inquire as Investor</a>
        </div>
        <svg className="hero-deco" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="150" fill="#C5683C" opacity="0.1"/>
          <circle cx="200" cy="200" r="108" fill="none" stroke="#1F3025" strokeWidth="1" opacity="0.35"/>
          <g stroke="#1F3025" strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M200 320 Q200 220 200 130"/><path d="M180 290 Q175 250 178 220"/>
            <path d="M220 290 Q225 250 222 220"/><path d="M165 270 Q158 235 162 210"/>
            <path d="M235 270 Q242 235 238 210"/>
          </g>
          <g fill="#4A5D43">
            <ellipse cx="195" cy="160" rx="6" ry="14" transform="rotate(-15 195 160)"/>
            <ellipse cx="205" cy="155" rx="6" ry="14" transform="rotate(15 205 155)"/>
            <ellipse cx="190" cy="180" rx="6" ry="14" transform="rotate(-15 190 180)"/>
            <ellipse cx="210" cy="175" rx="6" ry="14" transform="rotate(15 210 175)"/>
            <ellipse cx="185" cy="200" rx="6" ry="14" transform="rotate(-15 185 200)"/>
            <ellipse cx="215" cy="195" rx="6" ry="14" transform="rotate(15 215 195)"/>
          </g>
          <g fill="#C5683C">
            <circle cx="172" cy="225" r="5"/><circle cx="228" cy="225" r="5"/>
            <circle cx="160" cy="245" r="4"/><circle cx="240" cy="245" r="4"/>
          </g>
          <path d="M100 320 Q200 310 300 320" stroke="#1F3025" strokeWidth="1.5" fill="none" opacity="0.5"/>
        </svg>
      </section>

      {/* MISSION BAND */}
      <div className="mission-band">
        <div className="mission-band-inner">
          <div className="mission-icon">🌾</div>
          <p className="mission-text">
            <strong>No one should ever have to wonder where their next meal is coming from.</strong>
            <em> That belief is the foundation of everything we build.</em>
          </p>
        </div>
      </div>

      {/* ORIGIN */}
      <section className="origin" id="origin">
        <div className="origin-grid">
          <div className="reveal"><div className="section-eyebrow">The Vision</div></div>
          <div className="origin-text reveal">
            <h2>The first site is <em>just the beginning.</em></h2>
            <p>I am building the first Continuum Valley flagship to serve as a living laboratory. This site proves that regenerative agriculture can be profitable, replicable, and deeply connected to the local community.</p>
            <p>Once the flagship is perfected, the Blueprint becomes our product — allowing other farmers to bypass the trial and error and start feeding their own generations immediately.</p>
            <blockquote className="pull-quote">&ldquo;I want to build a community that will feed generations.&rdquo;</blockquote>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="pillars" id="pillars">
        <div className="pillars-header">
          <div className="reveal">
            <div className="pillar-eyebrow">The Model</div>
            <h2>Six pillars. <em>One blueprint.</em></h2>
          </div>
          <p className="pillars-intro reveal">Every Continuum Valley site is built on the same six pillars. Together they create a system that is profitable for farmers, nourishing for communities, and replicable at scale.</p>
        </div>
        <div className="pillar-grid">
          {[
            ['01','Food Sovereignty','Independence from fragile global supply chains through localized production.'],
            ['02','Land Stewardship','Regenerative practices that leave private land richer and more valuable every year.'],
            ['03','Generational Tech','Standardizing traditional knowledge into a modern, easy-to-follow operational manual.'],
            ['04','Mutual Aid','Building community roots by ensuring surplus always reaches local neighbors.'],
            ['05','Scalable Economy','Creating micro-economies that keep financial value within the farm\'s ecosystem.'],
            ['06','Franchise Blueprint','A turnkey licensing model for independent farmers to replicate the flagship success.'],
          ].map(([num, title, desc]) => (
            <div className="pillar reveal" key={num}>
              <div className="pillar-num">{num}</div>
              <div className="pillar-title">{title}</div>
              <p className="pillar-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLAGSHIP */}
      <section className="flagship" id="flagship">
        <div className="flagship-inner">
          <div className="mission-statement-block reveal">
            <div className="mission-quote-mark">&ldquo;</div>
            <div className="mission-statement-text">
              <p>No one should ever have to <strong>wonder where their next meal is coming from.</strong> The Continuum Valley Flagship exists to make that a reality — not just for one family, but for an entire generation of communities.</p>
              <span>— The Mission · Continuum Valley</span>
            </div>
          </div>
          <div className="flagship-header">
            <div className="reveal">
              <span className="flagship-tag">Continuum Valley Flagship</span>
              <h2>What your <em>investment builds.</em></h2>
            </div>
            <p className="flagship-intro reveal">The flagship is a full-scale regenerative farm and community venue where every pillar operates in real life. This is what donors and investors are bringing into existence.</p>
          </div>
          <div className="flagship-grid">
            <div className="flagship-item reveal">
              <span className="flagship-item-icon">🌱</span>
              <div className="flagship-item-title">On-Site Food Production</div>
              <div className="flagship-item-desc">Year-round produce grown, harvested, and distributed on the flagship property — proving that local food sovereignty is not just possible, it&apos;s profitable.</div>
              <span className={`flagship-status ${statusClass(content.statuses.foodProduction)}`}>{content.statuses.foodProduction}</span>
            </div>
            <div className="flagship-item reveal">
              <span className="flagship-item-icon">🏡</span>
              <div className="flagship-item-title">Community Venue &amp; Gathering Space</div>
              <div className="flagship-item-desc">A physical destination for markets, workshops, events, and celebrations. The farm becomes the town square — where neighbors become a community.</div>
              <span className={`flagship-status ${statusClass(content.statuses.communityVenue)}`}>{content.statuses.communityVenue}</span>
            </div>
            <div className="flagship-item reveal">
              <span className="flagship-item-icon">📖</span>
              <div className="flagship-item-title">Education &amp; Knowledge Hub</div>
              <div className="flagship-item-desc">Hands-on workshops teaching regenerative farming, composting, food preservation, and land management. The knowledge stays in the community forever.</div>
              <span className={`flagship-status ${statusClass(content.statuses.educationHub)}`}>{content.statuses.educationHub}</span>
            </div>
            <div className="flagship-item reveal">
              <span className="flagship-item-icon">🤝</span>
              <div className="flagship-item-title">Mutual Aid Network</div>
              <div className="flagship-item-desc">Surplus produce goes directly to neighbors. The flagship builds food access infrastructure before it&apos;s ever needed in a crisis.</div>
              <span className={`flagship-status ${statusClass(content.statuses.mutualAid)}`}>{content.statuses.mutualAid}</span>
            </div>
            <div className="flagship-item reveal">
              <span className="flagship-item-icon">📊</span>
              <div className="flagship-item-title">The Franchise Blueprint</div>
              <div className="flagship-item-desc">Every operation, every system, every lesson is documented into a turnkey playbook — ready for the next farmer to deploy on their own land.</div>
              <span className={`flagship-status ${statusClass(content.statuses.franchiseBlueprint)}`}>{content.statuses.franchiseBlueprint}</span>
            </div>
            <div className="flagship-item flagship-item-cta reveal">
              <span className="flagship-item-icon">🌍</span>
              <div className="flagship-item-title">The First of Many</div>
              <div className="flagship-item-desc">Once the flagship proves the model, the blueprint scales. Your investment doesn&apos;t just build one farm — it builds the template that feeds generations nationwide.</div>
              <a href={`mailto:${content.donorEmail}`} style={{ display:'inline-block', marginTop:'1rem', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--cream)', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,0.4)', paddingBottom:'2px' }}>Be a Founding Donor →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="join">
        <div className="cta-card reveal">
          <div className="cta-content">
            <h2>Join the <em>Continuum.</em></h2>
            <p>Whether you are a donor ready to fund the flagship or an investor interested in the franchise expansion — let&apos;s connect. Your involvement shapes how many communities never go hungry again.</p>
            <div className="cta-buttons">
              <a href={`mailto:${content.donorEmail}`} className="btn-cta-primary">Become a Donor</a>
              <a href={`mailto:${content.investorEmail}`} className="btn-cta-secondary">Investor Inquiry</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <svg className="footer-logo-mark" viewBox="0 0 52 52" fill="none">
              <path d="M4 40 L14 22 L22 32 L26 18 L34 32 L42 22 L48 40Z" fill="#7A8C6E" opacity="0.25"/>
              <path d="M4 40 L14 22 L22 32 L26 18 L34 32 L42 22 L48 40Z" stroke="#A8B99A" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
              <circle cx="26" cy="15" r="5" fill="#C4714A"/>
              <line x1="4" y1="40" x2="48" y2="40" stroke="#F5EFE0" strokeWidth="1.2" opacity="0.2"/>
              <path d="M16 38 Q16 34 20 32" stroke="#A8B99A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M36 38 Q36 34 32 32" stroke="#A8B99A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <h3><em>Continuum Valley</em></h3>
            <p>A flagship-to-franchise model for the future of food. No one should ever wonder where their next meal is coming from.</p>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${content.donorEmail}`}>Donor Inquiries</a></li>
              <li><a href={`mailto:${content.investorEmail}`}>Investor Relations</a></li>
              <li><a href={`mailto:${content.donorEmail}`}>General Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href={content.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href={content.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><span className="coming-soon">Flagship: Coming Soon</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Continuum Valley. All rights reserved.</span>
          <span>Planted with intention. Built to last.</span>
        </div>
      </footer>
    </>
  );
}
