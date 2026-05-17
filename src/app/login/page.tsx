'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleRoleSignIn = (role: string, targetPath: string) => {
    setLoadingRole(role);
    
    // Simulate setting auth session cookies and role routing
    document.cookie = `logishub-user-role=${role}; path=/; max-age=86400`;
    document.cookie = `sb-access-token=demo-active-token-9482; path=/; max-age=86400`;

    // Wait short delay for realistic animation, then redirect
    setTimeout(() => {
      window.location.href = targetPath;
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground font-sans px-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/[0.02] border border-white/10 rounded-lg backdrop-blur-md relative z-10 flex flex-col gap-6">
        
        {/* LOGO */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 bg-primary/10 text-primary rounded-full animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">LOGISHUB ENTERPRISE</h1>
          <p className="text-sm text-muted">B2B SaaS Gatekeeper & RBAC Control Portal</p>
        </div>

        {/* INFO NOTICE */}
        <div className="flex gap-3 p-4 rounded-md bg-primary/5 border border-primary/10 text-xs leading-relaxed">
          <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
          <div className="text-muted">
            <span className="text-foreground font-bold">Demo Mode Active:</span> Select a role below to simulate instantaneous session injection and test middleware redirection rules live!
          </div>
        </div>

        {/* ROLE CARDS */}
        <div className="flex flex-col gap-3">
          
          {/* ROLE 1: OPS AGENT */}
          <button
            onClick={() => handleRoleSignIn('ops_agent', '/dashboard/ops')}
            disabled={loadingRole !== null}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-primary/50 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-md">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Operations Room Agent</h4>
                <p className="text-xs text-muted mt-0.5">Manage Cairo Hub & resolve wrong routings</p>
              </div>
            </div>
            {loadingRole === 'ops_agent' ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" />
            )}
          </button>

          {/* ROLE 2: COURIER (DA) */}
          <button
            onClick={() => handleRoleSignIn('da_courier', '/da')}
            disabled={loadingRole !== null}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-success/50 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-success/10 text-success rounded-md">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Delivery Courier (DA)</h4>
                <p className="text-xs text-muted mt-0.5">Mobile delivery simulator & WhatsApp alert triggers</p>
              </div>
            </div>
            {loadingRole === 'da_courier' ? (
              <div className="w-4 h-4 border-2 border-success border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight size={16} className="text-muted group-hover:text-success transition-colors group-hover:translate-x-1 duration-200" />
            )}
          </button>

          {/* ROLE 3: HUB MANAGER */}
          <button
            onClick={() => handleRoleSignIn('hub_manager', '/shipments')}
            disabled={loadingRole !== null}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 hover:border-warning/50 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-warning/10 text-warning rounded-md">
                <UserCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">General Hub Manager</h4>
                <p className="text-xs text-muted mt-0.5">Access global tracking & call Gemini AI Copilot</p>
              </div>
            </div>
            {loadingRole === 'hub_manager' ? (
              <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight size={16} className="text-muted group-hover:text-warning transition-colors group-hover:translate-x-1 duration-200" />
            )}
          </button>

        </div>

        {/* BRAND FOOTER */}
        <p className="text-[10px] text-center text-muted uppercase tracking-wider mt-2">
          LogisHub Egypt B2B Platform • Securing Middle East Hubs
        </p>

      </div>
    </div>
  );
}
