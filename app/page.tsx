'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, Building, Shield, ClipboardCheck, ArrowRight, Sun, Moon, 
  Sparkles, Bell, Wifi, RefreshCw, Layers, MapPin, CheckCircle
} from 'lucide-react';

import { 
  INITIAL_RESTAURANTS, 
  INITIAL_FOOD_ITEMS, 
  SEED_ORDERS, 
  INITIAL_DRIVERS, 
  MAHOTTARI_MUNICIPALITIES, 
  Restaurant, 
  Order, 
  MenuItem, 
  DeliveryPartner
} from '@/lib/mockData';

// import modular child roles
import CustomerApp from '@/components/CustomerApp';
import RestaurantPanel from '@/components/RestaurantPanel';
import DeliveryApp from '@/components/DeliveryApp';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  // Global States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [foodItems, setFoodItems] = useState<MenuItem[]>(INITIAL_FOOD_ITEMS);
  const [activeOrders, setActiveOrders] = useState<Order[]>(SEED_ORDERS);
  const [drivers, setDrivers] = useState<DeliveryPartner[]>(INITIAL_DRIVERS);
  
  // Theme Toggle State 
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Active Tenant View: 'customer' | 'restaurant' | 'delivery' | 'admin'
  const [activeRole, setActiveRole] = useState<'customer' | 'restaurant' | 'delivery' | 'admin'>('customer');

  // FCM Push Notifications overlay state
  const [pushNotifications, setPushNotifications] = useState<Array<{ id: number; title: string; body: string; type: string }>>([]);

  // Trigger push alert helper
  const triggerNotification = (title: string, body: string, type: string = 'fcm') => {
    const id = Date.now();
    setPushNotifications(prev => [{ id, title, body, type }, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setPushNotifications(prev => prev.filter(n => n.id !== id));
    }, 5500);
  };

  // Switch role tab helper
  const handleRoleChange = (role: 'customer' | 'restaurant' | 'delivery' | 'admin') => {
    setActiveRole(role);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-500 font-sans relative overflow-x-hidden flex flex-col`}>
      
      {/* Traditional Maithili Art Aesthetic Accent lines on page limits */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-amber-400 via-emerald-500 to-orange-600 z-50"></div>

      {/* FLOATING PUSH NOTIFICATIONS BROADCAST FEEDS (FCM MOCK) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-[320px] w-full">
        <AnimatePresence>
          {pushNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              className="p-3 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl border border-orange-500/30 shadow-2xl flex gap-2.5 items-start"
            >
              <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl">
                <Bell className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-orange-400 leading-tight flex items-center gap-1.5 justify-between">
                  <span>{notif.title}</span>
                  <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded uppercase bg-orange-600">LIVE FEED</span>
                </h4>
                <p className="text-[10px] text-slate-305 mt-0.5 leading-tight text-slate-350">{notif.body}</p>
              </div>
              <button 
                onClick={() => setPushNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-slate-500 hover:text-white"
              >
                <XIcon />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CENTRAL BAR CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex-1 flex flex-col gap-6 w-full">
        
        {/* TOP COMPACT TITLE HEADER MODULE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2 border-b border-orange-500/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛵</span>
              <h1 className="text-2xl font-black tracking-tight text-[#FF6B00] flex items-center gap-1.5 uppercase">
                Mithila Express
              </h1>
              <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full leading-none">
                Mahottari District, Nepal
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
              Connects Customers, Restaurant Kitchens, Courier Delivery Partners, and Admin controls.
            </p>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-start">
            {/* Dark mode switcher toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-amber-400' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'} transition-all`}
              title="Toggle Theme Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick State reset button */}
            <button
              onClick={() => {
                setRestaurants(INITIAL_RESTAURANTS);
                setFoodItems(INITIAL_FOOD_ITEMS);
                setActiveOrders(SEED_ORDERS);
                setDrivers(INITIAL_DRIVERS);
                triggerNotification("Simulation Reset 🔄", "Initial pre-seeded orders and shops restored to default.", "info");
              }}
              className="flex items-center gap-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" /> Reset Data
            </button>
          </div>
        </div>

        {/* ROLE SIMULATION RAIL (Role buttons at top with quick guides) */}
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white shadow-sm border-slate-100'}`}>
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-orange-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox Role Switcher
            </h2>
            <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Mithila Express is a fully collaborative food matrix. You can toggle roles in real time! Try: Place order on Customer app ➡️ Approve restaurant on Admin Panel ➡️ Cook dish on Restaurant portal ➡️ Deliver on Delivery driver app!
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeRole === 'customer' 
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-md shadow-orange-500/15'
                    : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 Customer View (Mobile App)</span>
              </button>

              <button
                onClick={() => handleRoleChange('restaurant')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeRole === 'restaurant' 
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-md shadow-orange-500/15'
                    : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>🏪 Restaurant dashboard</span>
              </button>

              <button
                onClick={() => handleRoleChange('delivery')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeRole === 'delivery' 
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-md shadow-orange-500/15'
                    : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>🛵 Delivery Partner App</span>
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeRole === 'admin' 
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-md shadow-orange-500/15'
                    : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>🛡️ Central Admin panel</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE ROLE CANVAS PLATFORM */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {/* ROLE: CUSTOMER APP (MOBILE INNER MODE) */}
            {activeRole === 'customer' && (
              <motion.div
                key="customer_role"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                  {/* Left Side: Mobile Simulated Frame */}
                  <CustomerApp 
                    restaurants={restaurants}
                    foodItems={foodItems}
                    activeOrders={activeOrders}
                    setActiveOrders={setActiveOrders}
                    isDarkMode={isDarkMode}
                    onNavigateToRole={(role) => handleRoleChange(role as any)}
                  />

                  {/* Right Side: Informative Guide box */}
                  <div className="max-w-md flex flex-col gap-4 text-xs">
                    <div className={`p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-orange-500/5'}`}>
                      <h3 className="text-sm font-black text-[#FF6B00] mb-2 flex items-center gap-1.5 uppercase">
                        <span>📱 Customer Experience Simulator</span>
                      </h3>
                      <p className="leading-relaxed text-slate-400">
                        This mockup illustrates the <strong>Mithila Express Flutter Mobile Client Interface</strong>. The app operates with responsive animations and premium custom glassmorphism components:
                      </p>
                      <ul className="list-disc pl-4 mt-2 flex flex-col gap-1.5 text-slate-400">
                        <li><strong>Browse Local Sweets & Momo:</strong> Browse top-rated restaurants across Bardibas, Jaleshwar, and Gaushala.</li>
                        <li><strong>eSewa / Khalti Interfacing:</strong> Choose the eSewa or Khalti radio buttons and proceed to checkout. It triggers a simulated OTP verification SMS workflow.</li>
                        <li><strong>AI Chat Recommendations:</strong> Tap the sparkles ✨ <strong>Mithila AI</strong> button in the footer menu to interact live with Gemini. It will recommend meals, Sweets, provide delivery assistance and write delightful local reviews.</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-3xl border opacity-80 ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50' : 'bg-slate-100'}`}>
                      <h4 className="font-extrabold uppercase text-slate-500 mb-1">Nepal District Support</h4>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Only deliveries inside **Mahottari District** municipalities (Bardibas, Gaushala, Loharpatti, etc.) are allowed. Ward settings are checked at checkout bounds.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROLE: RESTAURANT PANEL DASHBOARD TYPE */}
            {activeRole === 'restaurant' && (
              <motion.div
                key="restaurant_role"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-5xl"
              >
                <RestaurantPanel 
                  restaurants={restaurants}
                  setRestaurants={setRestaurants}
                  foodItems={foodItems}
                  setFoodItems={setFoodItems}
                  orders={activeOrders}
                  setOrders={setActiveOrders}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            )}

            {/* ROLE: MOTORCYCLE DELIVERY PARTNER SIMULATOR */}
            {activeRole === 'delivery' && (
              <motion.div
                key="delivery_role"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex justify-center"
              >
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                  <DeliveryApp 
                    orders={activeOrders}
                    setOrders={setActiveOrders}
                    isDarkMode={isDarkMode}
                  />

                  {/* Left Side: Informative guide box */}
                  <div className="max-w-md flex flex-col gap-4 text-xs">
                    <div className={`p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-emerald-500/5'}`}>
                      <h3 className="text-sm font-black text-emerald-500 mb-2 flex items-center gap-1.5 uppercase">
                        <span>🛵 Delivery Fleet Mobile App</span>
                      </h3>
                      <p className="leading-relaxed text-slate-400">
                        This view models the <strong>Mithila Express Delivery Partner App</strong> used by scooter couriers across Mahottari:
                      </p>
                      <ul className="list-disc pl-4 mt-2 flex flex-col gap-1.5 text-slate-400">
                        <li><strong>Claim Orders:</strong> Read and claim available client dishes waiting at Jaleshwar or Bardibas kitchens.</li>
                        <li><strong>Commute Progressions:</strong> Progress the claimed task status step-by-step. The live tracker client map on the 📱 <strong>Customer App</strong> tab will update in real-time!</li>
                        <li><strong>Secure Contacts:</strong> Tap phone icons to start dialer dialogues to call clients or kitchen owners directly on our speech bridge.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROLE: CENTRAL MANAGEMENT ADMIN PANEL */}
            {activeRole === 'admin' && (
              <motion.div
                key="admin_role"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-5xl"
              >
                <AdminPanel 
                  restaurants={restaurants}
                  setRestaurants={setRestaurants}
                  orders={activeOrders}
                  setOrders={setActiveOrders}
                  foodItems={foodItems}
                  drivers={drivers}
                  isDarkMode={isDarkMode}
                  onTriggerNotification={triggerNotification}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={`mt-auto py-5 border-t border-orange-500/10 text-center text-xs ${isDarkMode ? 'bg-slate-950 text-slate-500' : 'bg-white text-slate-500'} transition-all`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Mithila Express Food Logistics Pvt. Ltd. — Mahottari District, Nepal.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Minimal placeholder subcomponenets
function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
