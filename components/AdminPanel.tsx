'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Check, X, Bell, UserPlus, FileText, Settings, Sparkles, 
  MapPin, Plus, ListCollapse, TrendingUp, ShoppingBag, ShieldAlert,
  Sliders, ArrowUpRight, CheckCircle2, Ticket
} from 'lucide-react';
import { Restaurant, Order, MenuItem, DeliveryPartner, PROMO_COUPONS, MAHOTTARI_MUNICIPALITIES } from '@/lib/mockData';

interface AdminPanelProps {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  foodItems: MenuItem[];
  drivers: DeliveryPartner[];
  isDarkMode: boolean;
  onTriggerNotification: (title: string, body: string, type?: string) => void;
}

export default function AdminPanel({
  restaurants,
  setRestaurants,
  orders,
  setOrders,
  foodItems,
  drivers,
  isDarkMode,
  onTriggerNotification
}: AdminPanelProps) {
  // Tabs: 'dashboard' | 'shops' | 'orders' | 'push_blasts' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shops' | 'orders' | 'push_blasts' | 'settings'>('dashboard');

  // Push notification blast state
  const [pushTitle, setPushTitle] = useState('Weekend MoMo Fest Alert! 🥟');
  const [pushBody, setPushBody] = useState('Order fresh steamed momo from Gaushala Express and save 15% instantly! Limited offer.');
  const [pushTarget, setPushTarget] = useState<'All' | 'Customers' | 'Drivers' | 'Restaurants'>('All');

  // New coupon creation state
  const [coupons, setCoupons] = useState(PROMO_COUPONS);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 15, type: 'percent' });
  const [couponApplyMsg, setCouponApplyMsg] = useState('');

  // Calculate sum counts
  const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid' || o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingApprovalsCount = restaurants.filter(r => !r.isApproved).length;

  // Approve a restaurant application
  const handleApproveRest = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
    onTriggerNotification("Shop Approved! 🏪", `Mithila Express welcomes ${restaurants.find(r => r.id === id)?.name || 'New Shop'} to our network. Now live!`, "success");
  };

  // Reject a restaurant
  const handleRejectRest = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    onTriggerNotification("Shop Registration Rejected ❌", "Trade license invalid / verification failed.", "error");
  };

  // Assign delivery partner manually in Admin module
  const handleAssignDriver = (orderId: string, driver: DeliveryPartner) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryPartnerId: driver.id,
          deliveryPartnerName: driver.name,
          status: 'Picked Up' // Advance status for quick simulator action!
        };
      }
      return o;
    }));
    onTriggerNotification("Courier Dispatched 🛵", `Order ${orderId} assigned to ${driver.name} for instant delivery.`, "info");
  };

  // Blast Push Notification Simulation
  const handleBlastPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) return;
    
    // Fire shared helper notification in the app frame
    onTriggerNotification(pushTitle, pushBody, "fcm");
    
    setPushTitle('');
    setPushBody('');
  };

  // Create coupon promo code
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const code = newCoupon.code.trim().toUpperCase();
    if (coupons.some(c => c.code === code)) {
      alert('Coupon already exists!');
      return;
    }
    setCoupons([...coupons, {
      code,
      discount: Number(newCoupon.discount),
      type: newCoupon.type,
      label: `${newCoupon.discount}% discount code manually generated`
    }]);
    setNewCoupon({ code: '', discount: 15, type: 'percent' });
    setCouponApplyMsg('Promo Code created and integrated into system!');
    setTimeout(() => setCouponApplyMsg(''), 3000);
  };

  return (
    <div className={`flex flex-col gap-5 p-4 rounded-3xl h-full overflow-y-auto no-scrollbar ${isDarkMode ? 'bg-slate-950/40 text-slate-100 border border-slate-800' : 'bg-white text-slate-800 shadow-md'}`}>
      
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-orange-500/10">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-orange-500 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> Admin Command Dashboard
          </h1>
          <p className="text-xs text-slate-500">Mithila Express centralized supervision and trade desk</p>
        </div>

        {/* Global Action items */}
        <div className="flex gap-2">
          <span className="text-[10px] bg-indigo-500 text-white px-2.5 py-1 rounded-full font-black animate-pulse flex items-center gap-1">
            🛡️ LIVE SECURITY SECURED
          </span>
        </div>
      </div>

      {/* Stats Cards Widget Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <p className="text-[9px] text-slate-500 font-extrabold uppercase">Total Revenue</p>
          <p className="text-sm font-black text-emerald-600 mt-1">NPR {totalRevenue}</p>
        </div>

        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <p className="text-[9px] text-slate-500 font-extrabold uppercase">District Orders</p>
          <p className="text-sm font-black text-[#FF6B00] mt-1">{totalOrders} items</p>
        </div>

        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <p className="text-[9px] text-slate-500 font-extrabold uppercase">Active Shops</p>
          <p className="text-sm font-black text-indigo-500 mt-1">{restaurants.filter(r => r.isApproved).length} live</p>
        </div>

        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <p className="text-[9px] text-slate-500 font-extrabold uppercase">Couriers</p>
          <p className="text-sm font-black text-purple-500 mt-1">{drivers.length} drivers</p>
        </div>

        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} col-span-2 md:col-span-1`}>
          <p className="text-[9px] text-[#5C2D91] dark:text-indigo-400 font-extrabold uppercase">Approvals Queue</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-300">{pendingApprovalsCount} pending</span>
            {pendingApprovalsCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
          </div>
        </div>
      </div>

      {/* Dashboard Sub Navigation Menu */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 border-b border-orange-500/10 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Summary Overview', icon: Sliders },
          { id: 'shops', label: `Shop Approvals (${pendingApprovalsCount})`, icon: UserPlus },
          { id: 'orders', label: 'Monitor Orders', icon: FileText },
          { id: 'push_blasts', label: 'Push Broadcaster', icon: Bell },
          { id: 'settings', label: 'Fares & Area Bounds', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 text-xs font-extrabold pb-2.5 px-1 relative whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'text-orange-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="admTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: SUMMARY OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Active shops overview */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <h3 className="text-xs font-black uppercase text-slate-500 mb-3">Verified Restaurants Register</h3>
            <div className="flex flex-col gap-2">
              {restaurants.map((r) => (
                <div key={r.id} className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-slate-350 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <img src={r.logo} className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <span className="font-extrabold block">{r.name}</span>
                      <span className="text-[9px] text-slate-400">{r.municipality}, Ward {r.wardNumber}</span>
                    </div>
                  </div>
                  <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-black ${
                    r.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.isApproved ? 'Approved & Live' : 'Under Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active courier partners */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
            <h3 className="text-xs font-black uppercase text-slate-500 mb-3">Courier Logistics Status</h3>
            <div className="flex flex-col gap-2">
              {drivers.map((d) => (
                <div key={d.id} className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-slate-350 dark:border-slate-800">
                  <div>
                    <span className="font-extrabold block">{d.name}</span>
                    <span className="text-[9px] text-slate-400">Bike No: {d.vehicleNo}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8.5px] px-1.5 py-0.5 rounded inline-block font-extrabold ${d.isAvailable ? 'bg-green-500/10 text-green-600' : 'bg-slate-350 text-slate-500'}`}>
                      {d.isAvailable ? 'IDLE' : 'ON JOB'}
                    </span>
                    <p className="text-[9px] text-slate-500 font-extrabold mt-0.5">Today: NPR {d.todayEarnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPROVALS */}
      {activeTab === 'shops' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase text-slate-500">Pending Merchant Licenses</h2>
          
          {restaurants.filter(r => !r.isApproved).length === 0 ? (
            <div className="p-10 border border-dashed rounded-2xl text-center text-slate-400 text-xs">
              🎉 Double-pass cleared! No pending store registrations awaiting inspection right now.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {restaurants.filter(r => !r.isApproved).map((rest) => (
                <div key={rest.id} className={`p-3.5 rounded-2xl border flex flex-col gap-3 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-2.5 items-center">
                      <img src={rest.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover boundary-2" />
                      <div>
                        <h3 className="text-xs font-black text-orange-600">{rest.name}</h3>
                        <p className="text-[9px] text-slate-500">Submitted by: <strong>{rest.ownerName}</strong> ({rest.email})</p>
                        <p className="text-[8.5px] text-slate-400">Address Coordinates: {rest.address}, {rest.municipality} Ward {rest.wardNumber}</p>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleApproveRest(rest.id)}
                        className="p-1.5 bg-green-150 hover:bg-green-200 text-green-600 bg-green-500/10 rounded-xl transition-all font-black text-[10px] flex items-center gap-0.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Shop
                      </button>
                      <button
                        onClick={() => handleRejectRest(rest.id)}
                        className="p-1.5 bg-red-150 hover:bg-red-200 text-red-600 bg-red-500/10 rounded-xl transition-all font-black text-[10px] flex items-center gap-0.5"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] bg-slate-800/5 dark:bg-white/5 p-2 rounded-xl text-slate-650 italic">
                    &quot;Shop Description: {rest.description}&quot;
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-[9px] border-t border-dashed border-slate-350 pt-2 text-slate-500">
                    <div>📱 Contact Phone: <strong>+977 {rest.mobileNumber}</strong></div>
                    <div>🕒 Opening times: <strong>{rest.openingTime} - {rest.closingTime}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDERS ADMIN CONTROL */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase text-slate-500">District Logistics Console</h2>
          
          <div className="flex flex-col gap-3">
            {orders.map((ord) => (
              <div 
                key={ord.id} 
                className={`p-3 rounded-2xl border flex flex-col gap-2.5 ${
                  ord.status === 'Delivered' 
                    ? 'opacity-65 bg-slate-100/30' 
                    : 'border-orange-500/10 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 rounded font-black text-[9px] mr-1">
                      ID: {ord.id}
                    </span>
                    <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300">{ord.restaurantName}</span>
                  </div>

                  <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-black ${
                    ord.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#FF6B05]'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                {/* Sub Total billing */}
                <div className="text-[9.5px] text-slate-500 bg-slate-800/5 dark:bg-white/5 p-2.5 rounded-xl">
                  <div>📍 Customer Destination: <strong>{ord.customerName}</strong> ({ord.municipality}, Ward {ord.wardNumber})</div>
                  <div>💳 Core Billing: Subtotal: NPR {ord.subtotal} | Delivery: NPR {ord.deliveryCharge} | Total: <strong>NPR {ord.total}</strong></div>
                  
                  {ord.deliveryPartnerName ? (
                    <div className="mt-1 text-emerald-600 font-bold flex items-center gap-0.5">
                      🏍️ Assigned Driver Partner: {ord.deliveryPartnerName}
                    </div>
                  ) : (
                    <div className="mt-1.5 text-amber-600 font-bold flex flex-wrap items-center gap-1">
                      <span>⚠️ Unassigned Courier! Standard Dispatch to available drivers:</span>
                      {drivers.map(drv => (
                        <button
                          key={drv.id}
                          onClick={() => handleAssignDriver(ord.id, drv)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full"
                        >
                          Send to {drv.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PUSH NOTIFICATION BROADCASTER */}
      {activeTab === 'push_blasts' && (
        <form onSubmit={handleBlastPushNotification} className="p-4 rounded-2xl border border-orange-500/10 flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase text-indigo-500 flex items-center gap-1">
            <Bell className="w-4 h-4 text-orange-500 animate-bounce" /> Push Blaster (FCM / SMS simulation)
          </h2>
          <p className="text-[10px] text-slate-400">
            Write global marketing, flash discount alerts, or hazard warning notifications to fire across all active Nepali subscriber devices.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500">Select Target Subscribers</label>
            <select 
              value={pushTarget}
              onChange={(e) => setPushTarget(e.target.value as any)}
              className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white'}`}
            >
              <option value="All">All District Users (All Roles)</option>
              <option value="Customers">Customers App Only</option>
              <option value="Drivers">Delivery Partners App Only</option>
              <option value="Restaurants">Restaurant Merchants Only</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500">Notification Main Alert Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Suhani Peda Festival! 🧈"
              value={pushTitle}
              onChange={(e) => setPushTitle(e.target.value)}
              className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white'}`}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500">Alert Message Body Text</label>
            <textarea 
              rows={3}
              required
              placeholder="Write enticing message of maximum 160 characters..."
              value={pushBody}
              onChange={(e) => setPushBody(e.target.value)}
              className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-955 border-slate-800 text-white' : 'bg-white'}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold text-xs py-2.5 rounded-xl h-10"
          >
            🔥 Fire Broadcaster Campaign Now
          </button>
        </form>
      )}

      {/* TAB CONTENT: ADMIN FARES BOUNDS / SETTINGS */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-3">
          {/* Coupon creation widget */}
          <form onSubmit={handleCreateCoupon} className="p-3.5 rounded-2xl border border-dashed border-orange-500/20 flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase text-slate-500 flex items-center gap-1">
              <Ticket className="w-4 h-4 text-orange-500" /> Create Promotional Promo Voucher
            </h3>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-slate-400">Coupon Promo Code (Upper)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MAHOT15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : ''}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-slate-400">Discount Amount</label>
                <input 
                  type="number" 
                  required
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
                  className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : ''}`}
                />
              </div>
            </div>

            <button type="submit" className="bg-[#2ECC71] hover:bg-green-600 text-white text-[10px] uppercase font-black py-2 rounded-xl">
              Add Promo Code to registry
            </button>
            {couponApplyMsg && <p className="text-[9px] text-green-500 font-bold">{couponApplyMsg}</p>}
          </form>

          {/* Service Area Settings */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50'}`}>
            <h3 className="text-xs font-black uppercase text-slate-500 mb-2">Service Area Bounds</h3>
            <div className="text-[10px] text-slate-500 leading-relaxed mb-3">
              Mithila Express operations are restricted exclusively to physical municipalities of **Mahottari District, Nepal**. Fares calculating model includes standard ward distance indexes.
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-dashed border-slate-350 dark:border-slate-800">
              {MAHOTTARI_MUNICIPALITIES.map((mun) => (
                <span key={mun} className="text-[8.5px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded font-bold">
                  📍 {mun}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
