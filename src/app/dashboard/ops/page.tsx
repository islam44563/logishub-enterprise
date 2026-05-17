'use client';

import React, { useState, useEffect } from 'react';
import { getActiveAlerts, resolveAlert } from '@/app/actions/alerts';
import { getShipments } from '@/app/actions/shipments';
import { AlertCircle, Route, Clock, CheckCircle2, ShieldCheck, Languages, RefreshCw, LogOut } from 'lucide-react';

export default function OperationsRoomPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 284, delayed: 18, misrouted: 4, successRate: '96.8%' });
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Load Realtime Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const activeAlerts = await getActiveAlerts();
      setAlerts(activeAlerts);
      
      const { totalCount, shipments } = await getShipments({ limit: 100 });
      const delayed = shipments.filter((s: any) => s.is_delayed).length;
      const misrouted = shipments.filter((s: any) => s.is_misrouted).length;
      
      setStats({
        total: totalCount || 284,
        delayed: delayed || 18,
        misrouted: misrouted || 4,
        successRate: '96.8%'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleResolve = async (alertId: string, shipmentId: string) => {
    setResolvingId(alertId);
    try {
      // Execute Server Action trigger
      await resolveAlert(alertId, 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Ops agent resolved routing anomaly manually.');
      // Refresh
      await loadDashboardData();
    } catch (err) {
      alert('Failed to resolve alert.');
    } finally {
      setResolvingId(null);
    }
  };

  const translations = {
    en: {
      title: "Operations Room Console",
      subtitle: "Workstation active • Egyptian Operations Group",
      total: "Active Shipments",
      delayed: "SLA Delayed",
      misrouted: "Wrong Routed",
      success: "Success Rate",
      alerts: "Live Operational Alerts",
      resolve: "Resolve",
      resolving: "Saving...",
      emptyAlerts: "All stations running clean. No active anomalies.",
      workload: "Hub Distribution (Active Workload)"
    },
    ar: {
      title: "غرفة العمليات المركزية",
      subtitle: "محطة العمل نشطة • مجموعة العمليات المصرية",
      total: "الشحنات النشطة",
      delayed: "متأخرة عن SLA",
      misrouted: "توجيه خاطئ",
      success: "نسبة النجاح",
      alerts: "تنبيهات العمليات المباشرة",
      resolve: "حل المشكلة",
      resolving: "جاري الحل...",
      emptyAlerts: "جميع محطات الترانزيت تعمل بكفاءة. لا توجد بلاغات.",
      workload: "توزيع المحطات (عبء العمل النشط)"
    }
  };

  const t = translations[lang];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/10 rounded-lg backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            {t.title}
          </h1>
          <p className="text-sm text-muted">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md hover:bg-white/10"
          >
            <Languages size={16} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <button 
            onClick={loadDashboardData}
            className={`p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* METRIC CARD COUNTERS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-lg">
          <div className="p-3 bg-primary/10 text-primary rounded-md">
            <RefreshCw />
          </div>
          <div>
            <span className="text-xs text-muted block uppercase tracking-wider">{t.total}</span>
            <span className="text-2xl font-black">{stats.total}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-lg">
          <div className="p-3 bg-danger/10 text-danger rounded-md">
            <Clock />
          </div>
          <div>
            <span className="text-xs text-muted block uppercase tracking-wider">{t.delayed}</span>
            <span className="text-2xl font-black text-danger">{stats.delayed}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-lg">
          <div className="p-3 bg-warning/10 text-warning rounded-md">
            <Route />
          </div>
          <div>
            <span className="text-xs text-muted block uppercase tracking-wider">{t.misrouted}</span>
            <span className="text-2xl font-black text-warning">{stats.misrouted}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-lg">
          <div className="p-3 bg-success/10 text-success rounded-md">
            <CheckCircle2 />
          </div>
          <div>
            <span className="text-xs text-muted block uppercase tracking-wider">{t.success}</span>
            <span className="text-2xl font-black text-success">{stats.successRate}</span>
          </div>
        </div>

      </section>

      {/* MIDDLE DASHBOARD SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHARTS WORKLOAD */}
        <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/10 rounded-lg flex flex-col gap-6">
          <h2 className="text-base font-bold">{t.workload}</h2>
          <div className="flex items-end justify-around h-64 border-b border-white/10 pb-4">
            <div className="flex flex-col items-center gap-2 w-12">
              <div className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-sm" style={{ height: '70%' }}></div>
              <span className="text-xs text-muted">Cairo</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-12">
              <div className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-sm" style={{ height: '40%' }}></div>
              <span className="text-xs text-muted">Alexandria</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-12">
              <div className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-sm" style={{ height: '25%' }}></div>
              <span className="text-xs text-muted">Giza</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-12">
              <div className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-sm" style={{ height: '15%' }}></div>
              <span className="text-xs text-muted">Mansoura</span>
            </div>
          </div>
        </div>

        {/* ALERTS SYSTEM FEED */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-lg flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold">{t.alerts}</h2>
            <span className="text-xs px-2 py-0.5 bg-danger/10 text-danger font-bold rounded-sm">
              {alerts.length} Active
            </span>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-72 pr-1">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted">
                <CheckCircle2 size={36} className="text-success" />
                {t.emptyAlerts}
              </div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`flex gap-3 p-4 rounded-md bg-white/5 border ${
                    alert.type === 'misrouted' ? 'border-l-4 border-warning border-white/5' : 'border-l-4 border-danger border-white/5'
                  }`}
                >
                  <AlertCircle size={18} className={alert.type === 'misrouted' ? 'text-warning mt-0.5' : 'text-danger mt-0.5'} />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wide">
                      {alert.type === 'misrouted' ? 'Routing Warning' : 'SLA Exceeded'}
                    </h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {lang === 'en' ? alert.message_en : alert.message_ar}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handleResolve(alert.id, alert.shipment_id)}
                        disabled={resolvingId === alert.id}
                        className="px-3 py-1 text-[10px] font-bold uppercase bg-success/10 border border-success text-success rounded-sm hover:bg-success hover:text-white"
                      >
                        {resolvingId === alert.id ? t.resolving : t.resolve}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
