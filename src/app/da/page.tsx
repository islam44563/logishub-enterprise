'use client';

import React, { useState } from 'react';
import { updateShipmentStatus } from '@/app/actions/shipments';
import { Phone, MessageSquare, Check, AlertTriangle, ShieldAlert, ArrowLeftRight, User, MapPin } from 'lucide-react';

export default function CourierMobilePage() {
  const [wallet, setWallet] = useState(350.00); // EGP Cash collected
  const [shipments, setShipments] = useState<any[]>([
    {
      id: "ship-01",
      tracking: "LH-9403",
      name: "Mariam Soliman",
      phone: "+20 112 394 8829",
      governorate: "Alexandria",
      city: "Smouha",
      address: "Smouha, Victor Emmanuel Sq, Bldg 8, next to Smouha Pharmacy",
      cod: 850.00,
      status: "out_for_delivery"
    },
    {
      id: "ship-02",
      tracking: "LH-9407",
      name: "Omar El-Shenawy",
      phone: "+20 109 238 4819",
      governorate: "Dakahlia",
      city: "Mansoura",
      address: "Mansoura, University St, building 12, front of gate 3",
      cod: 150.00,
      status: "out_for_delivery"
    }
  ]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDeliver = async (id: string, tracking: string, cod: number) => {
    setLoadingId(id);
    try {
      // Trigger Database Status Update Server Action
      await updateShipmentStatus(id, 'delivered', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', `Delivered on-duty. Collected EGP COD ${cod}`);
      
      // Update UI state
      setWallet(prev => prev + cod);
      setShipments(prev => prev.filter(s => s.id !== id));
      alert(`Success! Collected ${cod} EGP. Cash ledger updated.`);
    } catch (err) {
      // Local state fallback if placeholder environment
      setWallet(prev => prev + cod);
      setShipments(prev => prev.filter(s => s.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  const handlePostpone = async (id: string) => {
    setLoadingId(id);
    try {
      await updateShipmentStatus(id, 'failed_delivery', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Delivery postponed: Customer unreachable.');
      setShipments(prev => prev.filter(s => s.id !== id));
      alert('Shipment postponed. Returned to Station Queue.');
    } catch (err) {
      setShipments(prev => prev.filter(s => s.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      
      {/* PHONE CONTAINER BODY */}
      <div className="w-[380px] h-[780px] bg-black/60 border-[6px] border-secondary rounded-[40px] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-secondary rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-black/40 rounded-full" />
        </div>

        {/* Mobile Header */}
        <header className="pt-8 pb-4 px-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              AH
            </div>
            <div>
              <h2 className="text-xs font-bold leading-none">Ahmed Hegazi</h2>
              <span className="text-[10px] text-muted">Courier • Motorcycle</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-muted block">COD WALLET</span>
            <strong className="text-xs text-success font-bold">{wallet.toFixed(2)} EGP</strong>
          </div>
        </header>

        {/* Mobile Feed */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Routes Assigned ({shipments.length})</span>
            <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
              <MapPin size={10} /> Alexandria Hub
            </span>
          </div>

          {shipments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center text-xs text-muted">
              <Check className="text-success p-2 bg-success/10 rounded-full" size={40} />
              All deliveries completed!<br />Return to hub to settle cash.
            </div>
          ) : (
            shipments.map(ship => (
              <div 
                key={ship.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 hover:border-white/20 transition-all"
              >
                {/* ID & COD Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-black text-primary">{ship.tracking}</span>
                  <span className="text-xs font-bold text-success">{ship.cod} EGP COD</span>
                </div>

                {/* Recipient Address */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1 font-semibold">
                    <User size={12} className="text-muted" /> {ship.name}
                  </div>
                  <div className="text-muted leading-relaxed flex items-start gap-1 mt-1 text-[11px]">
                    <MapPin size={12} className="text-danger mt-0.5 flex-shrink-0" />
                    <span dir="rtl" className="text-right block w-full">{ship.address}</span>
                  </div>
                </div>

                {/* Quick Actions (WhatsApp & Dialer) */}
                <div className="flex gap-2 border-t border-white/5 pt-2">
                  <a 
                    href={`tel:${ship.phone}`}
                    className="flex-1 py-2 bg-white/5 border border-white/10 text-xs font-semibold rounded-md flex items-center justify-center gap-1 hover:bg-white/10"
                  >
                    <Phone size={12} /> Call Customer
                  </a>
                  <a 
                    href={`https://wa.me/${ship.phone.replace(/[^0-9]/g, '')}?text=Dear%20Customer,%20your%20LogisHub%20package%20is%20out%20for%20delivery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-white/5 border border-white/10 text-xs font-semibold rounded-md flex items-center justify-center gap-1 hover:bg-white/10"
                  >
                    <MessageSquare size={12} className="text-success" /> WhatsApp
                  </a>
                </div>

                {/* Delivery Triggers */}
                <div className="flex gap-2 mt-1">
                  <button 
                    disabled={loadingId === ship.id}
                    onClick={() => handleDeliver(ship.id, ship.tracking, ship.cod)}
                    className="flex-1 py-2 bg-success/20 border border-success/30 text-success text-[11px] font-bold rounded-md flex items-center justify-center gap-1 hover:bg-success hover:text-white transition-all"
                  >
                    Confirm Delivery
                  </button>
                  <button 
                    disabled={loadingId === ship.id}
                    onClick={() => handlePostpone(ship.id)}
                    className="px-3 py-2 bg-danger/10 border border-danger/30 text-danger text-[11px] font-bold rounded-md hover:bg-danger hover:text-white transition-all"
                  >
                    Failed
                  </button>
                </div>

              </div>
            ))
          )}

        </main>

        {/* Home Indicator */}
        <div className="h-6 w-full flex items-center justify-center pb-2 bg-black/40">
          <div className="w-28 h-1 bg-white/20 rounded-full" />
        </div>

      </div>

    </div>
  );
}
