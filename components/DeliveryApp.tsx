'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Phone, MapPin, Navigation, TrendingUp, Compass, Clock, 
  Map, ShieldAlert, CheckCircle, Smartphone, Award, DollarSign
} from 'lucide-react';
import { Order, OrderStatus, DeliveryPartner } from '@/lib/mockData';

interface DeliveryAppProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isDarkMode: boolean;
}

export default function DeliveryApp({
  orders,
  setOrders,
  isDarkMode
}: DeliveryAppProps) {
  // Current active driver ID: 'driver_1' (Ram Baran Yadav)
  const [driverOnline, setDriverOnline] = useState(true);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  
  // Audio Call Popup Dialog State
  const [phoneCallState, setPhoneCallState] = useState<{ isOpen: boolean; name: string; number: string; role: string }>({
    isOpen: false,
    name: '',
    number: '',
    role: ''
  });

  // Calculate stats
  const completedJobs = orders.filter(o => o.deliveryPartnerId === 'driver_1' && o.status === 'Delivered');
  const availableJobs = orders.filter(o => !o.deliveryPartnerId && (o.status === 'Order Received' || o.status === 'Preparing'));
  const activeJob = orders.find(o => o.deliveryPartnerId === 'driver_1' && o.status !== 'Delivered' && o.status !== 'Cancelled');

  const stats = {
    deliveriesCount: completedJobs.length,
    earnings: completedJobs.reduce((sum, o) => sum + 120 + (o.deliveryCharge || 40), 0) + (completedJobs.length * 30), // standard fee + tip
    reviewsCount: 4.9
  };

  const handleAcceptJob = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryPartnerId: 'driver_1',
          deliveryPartnerName: 'Ram Baran Yadav',
          status: 'Preparing' as OrderStatus
        };
      }
      return o;
    }));
    setActiveJobId(orderId);
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!activeJob) return;
    setOrders(prev => prev.map(o => {
      if (o.id === activeJob.id) {
        return {
          ...o,
          status,
          eta: status === 'On the Way' ? 10 : status === 'Delivered' ? 0 : o.eta
        };
      }
      return o;
    }));
  };

  const triggerCallPopup = (name: string, number: string, role: string) => {
    setPhoneCallState({
      isOpen: true,
      name,
      number,
      role
    });
  };

  return (
    <div className={`relative w-[370px] h-[755px] ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} rounded-[45px] border-[10px] ${isDarkMode ? 'border-slate-800' : 'border-slate-300'} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col mx-auto transition-colors duration-300`}>
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
      </div>
      <div className="h-7 bg-slate-950 flex-shrink-0"></div>

      {/* Screen Title */}
      <div className="p-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white flex-shrink-0 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <h1 className="text-xs font-black uppercase tracking-wider">Mithila Courier Desk</h1>
        </div>
        
        {/* Availability Switcher */}
        <button
          onClick={() => setDriverOnline(!driverOnline)}
          className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1 border transition-all ${
            driverOnline ? 'bg-white/10 border-white text-white' : 'bg-red-500/10 border-red-500 text-white'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${driverOnline ? 'bg-green-400 animate-ping' : 'bg-red-500'}`}></span>
          {driverOnline ? 'ONLINE' : 'OFFLINE'}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 pb-8 no-scrollbar">
        {/* Profile Stats summary banner */}
        <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md">
              RY
            </div>
            <div>
              <p className="text-[10px] font-black leading-tight text-white">Ram Baran Yadav</p>
              <p className="text-[8px] text-slate-400">Ba 54 Pa 8219 • Jaleshwar, Mahottari</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[7.5px] text-slate-400 uppercase font-black">Daily Cash</p>
            <p className="text-[12px] font-black text-emerald-500">NPR {stats.earnings}</p>
          </div>
        </div>

        {/* Available Jobs list if free */}
        {!activeJob ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Available Orders in Mahottari</h2>
              <span className="text-[8px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-black">
                {availableJobs.length} Ready
              </span>
            </div>

            {availableJobs.length === 0 ? (
              <div className="p-12 border border-dashed rounded-2xl text-center text-slate-400 text-xs text-slate-500">
                📭 No orders are currently ready for pick-up. Customers must add food and checkout. Keep this portal open!
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {availableJobs.map((job) => (
                  <div key={job.id} className={`p-3 rounded-2xl border flex flex-col gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center text-[9px] font-black text-orange-500">
                      <span>{job.restaurantName}</span>
                      <span className="font-extrabold text-slate-500">NPR {job.total} Order</span>
                    </div>

                    <div className="text-[9px] text-slate-500 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" />
                        <span>Pickup: {job.restaurantName} (Ward 3)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>Merchant Dropoff: {job.municipality}, Ward {job.wardNumber} ({job.deliveryAddress})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-emerald-500/15"
                    >
                      <Check className="w-3.5 h-3.5" /> Claim Delivery (Earn NPR 160)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE TASK IN PROGRESS SCREEN */
          <div className="flex flex-col gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
              <p className="text-[9px] font-black uppercase text-indigo-500">In-progress Delivery Job</p>
              <span className="text-[8.5px] font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded leading-none">
                {activeJob.status}
              </span>
            </div>

            {/* Merchant Details Card */}
            <div className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black">{activeJob.restaurantName}</h3>
                  <p className="text-[8.5px] text-slate-500">Pickup address: Ward 3, Bardibas, Mahottari</p>
                </div>
                <button
                  onClick={() => triggerCallPopup(activeJob.restaurantName, '9844002233', 'Restaurant Owner')}
                  className="p-1.5 bg-orange-500/10 hover:bg-orange-500/20 rounded-full text-orange-600"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Customer Dropoff Card */}
            <div className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[7.5px] font-extrabold uppercase bg-emerald-550/10 text-emerald-600 px-1.5 py-0.5 rounded leading-none">DROPOFF CLIENT</span>
                  <h3 className="text-xs font-black mt-1">{activeJob.customerName}</h3>
                  <p className="text-[8.5px] text-slate-500">{activeJob.municipality}, Ward {activeJob.wardNumber} ({activeJob.deliveryAddress})</p>
                </div>
                <button
                  onClick={() => triggerCallPopup(activeJob.customerName, activeJob.customerPhone, 'Customer')}
                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full text-emerald-600"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeJob.notes && (
                <div className="text-[8px] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border-l-2 border-orange-500 leading-tight">
                  📢 Client Note: &quot;{activeJob.notes}&quot;
                </div>
              )}
            </div>

            {/* DYNAMIC ILLUSTRATION ROAD VECTOR ROUTE MAP */}
            <div className="h-44 rounded-2xl relative overflow-hidden bg-slate-950/20 border">
              <svg className="w-full h-full" viewBox="0 0 300 180">
                <rect width="300" height="180" fill={isDarkMode ? "#020617" : "#F8FAFC"} />
                {/* Background Roads Grid */}
                <path d="M 0,50 Q 80,10 150,90 T 300,50" fill="none" stroke={isDarkMode ? "#1E293B" : "#E2E8F0"} strokeWidth="5" strokeLinecap="round" />
                <path d="M 50,0 Q 150,110 300,120" fill="none" stroke={isDarkMode ? "#1E293B" : "#E2E8F0"} strokeWidth="5" strokeLinecap="round" />
                
                {/* Active claimed job road path */}
                <path d="M 30,50 C 90,50 150,110 210,110 C 240,110 270,140 280,140" fill="none" stroke={isDarkMode ? "#334155" : "#94A3B8"} strokeWidth="6" strokeLinecap="round" />
                <path d="M 30,50 C 90,50 150,110 210,110 C 240,110 270,140 280,140" fill="none" stroke="#2ECC71" strokeWidth="2.5" strokeLinejoin="round" />

                {/* Markers */}
                <circle cx="30" cy="50" r="4.5" fill="#FF6B00" />
                <text x="35" y="53" fill={isDarkMode ? "#FFF" : "#000"} fontSize="7" fontWeight="black" fillOpacity="0.8">PICKUP (SHOP)</text>

                <circle cx="210" cy="110" r="4.5" fill="#3B82F6" />
                <text x="215" y="113" fill={isDarkMode ? "#FFF" : "#000"} fontSize="7" fontWeight="black" fillOpacity="0.8">DROPOFF (HOME)</text>

                {/* Interactive moving delivery partner bike icon pointer */}
                <g>
                  {activeJob.status === 'Preparing' && (
                    <circle cx="30" cy="50" r="6" fill="#EA580C" className="animate-ping" />
                  )}
                  {activeJob.status === 'Picked Up' && (
                    <circle cx="85" cy="50" r="5" fill="#10B981" />
                  )}
                  {activeJob.status === 'On the Way' && (
                    <circle cx="160" cy="95" r="5" fill="#10B981" className="animate-bounce" />
                  )}
                </g>
              </svg>

              <div className="absolute top-2 left-2 bg-[#F67400]/80 text-white font-mono text-[7px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                <Navigation className="w-2.5 h-2.5 rotate-45" /> Speed: 32 Km/h • Bardibas Highway Route
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="flex flex-col gap-2 pt-2">
              {activeJob.status === 'Preparing' && (
                <div className="text-[9.5px] text-center p-3 text-amber-600 bg-amber-500/10 border border-dashed rounded-xl border-amber-500/20">
                  ⏳ <strong>Kitchen is cooking...</strong> Once the Restaurant dashboard/admin updates the order to &quot;Picked Up&quot;, you can activate scooter navigation drops!
                </div>
              )}

              {activeJob.status === 'Picked Up' && (
                <button
                  onClick={() => handleUpdateStatus('On the Way')}
                  className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-[11px] py-3 rounded-xl transition-all shadow text-center flex items-center justify-center gap-1"
                >
                  <Navigation className="w-4 h-4" /> Commute: Start Scooter Trip
                </button>
              )}

              {activeJob.status === 'On the Way' && (
                <button
                  onClick={() => handleUpdateStatus('Delivered')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold text-[11px] py-3 rounded-xl transition-all shadow text-center flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" /> Tap to Complete Dropoff & Collect Cash
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AUDIO PHONE CALL POPUP PANEL */}
      <AnimatePresence>
        {phoneCallState.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            className="absolute bottom-4 left-4 right-4 bg-slate-900 border border-slate-800 text-white p-4 rounded-3xl z-50 shadow-2xl flex flex-col items-center text-center gap-3"
          >
            <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Phone className="w-6 h-6 text-white" />
            </div>

            <div>
              <p className="text-[9px] text-[#FF6B00] font-black uppercase tracking-wider">{phoneCallState.role} CALL SIMULATOR</p>
              <h3 className="text-sm font-black text-white">{phoneCallState.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{phoneCallState.number}</p>
            </div>

            <p className="text-[9px] text-slate-500 leading-tight">
              📞 Connected on our local Nepal Mithila Express Voice Bridge context.
            </p>

            <button
              onClick={() => setPhoneCallState({ isOpen: false, name: '', number: '', role: '' })}
              className="mt-1 w-full bg-red-650 hover:bg-red-700 bg-red-600 text-white font-bold text-xs py-2 rounded-xl text-center"
            >
              Hang Up Connection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen edge Indicator pill */}
      <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-400/50 rounded-full z-40"></div>
    </div>
  );
}
