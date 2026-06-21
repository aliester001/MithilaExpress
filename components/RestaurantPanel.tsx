'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Plus, Edit3, Trash2, Check, X, Tag, Clock, Utensils, 
  MapPin, CheckCircle, ChevronDown, ShoppingBag, TrendingUp, RefreshCw, AlertCircle
} from 'lucide-react';
import { MenuItem, Restaurant, Order, OrderStatus, MAHOTTARI_MUNICIPALITIES, FOOD_CATEGORIES } from '@/lib/mockData';

interface RestaurantPanelProps {
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  foodItems: MenuItem[];
  setFoodItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isDarkMode: boolean;
}

export default function RestaurantPanel({
  restaurants,
  setRestaurants,
  foodItems,
  setFoodItems,
  orders,
  setOrders,
  isDarkMode
}: RestaurantPanelProps) {
  // Select active managed restaurant
  const [activeRestId, setActiveRestId] = useState<string>('rest_1');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'menu' | 'orders' | 'reports'>('orders');

  // New Restaurant Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [newRestForm, setNewRestForm] = useState({
    name: '',
    ownerName: '',
    mobileNumber: '',
    email: '',
    address: '',
    municipality: 'Gaushala',
    wardNumber: 3,
    description: '',
    openingTime: '08:00 AM',
    closingTime: '09:00 PM',
    logo: 'https://picsum.photos/seed/logo_custom/150/150',
    coverImage: 'https://picsum.photos/seed/cover_custom/800/400'
  });
  const [isSubmitRegistrationSuccess, setIsSubmitRegistrationSuccess] = useState(false);

  // New Food Item Form
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  
  const [foodForm, setFoodForm] = useState({
    name: '',
    category: 'momo',
    description: '',
    price: 150,
    discountPrice: 0,
    isAvailable: true,
    prepTime: 15,
    isVeg: true,
    spicyLevel: 'Medium' as 'Mild' | 'Medium' | 'Spicy' | 'Mithila Fire'
  });

  // Fetch metrics for the active restaurant
  const currentRest = restaurants.find(r => r.id === activeRestId);
  const restOrders = orders.filter(o => o.restaurantId === activeRestId);
  const restFoods = foodItems; // In simulation, all share foodItems pool or we categorize by activeRest

  const stats = {
    totalRevenue: restOrders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0),
    totalOrders: restOrders.length,
    activeOrders: restOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
    avgRatings: currentRest?.rating || 4.5
  };

  // Handle order status change in restaurant workflow
  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Calculate dynamic timing remaining based on steps
          let remainingEta = order.eta;
          if (nextStatus === 'Preparing') remainingEta = Math.max(10, order.eta - 5);
          if (nextStatus === 'Picked Up') remainingEta = Math.max(5, order.eta - 10);
          if (nextStatus === 'Delivered') remainingEta = 0;

          return {
            ...order,
            status: nextStatus,
            eta: remainingEta,
            paymentStatus: nextStatus === 'Delivered' ? 'Paid' : order.paymentStatus // Mark COD as Paid on delivery
          } as Order;
        }
        return order;
      })
    );
  };

  // Register New Restaurant Submission
  const handleRegisterRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const newRest: Restaurant = {
      id: 'rest_' + (restaurants.length + 1),
      name: newRestForm.name,
      ownerName: newRestForm.ownerName,
      mobileNumber: newRestForm.mobileNumber,
      email: newRestForm.email,
      address: newRestForm.address,
      municipality: newRestForm.municipality,
      wardNumber: Number(newRestForm.wardNumber),
      description: newRestForm.description,
      openingTime: newRestForm.openingTime,
      closingTime: newRestForm.closingTime,
      logo: newRestForm.logo,
      coverImage: newRestForm.coverImage,
      rating: 4.0,
      deliveryTime: 25,
      deliveryCharge: 40,
      isApproved: false, // Needs ADMIN approval! Awesome workflow.
      reviews: []
    };

    setRestaurants(prev => [...prev, newRest]);
    setIsSubmitRegistrationSuccess(true);
    setTimeout(() => {
      setIsSubmitRegistrationSuccess(false);
      setIsRegistering(false);
      setNewRestForm({
        name: '',
        ownerName: '',
        mobileNumber: '',
        email: '',
        address: '',
        municipality: 'Gaushala',
        wardNumber: 3,
        description: '',
        openingTime: '08:00 AM',
        closingTime: '09:00 PM',
        logo: 'https://picsum.photos/seed/logo_custom/150/150',
        coverImage: 'https://picsum.photos/seed/cover_custom/800/400'
      });
    }, 3000);
  };

  // Add/Edit Food Submission
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodForm.name) return;

    if (editingFoodId) {
      // Edit mode
      setFoodItems(prev => prev.map(f => f.id === editingFoodId ? {
        ...f,
        name: foodForm.name,
        category: foodForm.category,
        description: foodForm.description,
        price: Number(foodForm.price),
        discountPrice: foodForm.discountPrice > 0 ? Number(foodForm.discountPrice) : undefined,
        isAvailable: foodForm.isAvailable,
        prepTime: Number(foodForm.prepTime),
        isVeg: foodForm.isVeg,
        spicyLevel: foodForm.spicyLevel
      } : f));
      setEditingFoodId(null);
    } else {
      // Add mode
      const newFood: MenuItem = {
        id: 'food_' + (foodItems.length + 1),
        name: foodForm.name,
        category: foodForm.category,
        description: foodForm.description,
        price: Number(foodForm.price),
        discountPrice: foodForm.discountPrice > 0 ? Number(foodForm.discountPrice) : undefined,
        image: `https://picsum.photos/seed/fooditem_${foodItems.length + 1}/400/300`,
        isAvailable: foodForm.isAvailable,
        prepTime: Number(foodForm.prepTime),
        isVeg: foodForm.isVeg,
        spicyLevel: foodForm.spicyLevel
      };
      setFoodItems(prev => [...prev, newFood]);
    }

    setIsAddingFood(false);
    setFoodForm({
      name: '',
      category: 'momo',
      description: '',
      price: 150,
      discountPrice: 0,
      isAvailable: true,
      prepTime: 15,
      isVeg: true,
      spicyLevel: 'Medium'
    });
  };

  const handleEditClick = (food: MenuItem) => {
    setEditingFoodId(food.id);
    setFoodForm({
      name: food.name,
      category: food.category,
      description: food.description,
      price: food.price,
      discountPrice: food.discountPrice || 0,
      isAvailable: food.isAvailable,
      prepTime: food.prepTime,
      isVeg: food.isVeg,
      spicyLevel: food.spicyLevel
    });
    setIsAddingFood(true);
  };

  const handleDeleteFood = (id: string) => {
    if (confirm('Are you sure you want to delete this food item from your menu?')) {
      setFoodItems(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className={`flex flex-col gap-5 p-4 rounded-3xl h-full overflow-y-auto no-scrollbar ${isDarkMode ? 'bg-slate-950/40 text-slate-100 border border-slate-800/80' : 'bg-white text-slate-800 shadow-md'}`}>
      
      {/* Header with Switcher or Registration toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-orange-500/10">
        <div>
          <h1 className="text-xl font-black text-orange-500 flex items-center gap-2">
            <Building className="w-6 h-6" /> Restaurant Merchant Portal
          </h1>
          <p className="text-xs text-slate-500">Mithila Express hyper-local digital kitchen desk</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {!isRegistering ? (
            <>
              {/* Select Active Shop to manage */}
              <select 
                value={activeRestId}
                onChange={(e) => setActiveRestId(e.target.value)}
                className={`text-xs p-2 rounded-xl border flex-1 sm:flex-none font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200'}`}
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} {!r.isApproved && '(Pending Approval)'}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsRegistering(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all"
              >
                Register New Shop
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsRegistering(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Cancel Registration
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW: NEW RESTAURANT OWNER REGISTRATION FORM */}
        {isRegistering ? (
          <motion.div
            key="registration_form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-orange-50/20 border-orange-100'}`}
          >
            <h2 className="text-md font-extrabold text-orange-600 mb-2">Register Your Food Outlet / Shop</h2>
            <p className="text-xs text-slate-500 mb-4">
              We connect local traditional sweet hubs and premium kitchens across Mahottari District. Submit details for Admin Approval.
            </p>

            {isSubmitRegistrationSuccess ? (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-green-600 flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10 animate-bounce text-green-500" />
                <h3 className="font-extrabold text-sm">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Our dispatch officers are reviewing your trade details and license. Check back the <strong>Admin Panel</strong> to approve this shop!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterRestaurant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Shop / Restaurant Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Jaleshwar Traditional Sweets"
                    value={newRestForm.name}
                    onChange={(e) => setNewRestForm({ ...newRestForm, name: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Owner Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Manish Dev"
                    value={newRestForm.ownerName}
                    onChange={(e) => setNewRestForm({ ...newRestForm, ownerName: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Nepali Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    placeholder="e.g., 9844xxxxxx"
                    value={newRestForm.mobileNumber}
                    onChange={(e) => setNewRestForm({ ...newRestForm, mobileNumber: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="owner@example.com"
                    value={newRestForm.email}
                    onChange={(e) => setNewRestForm({ ...newRestForm, email: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-955 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Municipality (Mahottari)</label>
                    <select 
                      value={newRestForm.municipality}
                      onChange={(e) => setNewRestForm({ ...newRestForm, municipality: e.target.value })}
                      className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                    >
                      {MAHOTTARI_MUNICIPALITIES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Ward Number</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="15"
                      required
                      value={newRestForm.wardNumber}
                      onChange={(e) => setNewRestForm({ ...newRestForm, wardNumber: Number(e.target.value) })}
                      className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Exact Street Address / Tole</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Bazaar Chowk, near Temple"
                    value={newRestForm.address}
                    onChange={(e) => setNewRestForm({ ...newRestForm, address: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500">Google Maps Coordinate / Landmark Link (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., https://maps.google.com/?q=26.96,85.86"
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Opening Time</label>
                    <input 
                      type="text" 
                      placeholder="08:00 AM"
                      value={newRestForm.openingTime}
                      onChange={(e) => setNewRestForm({ ...newRestForm, openingTime: e.target.value })}
                      className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">Closing Time</label>
                    <input 
                      type="text" 
                      placeholder="09:00 PM"
                      value={newRestForm.closingTime}
                      onChange={(e) => setNewRestForm({ ...newRestForm, closingTime: e.target.value })}
                      className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-955 border-slate-800' : 'bg-white'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500">Outlet Profile Description</label>
                  <textarea 
                    rows={2}
                    placeholder="Speak about your specialty dishes, hygiene compliance..."
                    value={newRestForm.description}
                    onChange={(e) => setNewRestForm({ ...newRestForm, description: e.target.value })}
                    className={`p-2.5 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Trade License Document (Self-Attested OCR PDF)</label>
                  <div className="border border-dashed p-3 rounded-xl text-center text-[10px] text-slate-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                    📄 Simulate License PDF upload.Click to choose file
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Citizenship Document (Front & Back Scanned Image)</label>
                  <div className="border border-dashed p-3 rounded-xl text-center text-[10px] text-slate-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                    🪪 Simulate Citizenship Card.Click to upload
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:col-span-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg mt-2"
                >
                  Submit Registration to Mithila Express Dispatcher
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dashboard_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Warning if Restaurant is not approved yet */}
            {currentRest && !currentRest.isApproved && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-600 block">Restaurant Awaiting Admin Verification</strong>
                  This shop is currently invisible to Customers. Click on the <strong>Admin Panel</strong> role tab above to approve <strong>{currentRest.name}</strong> securely!
                </div>
              </div>
            )}

            {/* Metrics KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Active Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-xs font-extrabold text-green-600">Taking Orders</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Total Orders</p>
                <p className="text-md font-black mt-1 text-orange-500">{stats.totalOrders}</p>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Incoming Queues</p>
                <p className="text-md font-black mt-1 text-indigo-500">{stats.activeOrders} orders</p>
              </div>

              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Today Income</p>
                <p className="text-md font-black mt-1 text-emerald-600">NPR {stats.totalRevenue}</p>
              </div>
            </div>

            {/* Inner Sub-navigation Tabs */}
            <div className="flex gap-2 border-b border-orange-500/10 pb-0.5">
              {[
                { id: 'orders', label: 'In-flight Orders' },
                { id: 'menu', label: 'Dishes / Menu Editor' },
                { id: 'profile', label: 'Trade Details' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`text-[11px] font-extrabold pb-2 px-1 relative transition-all ${
                    activeSubTab === sub.id 
                      ? 'text-orange-500' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {sub.label}
                  {activeSubTab === sub.id && (
                    <motion.div layoutId="subTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeSubTab === 'profile' && currentRest && (
              <div className="p-3 rounded-2xl border flex flex-col gap-2.5 text-xs bg-slate-900/10">
                <h3 className="font-bold text-orange-500 uppercase">Trade Card</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-[10px]">Registry Owner</span>
                    <p className="font-bold">{currentRest.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Verified Contacts</span>
                    <p className="font-bold">{currentRest.mobileNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Municipality Ward</span>
                    <p className="font-bold">{currentRest.municipality}, Ward {currentRest.wardNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Hours</span>
                    <p className="font-bold">{currentRest.openingTime} to {currentRest.closingTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INCOMING ORDERS */}
            {activeSubTab === 'orders' && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xs font-black uppercase text-slate-500">Live Kitchen Docket</h2>
                {restOrders.length === 0 ? (
                  <div className="p-10 border border-dashed rounded-2xl text-center text-slate-400 text-xs">
                    No orders have been placed at this shop yet. Place one under the 📱 <strong>Customer App</strong> tab above!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {restOrders.map((ord) => (
                      <div 
                        key={ord.id} 
                        className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all ${
                          ord.status === 'Delivered' 
                            ? 'opacity-65 bg-slate-100/40 dark:bg-slate-900/10' 
                            : 'border-orange-500/20 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300 dark:border-slate-800">
                          <div>
                            <span className="text-[9px] bg-slate-800/10 text-[rgb(255,107,0)] font-black px-2 py-0.5 rounded mr-1.5">
                              ID: {ord.id}
                            </span>
                            <span className="text-[10px] font-bold">{ord.customerName}</span>
                          </div>
                          
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                            ord.status === 'Order Received' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                            ord.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                            ord.status === 'Picked Up' ? 'bg-purple-100 text-purple-700' :
                            ord.status === 'On the Way' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Order items */}
                        <div className="flex flex-col gap-1 text-[10px] text-slate-500">
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between font-medium">
                              <span>- {it.foodItem.name} <strong>x{it.quantity}</strong></span>
                              <span>NPR {it.quantity * (it.foodItem.discountPrice || it.foodItem.price)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Coordinates and notes */}
                        <div className="text-[9px] text-slate-500 bg-slate-800/5 dark:bg-white/5 p-2 rounded-xl flex flex-col gap-0.5">
                          <div>📍 Deliver to: <strong>{ord.municipality} Ward {ord.wardNumber}</strong> ({ord.deliveryAddress})</div>
                          <div>💳 Payment Type: <strong>{ord.paymentMethod} ({ord.paymentStatus})</strong></div>
                          {ord.notes && <div className="italic">📝 Notes: &quot;{ord.notes}&quot;</div>}
                        </div>

                        {/* Action buttons matching current status */}
                        <div className="flex gap-2 justify-end pt-1">
                          {ord.status === 'Order Received' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                              className="bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept Order & Cook
                            </button>
                          )}

                          {ord.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Picked Up')}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all text-center flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" /> Mark Ready (Awaiting Driver)
                            </button>
                          )}

                          {ord.status === 'Picked Up' && (
                            <p className="text-[9px] text-slate-400 italic">Courier Partner is securing items...</p>
                          )}

                          {ord.status === 'On the Way' && (
                            <p className="text-[9px] text-orange-600 font-bold animate-pulse">🛵 Delivery partner en-route to {ord.municipality}...</p>
                          )}

                          {ord.status === 'Delivered' && (
                            <span className="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" /> Safely completed & paid!
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: FOODS MENU EDITOR */}
            {activeSubTab === 'menu' && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-black uppercase text-slate-500">Dish Manager</h2>
                  <button
                    onClick={() => {
                      setEditingFoodId(null);
                      setFoodForm({
                        name: '',
                        category: 'momo',
                        description: '',
                        price: 150,
                        discountPrice: 0,
                        isAvailable: true,
                        prepTime: 15,
                        isVeg: true,
                        spicyLevel: 'Medium'
                      });
                      setIsAddingFood(true);
                    }}
                    className="bg-[#2ECC71] hover:bg-green-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Food Item
                  </button>
                </div>

                {/* Adding Food Form Inline */}
                {isAddingFood && (
                  <form onSubmit={handleSaveFood} className={`p-3 rounded-2xl border flex flex-col gap-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#FAFAFA] border-slate-200'}`}>
                    <h3 className="text-xs font-extrabold text-orange-600">
                      {editingFoodId ? 'Modifying Dish' : 'Publish New Dish to Merchant Menu'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-slate-500">Dish Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Traditional Steamed Fish Momo"
                          value={foodForm.name}
                          onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                          className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-slate-500">Category Tag</label>
                        <select 
                          value={foodForm.category}
                          onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                          className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                        >
                          {FOOD_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] text-slate-500">Standard Price (NPR)</label>
                          <input 
                            type="number" 
                            required
                            min="10"
                            value={foodForm.price}
                            onChange={(e) => setFoodForm({ ...foodForm, price: Number(e.target.value) })}
                            className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] text-slate-500">Discount Price (NPR - Optional)</label>
                          <input 
                            type="number" 
                            value={foodForm.discountPrice}
                            onChange={(e) => setFoodForm({ ...foodForm, discountPrice: Number(e.target.value) })}
                            className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] text-slate-500">Preparation Time (Mins)</label>
                          <input 
                            type="number" 
                            min="1"
                            value={foodForm.prepTime}
                            onChange={(e) => setFoodForm({ ...foodForm, prepTime: Number(e.target.value) })}
                            className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] text-slate-500">Sp spicy Level</label>
                          <select 
                            value={foodForm.spicyLevel}
                            onChange={(e) => setFoodForm({ ...foodForm, spicyLevel: e.target.value as any })}
                            className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                          >
                            <option value="Mild">🌶️ Mild</option>
                            <option value="Medium">🌶️🌶️ Medium</option>
                            <option value="Spicy">🌶️🌶️🌶️ Spicy</option>
                            <option value="Mithila Fire">🔥 Mithila Fire</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500">Brief Description</label>
                        <textarea 
                          rows={2}
                          value={foodForm.description}
                          onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                          className={`p-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white'}`}
                        />
                      </div>

                      <div className="flex gap-4 items-center md:col-span-2 py-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={foodForm.isVeg}
                            onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.checked })}
                            className="accent-green-500"
                          />
                          <span className="text-[10px] font-bold">Veg food (Green Dot)</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={foodForm.isAvailable}
                            onChange={(e) => setFoodForm({ ...foodForm, isAvailable: e.target.checked })}
                            className="accent-green-500"
                          />
                          <span className="text-[10px] font-bold">Currently instock</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddingFood(false)}
                        className="bg-slate-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-500 text-white text-[10px] px-4 py-1.5 rounded-lg font-bold"
                      >
                        Save Dish
                      </button>
                    </div>
                  </form>
                )}

                {/* List foodItems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {restFoods.map((food) => (
                    <div 
                      key={food.id} 
                      className={`p-2.5 rounded-2xl border flex gap-3.5 items-center ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <img src={food.image} alt={food.name} className="w-14 h-14 rounded-xl object-cover" />
                      
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex gap-1 items-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <h4 className="text-[11px] font-black truncate">{food.name}</h4>
                        </div>
                        <p className="text-[9px] text-slate-500 line-clamp-1">{food.description}</p>
                        
                        <div className="flex gap-2 items-center text-[10px] font-black mt-1">
                          <span className="text-orange-600">NPR {food.discountPrice || food.price}</span>
                          <span className="text-[8px] bg-slate-800/5 px-1 rounded text-slate-400 font-normal">⏱️{food.prepTime}m</span>
                          <span className={`text-[8px] px-1 rounded font-bold ${food.isAvailable ? 'text-green-600 bg-green-500/10' : 'text-slate-450 bg-slate-500/10'}`}>
                            {food.isAvailable ? 'Active' : 'Offline'}
                          </span>
                        </div>
                      </div>

                      {/* Edit Buttons */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handleEditClick(food)}
                          className="p-1.5 hover:bg-orange-500/15 text-orange-500 roundedScale transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="p-1.5 hover:bg-red-500/15 text-red-500 roundedScale transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
