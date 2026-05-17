'use client';

import React, { useState, useEffect } from 'react';
import { getShipments, getShipmentTimeline, rerouteShipment } from '@/app/actions/shipments';
import { getShipmentAIDiagnostics, generateAICustomerApology } from '@/app/actions/copilot';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Sparkles, MessageCircle, FileText, ArrowUpDown, Clock } from 'lucide-react';

export default function ShipmentsLedgerPage() {
  // Query States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [gov, setGov] = useState('all');
  const [anomaly, setAnomaly] = useState<'delayed' | 'misrouted' | 'all'>('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Result States
  const [shipments, setShipments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [activeShip, setActiveShip] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiCommunication, setAiCommunication] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch Shipments
  const loadShipments = async () => {
    setLoading(true);
    try {
      const result = await getShipments({
        search,
        status,
        governorate: gov,
        anomaly,
        page,
        sortBy,
        sortOrder
      });
      setShipments(result.shipments);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [search, status, gov, anomaly, page, sortBy, sortOrder]);

  const handleRowClick = async (shipment: any) => {
    setActiveShip(shipment);
    setAiAnalysis('');
    setAiCommunication('');
    
    try {
      const logs = await getShipmentTimeline(shipment.id);
      setTimeline(logs);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerAIDiagnostic = async () => {
    if (!activeShip) return;
    setAiLoading(true);
    setAiAnalysis('Gemini analyzing timeline logs...');
    try {
      const result = await getShipmentAIDiagnostics(activeShip.id);
      setAiAnalysis(result.analysis);
    } catch (err) {
      setAiAnalysis('AI compilation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const triggerAICustomerApology = async (reason: 'weather' | 'address' | 'unreachable') => {
    if (!activeShip) return;
    setAiLoading(true);
    setAiCommunication('Drafting communication with Gemini 1.5 Flash...');
    try {
      const text = await generateAICustomerApology(activeShip.id, reason);
      setAiCommunication(text);
    } catch (err) {
      setAiCommunication('Failed to generate apology.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSort = (field: string) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortBy(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
    setPage(1);
  };

  const egyptGovernorates = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Qalyubia", "Sharqia", "Gharbia"
  ];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground">
      
      {/* HEADER CONTROLS */}
      <header className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold">Shipment Operations Ledger</h1>
          <p className="text-sm text-muted">Real-time package catalog and diagnostic controls</p>
        </div>
      </header>

      {/* FILTER PANEL */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search tracking, name, governorate..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm rounded-md focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm rounded-md focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="created">Created</option>
            <option value="received_at_hub">Received at Hub</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="failed_delivery">Failed Delivery</option>
          </select>
        </div>

        <div>
          <select 
            value={gov} 
            onChange={(e) => { setGov(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm rounded-md focus:border-primary focus:outline-none"
          >
            <option value="all">All Governorates</option>
            {egyptGovernorates.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setAnomaly(anomaly === 'delayed' ? 'all' : 'delayed')}
            className={`flex-1 text-xs font-bold border rounded-md ${
              anomaly === 'delayed' ? 'bg-danger/10 border-danger text-danger' : 'border-white/10 text-muted hover:bg-white/5'
            }`}
          >
            Delayed
          </button>
          <button 
            onClick={() => setAnomaly(anomaly === 'misrouted' ? 'all' : 'misrouted')}
            className={`flex-1 text-xs font-bold border rounded-md ${
              anomaly === 'misrouted' ? 'bg-warning/10 border-warning text-warning' : 'border-white/10 text-muted hover:bg-white/5'
            }`}
          >
            Misrouted
          </button>
        </div>
      </section>

      {/* DATA LEDGER TABLE */}
      <section className="bg-white/[0.02] border border-white/10 rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-bold text-muted uppercase">
              <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort('tracking_number')}>
                Tracking <ArrowUpDown size={12} className="inline ml-1" />
              </th>
              <th className="p-4">Recipient</th>
              <th className="p-4 cursor-pointer hover:text-foreground" onClick={() => handleSort('governorate')}>
                Governorate <ArrowUpDown size={12} className="inline ml-1" />
              </th>
              <th className="p-4">COD Value</th>
              <th className="p-4">Status</th>
              <th className="p-4">SLA State</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">Retrieving shipment sheets...</td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">No records found.</td>
              </tr>
            ) : (
              shipments.map(ship => (
                <tr 
                  key={ship.id}
                  onClick={() => handleRowClick(ship)}
                  className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <td className="p-4 font-bold text-primary">{ship.tracking_number}</td>
                  <td className="p-4">
                    <div className="font-semibold">{ship.recipient_name}</div>
                    <div className="text-xs text-muted">{ship.recipient_phone}</div>
                  </td>
                  <td className="p-4">{ship.governorate}</td>
                  <td className="p-4 text-success font-semibold">{ship.cod_amount} EGP</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      ship.status === 'delivered' ? 'bg-success/10 text-success' :
                      ship.status === 'out_for_delivery' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-muted'
                    }`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-1">
                    {ship.is_delayed && <span className="px-2 py-0.5 text-[10px] font-bold bg-danger/10 border border-danger text-danger rounded-sm">DELAYED</span>}
                    {ship.is_misrouted && <span className="px-2 py-0.5 text-[10px] font-bold bg-warning/10 border border-warning text-warning rounded-sm">MISROUTE</span>}
                    {!ship.is_delayed && !ship.is_misrouted && <span className="text-success font-semibold text-xs">✓ Clean</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 border-t border-white/10">
          <span className="text-xs text-muted">Total: {totalCount} items</span>
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-md disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-md disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED TIMELINE & AI DIAGNOSTIC MODAL */}
      {activeShip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Shipment: {activeShip.tracking_number}
                  <span className={`text-xs px-2.5 py-0.5 font-bold rounded-full ${
                    activeShip.status === 'delivered' ? 'bg-success/10 text-success' : 'bg-white/10 text-muted'
                  }`}>
                    {activeShip.status}
                  </span>
                </h2>
                <p className="text-xs text-muted">Customer details and historical audit trace</p>
              </div>
              <button onClick={() => setActiveShip(null)} className="p-2 hover:bg-white/5 rounded-md">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Shipment Stats */}
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Customer Information</h3>
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-md flex flex-col gap-2 text-sm">
                    <div><strong>Name:</strong> {activeShip.recipient_name}</div>
                    <div><strong>Phone:</strong> {activeShip.recipient_phone}</div>
                    <div><strong>Address:</strong> {activeShip.address_text}</div>
                    <div><strong>Governorate:</strong> {activeShip.governorate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-md">
                    <span className="text-xs text-muted block">COD Collection</span>
                    <strong className="text-lg text-success font-bold">{activeShip.cod_amount} EGP</strong>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-md">
                    <span className="text-xs text-muted block">SLA Deadline</span>
                    <strong className="text-xs text-danger block mt-1 flex items-center gap-1">
                      <Clock size={12} /> {new Date(activeShip.sla_deadline).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                {/* AI Gemini Section */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-md flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-primary flex items-center gap-1">
                      <Sparkles size={14} /> Gemini 1.5 Flash Copilot
                    </h4>
                    <button 
                      onClick={triggerAIDiagnostic}
                      disabled={aiLoading}
                      className="px-3 py-1 text-[10px] font-bold uppercase bg-primary/10 border border-primary text-primary rounded-sm hover:bg-primary hover:text-white"
                    >
                      Audit
                    </button>
                  </div>
                  
                  {aiAnalysis && (
                    <div className="text-xs bg-black/40 p-3 border border-white/5 rounded-sm leading-relaxed text-muted">
                      {aiAnalysis}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={() => triggerAICustomerApology('weather')}
                      className="flex-1 text-[10px] py-1 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10"
                    >
                      Weather Delay
                    </button>
                    <button 
                      onClick={() => triggerAICustomerApology('address')}
                      className="flex-1 text-[10px] py-1 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10"
                    >
                      Landmark Error
                    </button>
                  </div>

                  {aiCommunication && (
                    <textarea 
                      readOnly 
                      value={aiCommunication} 
                      className="w-full h-24 bg-black/40 border border-white/10 p-2 text-xs text-muted rounded-sm focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Historical Audit Timeline */}
              <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Shipment Audit Log History</h3>
                <div className="flex flex-col gap-6 pl-4 border-l border-white/10">
                  {timeline.map((log, index) => (
                    <div key={log.id} className="relative flex flex-col gap-1">
                      <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${
                        index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-white/20'
                      }`} />
                      <span className="text-[10px] text-muted">{new Date(log.created_at).toLocaleString()}</span>
                      <strong className="text-xs font-bold text-foreground capitalize">{log.status}</strong>
                      <p className="text-xs text-muted leading-relaxed">{log.notes_en}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
