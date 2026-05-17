'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Check, Database, Sparkles, Zap, RefreshCw, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      
      {/* GLOWING ORBS BACKGROUND */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      {/* HEADER NAVIGATION */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-md">
            <ShieldCheck size={24} />
          </div>
          <span className="text-lg font-black tracking-wider uppercase">LogisHub</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted font-medium">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#network" className="hover:text-foreground transition-colors">Egypt Network</a>
        </nav>
        <Link 
          href="/login"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-md shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300"
        >
          Launch Console
          <ArrowRight size={16} />
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary tracking-wider uppercase mb-6 animate-pulse">
          <Sparkles size={12} />
          Logistics 4.0 Is Here
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          Enterprise Logistics, Powered by Real-time Intelligence.
        </h1>
        <p className="text-base md:text-xl text-muted max-w-3xl mx-auto mt-6 leading-relaxed">
          LogisHub bridges next-gen database automation with generative AI diagnostic engines. Seamlessly connecting Egyptian hubs, transit routing anomalies, and courier delivery channels in one unified B2B dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link 
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-md shadow-lg transition-all group flex items-center justify-center gap-2"
          >
            Launch Live Demo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md font-semibold text-muted hover:text-foreground transition-all flex items-center justify-center"
          >
            Explore Platform Features
          </a>
        </div>

        {/* HERO IMAGE SCREENSHOT PLACEHOLDER MOCK */}
        <div className="mt-16 relative border border-white/10 rounded-lg overflow-hidden bg-white/[0.01] backdrop-blur-md max-w-5xl mx-auto p-2">
          <div className="bg-black/50 border border-white/5 rounded-md aspect-[16/9] w-full flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-success/5 pointer-events-none" />
            <div className="flex flex-col items-center gap-4 z-10 p-6 text-center">
              <div className="p-4 bg-primary/20 text-primary rounded-full border border-primary/30">
                <Zap size={36} className="animate-bounce" />
              </div>
              <h3 className="text-xl font-bold">Interactive Live Console Simulation</h3>
              <p className="text-sm text-muted max-w-md">
                Experience real-time transit telemetry, automated PostgreSQL triggers, and full-stack Gemini diagnostics right from the browser.
              </p>
              <Link 
                href="/login"
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
              >
                Sign In to Test Role Gates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-white/[0.01] border-y border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-5xl font-black text-primary">500K+</h3>
            <p className="text-xs text-muted uppercase tracking-widest mt-2">Active Shipments Transited</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-black text-success">99.9%</h3>
            <p className="text-xs text-muted uppercase tracking-widest mt-2">Auto-Alert SLA Resolution</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-5xl font-black text-warning">12+</h3>
            <p className="text-xs text-muted uppercase tracking-widest mt-2">Regional Hubs Synced</p>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black">Cutting Edge Mechanics</h2>
          <p className="text-muted mt-3">LogisHub sets new standard for enterprise cloud distribution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* FEATURE 1 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg hover:border-primary/30 transition-all flex flex-col gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-md w-fit">
              <Sparkles size={20} />
            </div>
            <h4 className="text-lg font-bold">Gemini AI Copilot</h4>
            <p className="text-sm text-muted leading-relaxed">
              Fully integrated Gemini Flash LLM to auto-audit delayed transits and output lightning-fast recommendations.
            </p>
          </div>

          {/* FEATURE 2 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg hover:border-success/30 transition-all flex flex-col gap-4">
            <div className="p-3 bg-success/10 text-success rounded-md w-fit">
              <RefreshCw size={20} />
            </div>
            <h4 className="text-lg font-bold">Realtime Subscriptions</h4>
            <p className="text-sm text-muted leading-relaxed">
              Supabase database-level triggers automatically pushing transit warnings and routing errors to consoles instantly.
            </p>
          </div>

          {/* FEATURE 3 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg hover:border-warning/30 transition-all flex flex-col gap-4">
            <div className="p-3 bg-warning/10 text-warning rounded-md w-fit">
              <Smartphone size={20} />
            </div>
            <h4 className="text-lg font-bold">Mobile courier Portal</h4>
            <p className="text-sm text-muted leading-relaxed">
              Dedicated pocket application simulator for field agents supporting WhatsApp messaging and cash-settlement gates.
            </p>
          </div>

          {/* FEATURE 4 */}
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-lg hover:border-danger/30 transition-all flex flex-col gap-4">
            <div className="p-3 bg-danger/10 text-danger rounded-md w-fit">
              <Database size={20} />
            </div>
            <h4 className="text-lg font-bold">RLS Guardrails</h4>
            <p className="text-sm text-muted leading-relaxed">
              Strict multi-tenant Row Level Security ensuring regional operations rooms can only view and manage authorized zones.
            </p>
          </div>

        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10 flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black">Flexible Enterprise Pricing</h2>
          <p className="text-muted mt-3">Choose the plan that suits your operational scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          
          {/* PLAN 1 */}
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-muted">Hub Starter</h4>
              <h3 className="text-3xl font-black mt-4">$199<span className="text-sm text-muted font-normal">/mo</span></h3>
              <p className="text-xs text-muted mt-2">Perfect for single city transit operations.</p>
              <ul className="flex flex-col gap-3 mt-8 text-sm text-muted">
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Up to 5,000 Shipments</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Standard Database Triggers</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> 2 Operations Agents</li>
              </ul>
            </div>
            <Link 
              href="/login"
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md font-bold text-sm text-center block mt-8 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* PLAN 2 (ENTERPRISE - FEATURED) */}
          <div className="p-8 bg-white/[0.02] border-2 border-primary rounded-lg flex flex-col justify-between relative shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-sm">
              Popular
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-primary">SaaS Premium</h4>
              <h3 className="text-3xl font-black mt-4">$499<span className="text-sm text-muted font-normal">/mo</span></h3>
              <p className="text-xs text-muted mt-2">Optimal for multi-governorate enterprise shipping.</p>
              <ul className="flex flex-col gap-3 mt-8 text-sm text-muted">
                <li className="flex items-center gap-2"><Check size={16} className="text-success" /> Unlimited Shipments</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-success" /> Realtime Alerts Channel</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-success" /> AI Gemini Copilot Audits</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-success" /> Advanced RBAC Redirections</li>
              </ul>
            </div>
            <Link 
              href="/login"
              className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-md font-bold text-sm text-center block mt-8 shadow-md transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* PLAN 3 */}
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-muted">Custom Elite</h4>
              <h3 className="text-3xl font-black mt-4">Contact Sales</h3>
              <p className="text-xs text-muted mt-2">Tailored for national postal agencies.</p>
              <ul className="flex flex-col gap-3 mt-8 text-sm text-muted">
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Dedicated Supabase Instance</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> Customized Gemini Fine-tuning</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" /> 24/7 SLA Engineer Support</li>
              </ul>
            </div>
            <Link 
              href="/login"
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md font-bold text-sm text-center block mt-8 transition-all"
            >
              Contact Team
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center relative z-20 text-xs text-muted flex flex-col gap-4">
        <p>© 2026 LogisHub Enterprise Egypt. All rights reserved.</p>
        <p className="uppercase tracking-wider text-[10px]">
          Next.js 14 • Supabase PostgreSQL • Gemini AI Flash Engine
        </p>
      </footer>

    </div>
  );
}
