'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShoppingBag, User, MapPin, Phone, ArrowLeft, Plus, Minus, 
  Trash2, Star, Tag, ChevronRight, Sparkles, Clock, CheckCircle2, 
  MessageSquare, Heart, X, Send, Utensils, Info, Navigation, ShieldCheck
} from 'lucide-react';
import { MenuItem, Restaurant, Order, OrderItem, MAHOTTARI_MUNICIPALITIES, FOOD_CATEGORIES, PROMO_COUPONS } from '@/lib/mockData';

interface CustomerAppProps {
  restaurants: Restaurant[];
  foodItems: MenuItem[];
  activeOrders: Order[];
  setActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isDarkMode: boolean;
  onNavigateToRole: (role: string) => void;
}

export default function CustomerApp({
  restaurants,
  foodItems,
  activeOrders,
  setActiveOrders,
  isDarkMode,
  onNavigateToRole
}: CustomerAppProps) {
  // Navigation Screens: 'home' | 'restaurant_detail' | 'cart' | 'checkout' | 'payment_sim' | 'tracking' | 'assistant'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'restaurant_detail' | 'cart' | 'checkout' | 'payment_sim' | 'tracking' | 'assistant'>('home');
  
  // Selected State
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Aashish Chaudhary',
    phone: '9822334455',
    municipality: 'Bardibas',
    wardNumber: 4,
    address: 'Suhani Tole, near Post Office',
    registered: true
  });

  // Current Cart
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState<'eSewa' | 'Khalti' | 'Bank Transfer' | 'Cash on Delivery'>('eSewa');
  
  // Simulated tracking order
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0); // 0 to 4 matching positions
  
  // Gateway State
  const [gatewayStep, setGatewayStep] = useState<'login' | 'otp' | 'success'>('login');
  const [gatewayPhone, setGatewayPhone] = useState(userProfile.phone);
  const [gatewayPassword, setGatewayPassword] = useState('');
  const [gatewayOTP, setGatewayOTP] = useState('');
  
  // AI Assistant Chat History
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    { sender: 'assistant', text: 'Sitasaran! Pranam! I am Mithila Express Assistant. Ask me anything about local specialities in Mahottari, where to find sweet Pedas in Bardibas, or get recommendations for your meal!', time: 'Now' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Sync latest order for tracking if available
  useEffect(() => {
    const activeCustOrders = activeOrders.filter(o => o.customerId === 'cust_abc' && o.status !== 'Delivered' && o.status !== 'Cancelled');
    if (activeCustOrders.length > 0 && !trackingOrderId) {
      const timer = setTimeout(() => {
        setTrackingOrderId(activeCustOrders[activeCustOrders.length - 1].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrders, trackingOrderId]);

  // Periodic simulated driver movement if an order is active and we are on tracking screen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentScreen === 'tracking' && trackingOrderId) {
      interval = setInterval(() => {
        // Fetch active order status
        const order = activeOrders.find(o => o.id === trackingOrderId);
        if (order) {
          if (order.status === 'Order Received') {
            setSimulatedProgress(0.5);
          } else if (order.status === 'Preparing') {
            setSimulatedProgress(1.5);
          } else if (order.status === 'Picked Up') {
            setSimulatedProgress(2.5);
          } else if (order.status === 'On the Way') {
            setSimulatedProgress(3.5);
          } else if (order.status === 'Delivered') {
            setSimulatedProgress(4);
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, trackingOrderId, activeOrders]);

  // Favorites toggle
  const toggleFavorite = (restId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(restId)) {
      setFavorites(favorites.filter(id => id !== restId));
    } else {
      setFavorites([...favorites, restId]);
    }
  };

  // Cart operations
  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.foodItem.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.foodItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { foodItem: item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item: MenuItem) => {
    const existing = cart.find(c => c.foodItem.id === item.id);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter(c => c.foodItem.id !== item.id));
    } else {
      setCart(cart.map(c => c.foodItem.id === item.id ? { ...c, quantity: c.quantity - 1 } : c));
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, c) => total + c.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((total, c) => {
      const price = c.foodItem.discountPrice || c.foodItem.price;
      return total + (price * c.quantity);
    }, 0);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const coupon = PROMO_COUPONS.find(c => c.code === code);
    if (coupon) {
      const subtotal = getSubtotal();
      let discountAmount = 0;
      if (coupon.type === 'percent') {
        discountAmount = Math.round((subtotal * coupon.discount) / 100);
      } else {
        discountAmount = coupon.discount;
      }
      setAppliedCoupon({
        code: coupon.code,
        discount: discountAmount,
        type: coupon.type
      });
    } else {
      setCouponError('Invalid Coupon Code! Try MITHILA10 or SITASARAN.');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (checkoutPayment === 'Cash on Delivery' || checkoutPayment === 'Bank Transfer') {
      // Direct Place
      finalizeOrder('Paid_COD_Pending');
    } else {
      // eSewa or Khalti Gateway Simulation
      setGatewayStep('login');
      setGatewayPhone(userProfile.phone);
      setGatewayPassword('');
      setGatewayOTP('');
      setCurrentScreen('payment_sim');
    }
  };

  const finalizeOrder = (payStatus: string) => {
    const subtotal = getSubtotal();
    const delivery = selectedRestaurant?.deliveryCharge || 40;
    const tax = Math.round(subtotal * 0.05); // 5% dynamic local tax
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal + delivery + tax - discount;

    const newOrder: Order = {
      id: 'order_' + Math.floor(1000 + Math.random() * 9000),
      customerId: 'cust_abc',
      customerName: userProfile.name,
      customerPhone: userProfile.phone,
      restaurantId: selectedRestaurant?.id || 'rest_1',
      restaurantName: selectedRestaurant?.name || 'Bardibas Royal Sweets',
      items: [...cart],
      subtotal,
      deliveryCharge: delivery,
      tax,
      discount,
      total,
      municipality: userProfile.municipality,
      wardNumber: userProfile.wardNumber,
      deliveryAddress: userProfile.address,
      paymentMethod: checkoutPayment,
      paymentStatus: payStatus === 'Paid' ? 'Paid' : 'Pending',
      status: 'Order Received',
      orderDate: new Date().toISOString(),
      eta: (selectedRestaurant?.deliveryTime || 25) + 5,
      notes: orderNotes
    };

    setActiveOrders(prev => [newOrder, ...prev]);
    setTrackingOrderId(newOrder.id);
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
    setOrderNotes('');
    setCurrentScreen('tracking');
    setSimulatedProgress(0.5);
  };

  // Submit message to Gemini AI Assistant
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    
    // Add user message to state
    const displayMessages = [...chatMessages, { sender: 'user' as const, text: userText, time: 'Now' }];
    setChatMessages(displayMessages);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          chatHistory: chatMessages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'assistant', text: data.text, time: 'Now' }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "Sitasaran! I couldn't reach the servers, but I recommend tasting our classic Peda sweets or spicy Momos! What would you like to browse?", time: 'Now' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter restaurants/food
  const filteredRestaurants = restaurants.filter(r => {
    if (!r.isApproved) return false;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                            foodItems.some(f => f.category === selectedCategory && f.isAvailable);
    return matchesSearch && matchesCategory;
  });

  const getFoodsByCategory = (category: string) => {
    if (category === 'all') return foodItems;
    return foodItems.filter(f => f.category === category);
  };

  const getRestaurantMenu = (restId: string) => {
    // Return mock items associated or all
    if (restId === 'rest_1') return foodItems.filter(f => ['sweets', 'bakery', 'coffee', 'snacks'].includes(f.category));
    if (restId === 'rest_2') return foodItems.filter(f => ['biryani', 'drinks', 'chowmein'].includes(f.category));
    if (restId === 'rest_3') return foodItems.filter(f => ['momo', 'chowmein', 'local', 'burger'].includes(f.category));
    return foodItems;
  };

  // Calculate current ETA and stage
  const currOrder = activeOrders.find(o => o.id === trackingOrderId);

  return (
    <div className={`relative w-[370px] h-[755px] ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} rounded-[45px] border-[10px] ${isDarkMode ? 'border-slate-800' : 'border-slate-300'} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col mx-auto transition-colors duration-300`}>
      {/* Phone Notch/Speaker/Camera */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
        <div className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute right-6 top-1"></div>
      </div>

      {/* Screen Header Spacer (Notch avoidance) */}
      <div className="h-7 bg-slate-950 flex-shrink-0"></div>

      {/* Main Screen Body */}
      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
        <AnimatePresence mode="wait">
          {/* SCREEN: HOME */}
          {currentScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 flex flex-col gap-4 pb-20 overflow-x-hidden"
            >
              {/* Header Info */}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl text-white shadow-md">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>DELIVERING TO</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-bold leading-none">{userProfile.municipality}, Ward {userProfile.wardNumber}</span>
                    </div>
                  </div>
                </div>
                
                {/* Cart indicator button */}
                <button 
                  onClick={() => setCurrentScreen('cart')}
                  className="relative p-2.5 bg-orange-500/10 hover:bg-orange-500/20 rounded-full text-orange-600 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </div>

              {/* Greeting */}
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  Namaste/Pranam, <span className="text-orange-500">{userProfile.name}!</span>
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Hungry for local Mithila delights today?</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search restaurants, foods, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'} focus:outline-none transition-colors shadow-sm`}
                />
              </div>

              {/* Promo Banner Slider (Static Single) */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white shadow-lg flex flex-col justify-between h-28">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div>
                  <span className="bg-white/20 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full inline-block mb-1">PROMO FESTIVAL</span>
                  <p className="text-sm font-bold leading-tight">Bardibas Royal Sweets Festival!</p>
                  <p className="text-[10px] text-white/90">Get 10% off using <strong className="underline">MITHILA10</strong></p>
                </div>
                <button 
                  onClick={() => {
                    const r = restaurants.find(res => res.id === 'rest_1');
                    if (r) {
                      setSelectedRestaurant(r);
                      setCurrentScreen('restaurant_detail');
                    }
                  }}
                  className="bg-white text-orange-600 text-[10px] font-extrabold px-3 py-1 rounded-lg self-start mt-1 hover:bg-slate-100 transition-colors"
                >
                  Order sweets now
                </button>
              </div>

              {/* Categories Horizontal Scroller */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xs font-black uppercase tracking-wider">Explore Specialties</h2>
                  <span className="text-[10px] text-orange-500 font-bold hover:underline cursor-pointer">View All</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-3 px-3">
                  {FOOD_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px] border ${
                        selectedCategory === cat.id 
                          ? 'bg-orange-500 text-white border-orange-500 scale-105 shadow-md shadow-orange-500/20' 
                          : isDarkMode 
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' 
                            : 'bg-white border-slate-100 text-slate-700 hover:border-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-full ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-orange-500/10 text-orange-500'}`}>
                        {/* Render simple category visual labels or default icon */}
                        <span className="text-xs">🍲</span>
                      </div>
                      <span className="text-[9px] font-bold leading-tight truncate max-w-[56px]">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurant List (Pre-seeded & Active) */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider mb-2">Popular Shops of Mahottari</h2>
                <div className="flex flex-col gap-3">
                  {filteredRestaurants.map((rest) => (
                    <div
                      key={rest.id}
                      onClick={() => {
                        setSelectedRestaurant(rest);
                        setCurrentScreen('restaurant_detail');
                      }}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-sm ${
                        isDarkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Favorite Button */}
                      <button 
                        onClick={(e) => toggleFavorite(rest.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm z-10 text-white hover:scale-110 active:scale-95 transition-all"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.includes(rest.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>

                      {/* Header Cover Banner */}
                      <div className="relative h-20 w-full overflow-hidden bg-slate-200">
                        <img 
                          src={rest.coverImage} 
                          alt={rest.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          onError={(e) => {
                            e.currentTarget.src = "https://picsum.photos/seed/default_rest/600/300";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                          <img 
                            src={rest.logo} 
                            alt={`${rest.name} logo`} 
                            className="w-7 h-7 rounded-lg border border-white bg-white object-cover shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = "https://picsum.photos/seed/default_logo/150/150";
                            }}
                          />
                          <div>
                            <span className="text-[10px] text-white/95 font-bold drop-shadow-sm">{rest.municipality}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info Details */}
                      <div className="p-2.5">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="text-xs font-black truncate max-w-[200px]">{rest.name}</h3>
                          <div className="flex items-center gap-0.5 bg-yellow-500/10 text-yellow-600 px-1 py-0.5 rounded text-[9px] font-black">
                            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                            <span>{rest.rating}</span>
                          </div>
                        </div>
                        <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} line-clamp-1 mb-2`}>
                          {rest.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-800/10">
                          <div className="flex items-center gap-2 text-[9px] text-slate-500">
                            <div className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{rest.deliveryTime}m</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-orange-500" />
                              <span>Ward {rest.wardNumber}</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Delivery: NPR {rest.deliveryCharge}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Quick Order recommendation cards */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider mb-2">Recommended Dishes</h2>
                <div className="grid grid-cols-2 gap-2">
                  {getFoodsByCategory('all').slice(0, 4).map((food) => (
                    <div 
                      key={food.id} 
                      className={`rounded-xl overflow-hidden border p-2 flex flex-col gap-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                    >
                      <div className="relative h-20 bg-slate-100 rounded-lg overflow-hidden">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-1 left-1 text-[8px] font-bold px-1 rounded ${food.isVeg ? 'bg-green-500/15 text-green-500 border border-green-500/30' : 'bg-red-500/15 text-red-500 border border-red-500/30'}`}>
                          {food.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-extrabold truncate">{food.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          {food.discountPrice ? (
                            <>
                              <span className="text-[10px] text-orange-600 font-extrabold">NPR {food.discountPrice}</span>
                              <span className="text-[8px] text-slate-400 line-through">NPR {food.price}</span>
                            </>
                          ) : (
                            <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">NPR {food.price}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(food)}
                        className="w-full bg-orange-500 text-white text-[9px] font-bold py-1 rounded hover:bg-orange-600 active:scale-95 transition-all text-center"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN: RESTAURANT DETAIL */}
          {currentScreen === 'restaurant_detail' && selectedRestaurant && (
            <motion.div
              key="restaurant_detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col pb-20"
            >
              <div className="relative h-28 bg-slate-200 overflow-hidden">
                <img src={selectedRestaurant.coverImage} alt="Cover" className="w-[100%] h-[100%] object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
                
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="absolute bottom-2 left-3 text-white flex items-center gap-2">
                  <img src={selectedRestaurant.logo} alt="Logo" className="w-9 h-9 rounded-lg border-2 border-white object-cover" />
                  <div>
                    <h2 className="text-xs font-extrabold leading-tight">{selectedRestaurant.name}</h2>
                    <p className="text-[8px] opacity-80">{selectedRestaurant.address}, {selectedRestaurant.municipality}</p>
                  </div>
                </div>
              </div>

              {/* Rest Details */}
              <div className="p-3 flex flex-col gap-3">
                <div className="flex gap-4 items-center justify-between py-1 border-b border-slate-800/10 text-[9px] text-slate-500">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{selectedRestaurant.rating} (12 reviews)</span>
                  </div>
                  <div>•</div>
                  <div>Delivery {selectedRestaurant.deliveryTime} mins</div>
                  <div>•</div>
                  <span className="text-[#FF6B00] font-bold">Charge: NPR {selectedRestaurant.deliveryCharge}</span>
                </div>

                <div className={`p-2 rounded-xl text-[9px] leading-relaxed ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-orange-50/50'}`}>
                  <strong>Shop Info:</strong> {selectedRestaurant.description}
                  <div className="flex gap-2 items-center justify-between text-[8px] text-slate-500 mt-1">
                    <span>Opening Hours: {selectedRestaurant.openingTime} - {selectedRestaurant.closingTime}</span>
                    <a href={`tel:${selectedRestaurant.mobileNumber}`} className="text-orange-500 font-bold hover:underline flex items-center gap-0.5">
                      <Phone className="w-2.5 h-2.5" /> Call Shop
                    </a>
                  </div>
                </div>

                {/* Listing Food Menu */}
                <div>
                  <h3 className="text-xs font-black uppercase mb-2">Our Menu</h3>
                  <div className="flex flex-col gap-2.5">
                    {getRestaurantMenu(selectedRestaurant.id).map((food) => {
                      const count = cart.find(c => c.foodItem.id === food.id)?.quantity || 0;
                      return (
                        <div 
                          key={food.id} 
                          className={`flex gap-2 p-2 rounded-xl border items-center ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'}`}
                        >
                          <img src={food.image} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-1 items-center">
                              <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              <h4 className="text-[10px] font-bold truncate">{food.name}</h4>
                            </div>
                            <p className="text-[8px] text-slate-500 line-clamp-1">{food.description}</p>
                            
                            <div className="flex items-center gap-1.5 mt-1">
                              {food.discountPrice ? (
                                <>
                                  <span className="text-[10px] text-orange-600 font-bold">NPR {food.discountPrice}</span>
                                  <span className="text-[8px] text-slate-400 line-through">NPR {food.price}</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-700 dark:text-slate-300 font-extrabold">NPR {food.price}</span>
                              )}
                              <span className="text-[8px] text-slate-400 px-1 bg-slate-800/5 dark:bg-white/5 rounded">🌶️{food.spicyLevel}</span>
                            </div>
                          </div>

                          {/* Incrementor or add */}
                          <div>
                            {count > 0 ? (
                              <div className="flex items-center gap-1.5 bg-orange-500 rounded-lg text-white p-1">
                                <button onClick={() => removeFromCart(food)} className="hover:scale-110">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-[9px] font-bold min-w-[8px] text-center">{count}</span>
                                <button onClick={() => addToCart(food)} className="hover:scale-110">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(food)}
                                className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg hover:bg-orange-600 active:scale-95 transition-all"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN: CART */}
          {currentScreen === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="p-3 flex flex-col gap-4 pb-20"
            >
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentScreen('home')} className="p-1.5 rounded-full hover:bg-slate-800/10 dark:hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black uppercase">My Basket</h2>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xs font-bold mt-2">Basket Is Empty!</h3>
                  <p className="text-[10px] text-slate-500 px-8">Navigate to shops and add some piping hot meals to your plate.</p>
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="mt-3 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    Go Back Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 pb-2 border-b border-slate-800/10">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold">ITEMS FROM: {selectedRestaurant?.name}</p>
                    
                    {cart.map((c) => (
                      <div key={c.foodItem.id} className="flex justify-between items-center py-2 border-b border-dashed border-slate-800/5">
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="text-[10px] font-bold truncate leading-tight">{c.foodItem.name}</h4>
                          <span className="text-[9px] text-orange-600 font-extrabold">
                            NPR {c.foodItem.discountPrice || c.foodItem.price} each
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-slate-800/5 dark:bg-white/5 rounded-lg p-1 border">
                            <button onClick={() => removeFromCart(c.foodItem)} className="text-slate-500 hover:text-red-500">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[9px] font-bold px-1.5">{c.quantity}</span>
                            <button onClick={() => addToCart(c.foodItem)} className="text-slate-500 hover:text-orange-500">
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          
                          <span className="text-[10px] font-bold min-w-[54px] text-right">
                            NPR {(c.foodItem.discountPrice || c.foodItem.price) * c.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Coupons section */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-500">Voucher / Coupon Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER COUPON (e.g., MITHILA10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={`text-xs p-2 rounded-xl flex-1 border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'} uppercase`}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="bg-slate-800 text-white dark:bg-orange-600 text-[10px] uppercase font-bold px-3 rounded-xl hover:opacity-90 active:scale-95 transition-all animate-bounce"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[9px] text-red-500 font-bold">{couponError}</p>}
                    {appliedCoupon && (
                      <p className="text-[9px] text-green-500 font-bold flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" /> Applied Code: {appliedCoupon.code} (Saved NPR {appliedCoupon.discount}!)
                      </p>
                    )}
                  </div>

                  {/* Pricing Summary */}
                  <div className={`p-3 rounded-2xl flex flex-col gap-2 ${isDarkMode ? 'bg-slate-900' : 'bg-orange-50/30'} border border-dashed border-orange-500/10 text-xs`}>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[10px]">Basket Subtotal</span>
                      <span>NPR {getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Delivery (Mahottari Local Fee)</span>
                      <span>NPR {selectedRestaurant?.deliveryCharge || 40}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Local District VAT / Service Tax (5%)</span>
                      <span>NPR {Math.round(getSubtotal() * 0.05)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 font-bold text-[10px]">
                        <span>Promo Code Discount ({appliedCoupon.code})</span>
                        <span>- NPR {appliedCoupon.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm border-t border-dashed border-slate-800/10 pt-2 text-[#FF6B00]">
                      <span>Grand Total</span>
                      <span>NPR {getSubtotal() + (selectedRestaurant?.deliveryCharge || 40) + Math.round(getSubtotal() * 0.05) - (appliedCoupon ? appliedCoupon.discount : 0)}</span>
                    </div>
                  </div>

                  {/* Proceed button */}
                  <button
                    onClick={() => setCurrentScreen('checkout')}
                    className="w-full bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black py-3 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    Proceed to Secure Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* SCREEN: CHECKOUT */}
          {currentScreen === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-3 flex flex-col gap-4 pb-20"
            >
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentScreen('cart')} className="p-1.5 rounded-full hover:bg-slate-800/10">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-black uppercase">Secure Checkout</h2>
              </div>

              {/* Delivery Address Details */}
              <div className="flex flex-col gap-2 pb-1 border-b border-slate-800/10">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Mahottari Delivery Coordinates</h3>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className={`text-xs p-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-500">Municipality</label>
                    <select 
                      value={userProfile.municipality}
                      onChange={(e) => setUserProfile({ ...userProfile, municipality: e.target.value })}
                      className={`text-xs p-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                    >
                      {MAHOTTARI_MUNICIPALITIES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-500">Ward Number (1-15)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="15"
                      value={userProfile.wardNumber}
                      onChange={(e) => setUserProfile({ ...userProfile, wardNumber: Number(e.target.value) })}
                      className={`text-xs p-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-500">Exact Local Address (Tole, House to send partner)</label>
                  <input 
                    type="text" 
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    className={`text-xs p-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-500">Delivery Notes (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="E.g., house behind temple, call before knock"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className={`text-xs p-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Select Payment Method</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer hover:border-orange-500 transition-all ${checkoutPayment === 'eSewa' ? 'bg-green-500/5 border-green-500/40 text-green-700 dark:text-green-400' : 'border-slate-800/10'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#60BB46] flex items-center justify-center text-white text-[9px] font-black">e</span>
                      <span className="text-xs font-bold">eSewa Wallet Payment</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={checkoutPayment === 'eSewa'}
                      onChange={() => setCheckoutPayment('eSewa')}
                      className="accent-green-500"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer hover:border-orange-500 transition-all ${checkoutPayment === 'Khalti' ? 'bg-purple-500/5 border-purple-500/40 text-purple-700 dark:text-purple-400' : 'border-slate-800/10'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#5C2D91] flex items-center justify-center text-white text-[9px] font-black">K</span>
                      <span className="text-xs font-bold">Khalti Digital Wallet</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={checkoutPayment === 'Khalti'}
                      onChange={() => setCheckoutPayment('Khalti')}
                      className="accent-purple-500"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer hover:border-orange-500 transition-all ${checkoutPayment === 'Cash on Delivery' ? 'bg-orange-500/5 border-orange-500/40 text-orange-700 dark:text-orange-400' : 'border-slate-800/10'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">💵</span>
                      <span className="text-xs font-bold">Cash on Delivery (COD)</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={checkoutPayment === 'Cash on Delivery'}
                      onChange={() => setCheckoutPayment('Cash on Delivery')}
                      className="accent-orange-500"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Checkout Order */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-2 bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black py-3 rounded-2xl shadow-lg active:scale-95 transition-all text-center flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" /> Confirm & Place Order Now
              </button>
            </motion.div>
          )}

          {/* SCREEN: PAYMENT GATEWAY SIMULATION */}
          {currentScreen === 'payment_sim' && (
            <motion.div
              key="payment_sim"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 flex flex-col h-full bg-[#FAFAFA] text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-black ${checkoutPayment === 'eSewa' ? 'bg-[#60BB46]' : 'bg-[#5C2D91]'}`}>
                    {checkoutPayment === 'eSewa' ? 'e' : 'K'}
                  </div>
                  <h2 className="text-[11px] font-black uppercase text-slate-700">
                    {checkoutPayment === 'eSewa' ? 'eSewa Secure Checkout' : 'Khalti Payment Gateway'}
                  </h2>
                </div>
                <button 
                  onClick={() => setCurrentScreen('checkout')}
                  className="p-1 rounded hover:bg-slate-200 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl my-3 border border-slate-200 text-[10px] text-slate-600">
                <div className="flex justify-between font-bold mb-1">
                  <span>Merchant:</span>
                  <span>Mithila Express, Mahottari</span>
                </div>
                <div className="flex justify-between text-slate-800 font-extrabold text-[11px]">
                  <span>Total Amount:</span>
                  <span className="text-[#FF6B00]">NPR {getSubtotal() + (selectedRestaurant?.deliveryCharge || 40) + Math.round(getSubtotal() * 0.05) - (appliedCoupon ? appliedCoupon.discount : 0)}</span>
                </div>
              </div>

              {gatewayStep === 'login' && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sign in to your wallet</h3>
                  
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] text-slate-400">Mobile Wallet ID / Phone</label>
                    <input 
                      type="text" 
                      value={gatewayPhone}
                      onChange={(e) => setGatewayPhone(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. 9844xxxxxx"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] text-slate-400">Secret Pin / Password</label>
                    <input 
                      type="password" 
                      value={gatewayPassword}
                      onChange={(e) => setGatewayPassword(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    onClick={() => setGatewayStep('otp')}
                    disabled={!gatewayPhone || !gatewayPassword}
                    className={`w-full py-2 rounded-lg text-white font-bold text-xs text-center transition-colors ${
                      checkoutPayment === 'eSewa' ? 'bg-[#60BB46] hover:bg-green-600' : 'bg-[#5C2D91] hover:bg-purple-800'
                    }`}
                  >
                    Proceed with Secure Login
                  </button>
                </div>
              )}

              {gatewayStep === 'otp' && (
                <div className="flex flex-col gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[9px] text-amber-800">
                    🔒 Simulating a transactional OTP sent via SMS to <strong>{gatewayPhone}</strong>. In real deployment, this interfaces directly with eSewa/Khalti SDKs!
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] text-slate-400">Enter Verified OTP Code</label>
                    <input 
                      type="text" 
                      value={gatewayOTP}
                      onChange={(e) => setGatewayOTP(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-200 bg-white tracking-widest text-center font-bold"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={() => setGatewayStep('success')}
                    className={`w-full py-2 rounded-lg text-white font-bold text-xs text-center ${
                      checkoutPayment === 'eSewa' ? 'bg-[#60BB46]' : 'bg-[#5C2D91]'
                    }`}
                  >
                    Confirm & Complete Payment
                  </button>
                </div>
              )}

              {gatewayStep === 'success' && (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-pulse">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-green-700">Digital Payment Confirmed!</h3>
                    <p className="text-[9px] text-slate-500">Transaction ID: TXN_MX482109</p>
                  </div>
                  <button
                    onClick={() => finalizeOrder('Paid')}
                    className="mt-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-6 py-2 rounded-xl"
                  >
                    Return to Mithila Express App
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: LIVE ORDER TRACKING */}
          {currentScreen === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 flex flex-col gap-3 pb-20 overflow-x-hidden"
            >
              <div className="flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 rounded hover:bg-slate-800/10 dark:hover:bg-white/10">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <h2 className="text-xs font-black uppercase">Live Order Tracker</h2>
                </div>
                {currOrder && (
                  <span className="text-[8px] bg-indigo-500/15 text-indigo-500 px-1.5 py-0.5 rounded font-black">
                    ID: {currOrder.id}
                  </span>
                )}
              </div>

              {!currOrder ? (
                <div className="flex flex-col items-center gap-2 py-20 text-center">
                  <p className="text-[10px] text-slate-500">You do not have any active orders right now.</p>
                  <button onClick={() => setCurrentScreen('home')} className="bg-orange-500 text-white text-[10px] px-4 py-1.5 rounded-lg">
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Status Card */}
                  <div className={`p-3 rounded-2xl relative overflow-hidden flex flex-col gap-1 shadow-sm border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-indigo-500 font-extrabold uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded tracking-wide">
                          {currOrder.status}
                        </span>
                        <h3 className="text-xs font-extrabold mt-1 text-slate-800 dark:text-slate-100">
                          {currOrder.status === 'Order Received' && 'Awaiting Shop Confirmation...'}
                          {currOrder.status === 'Preparing' && 'Chef preparing fresh momo/local foods...'}
                          {currOrder.status === 'Picked Up' && 'Driver picked up your kitchen basket!'}
                          {currOrder.status === 'On the Way' && 'Scooter speeding through Mahottari road...'}
                          {currOrder.status === 'Delivered' && 'Order safely arrived. Sitasaran!'}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-400">ESTIMATED ARRIVAL</p>
                        <p className="text-[13px] font-black text-orange-500 animate-pulse">{currOrder.status === 'Delivered' ? '0 mins' : `${currOrder.eta} mins`}</p>
                      </div>
                    </div>
                  </div>

                  {/* STEPPER TRACKING */}
                  <div className="py-2 flex items-center justify-between px-2 relative">
                    {/* Background track */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
                    <div 
                      className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-orange-500 to-amber-500 -translate-y-1/2 z-0 transition-all duration-1000"
                      style={{ width: `${(simulatedProgress / 4) * 100}%` }}
                    ></div>

                    {/* Nodes */}
                    {[
                      { l: 'Sent', p: 0.5 },
                      { l: 'Kitchen', p: 1.5 },
                      { l: 'Scooter', p: 2.5 },
                      { l: 'Road', p: 3.5 },
                      { l: 'Home', p: 4 }
                    ].map((step, idx) => {
                      const isActive = simulatedProgress >= step.p;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 z-10">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                            isActive 
                              ? 'bg-orange-500 text-white border-orange-500 scale-110 shadow' 
                              : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[8px] font-bold ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>{step.l}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* DYNAMIC ILLUSTRATIVE MAP */}
                  <div className={`h-40 rounded-2xl border relative overflow-hidden bg-slate-100 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    {/* SVG Map graphics modeling Mahottari road network */}
                    <svg className="w-full h-full" viewBox="0 0 300 160">
                      <rect width="300" height="160" fill={isDarkMode ? "#0F172A" : "#F1F5F9"} />
                      
                      {/* Grid lines */}
                      <path d="M 0,40 L 300,40 M 0,80 L 300,80 M 0,120 L 300,120 M 40,0 L 40,160 M 120,0 L 120,160 M 200,0 L 200,160 M 280,0 L 280,160" stroke={isDarkMode ? "#1E293B" : "#E2E8F0"} strokeWidth="1" />
                      
                      {/* Roads */}
                      <path d="M 20,40 C 80,40 100,20 120,60 C 140,100 210,60 210,120 C 210,140 270,140 280,140" fill="none" stroke={isDarkMode ? "#334155" : "#CBD5E1"} strokeWidth="6" strokeLinecap="round" />
                      <path d="M 20,40 C 80,40 100,20 120,60 C 140,100 210,60 210,120 C 210,140 270,140 280,140" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />

                      {/* Major landmarks of Mahottari */}
                      <text x="30" y="25" fill="#888" fontSize="6" fontWeight="bold">JALESHWAR</text>
                      <text x="140" y="45" fill="#888" fontSize="6" fontWeight="bold">GAUSHALA</text>
                      <text x="240" y="115" fill="#888" fontSize="6" fontWeight="bold">BARDIBAS</text>

                      {/* Map Pins */}
                      {/* Restaurant Point */}
                      <circle cx="50" cy="40" r="5" fill="#FF6B00" />
                      <text x="45" y="52" fill={isDarkMode ? "#FFF" : "#000"} fontSize="6" fontWeight="bold">SHOP</text>

                      {/* Customer Point */}
                      <circle cx="210" cy="120" r="5" fill="#10B981" />
                      <text x="200" y="132" fill={isDarkMode ? "#FFF" : "#000"} fontSize="6" fontWeight="bold">HOME</text>

                      {/* Delivery Scooter (Smooth Interpolating point on path) */}
                      {currOrder.status !== 'Delivered' && currOrder.status !== 'Order Received' && (
                        <g>
                          {/* Moving coordinates */}
                          {currOrder.status === 'Preparing' && (
                            <circle cx="65" cy="40" r="4" fill="#3B82F6" className="animate-ping" />
                          )}
                          {currOrder.status === 'Picked Up' && (
                            <circle cx="100" cy="35" r="4.5" fill="#FF8D00" />
                          )}
                          {currOrder.status === 'On the Way' && (
                            <circle cx="170" cy="80" r="4.5" fill="#FF8D00" className="animate-bounce" />
                          )}
                        </g>
                      )}
                    </svg>

                    <div className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[8px] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 text-orange-400 rotate-45" /> Map Location: Jaleshwar-Bardibas Highway
                    </div>
                  </div>

                  {/* Delivery Partner Profile */}
                  <div className={`p-2.5 rounded-2xl flex items-center justify-between border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                        {currOrder.deliveryPartnerName ? currOrder.deliveryPartnerName[0] : 'MX'}
                      </div>
                      <div>
                        <p className="text-[10px] font-black">{currOrder.deliveryPartnerName || 'Assigning Delivery Hero...'}</p>
                        <p className={`text-[8px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {currOrder.deliveryPartnerName ? 'Mithila Courier Partner' : 'Admin coordinates with nearby drivers'}
                        </p>
                      </div>
                    </div>

                    {currOrder.deliveryPartnerName && (
                      <a href="tel:98100000" className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 rounded-full p-2">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Receipt items list */}
                  <div className={`p-2.5 rounded-2xl flex flex-col gap-1 bg-slate-900/10 text-[9px]`}>
                    <p className="font-bold border-b pb-1">Order Details</p>
                    {currOrder.items.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{it.foodItem.name} (x{it.quantity})</span>
                        <span>NPR {it.quantity * (it.foodItem.discountPrice || it.foodItem.price)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-1 border-t text-[#FF6B00]">
                      <span>Grand Total:</span>
                      <span>NPR {currOrder.total}</span>
                    </div>
                    {currOrder.notes && (
                      <p className="text-[8px] text-slate-500 italic mt-1">Note: {currOrder.notes}</p>
                    )}
                  </div>

                  {/* Simulator action helper */}
                  <div className="p-2 bg-orange-500/10 rounded-xl border border-dashed border-orange-500/20 text-[9px] text-[#FF6B00]">
                    💡 <strong>Simulator Tip:</strong> Toggle the role above to <strong>Restaurant Dashboard</strong> or <strong>Delivery App</strong> to change this order status and see the live map update!
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: MITHILA AI ASSISTANT */}
          {currentScreen === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Support Chat Header */}
              <div className="flex items-center gap-1.5 p-3 border-b border-orange-500/15">
                <button onClick={() => setCurrentScreen('home')} className="p-1 rounded hover:bg-slate-800/10 text-orange-500">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <h3 className="text-xs font-black">Mithila Support AI</h3>
                  <span className="text-[8px] text-slate-500 leading-none">Powered by Gemini 3.5</span>
                </div>
              </div>

              {/* Chat Bubble Scroll */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar h-[350px]">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-2.5 text-[10px] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-orange-500 text-white rounded-br-none' 
                        : isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none' 
                          : 'bg-orange-50/50 text-slate-800 border border-orange-500/10 rounded-bl-none'
                    }`}>
                      {msg.text}
                      <p className="text-[7px] text-right opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 bg-slate-800/5 dark:bg-white/5 rounded-full px-3 py-1.5 text-[9px] text-slate-400">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      <span>Mithila AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Send Input */}
              <div className="p-2 border-t border-orange-500/10 flex gap-2 items-center bg-slate-900/10">
                <input 
                  type="text" 
                  placeholder="Ask for Peda sweet shops, area info..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className={`text-xs p-2 rounded-xl flex-1 border focus:outline-none focus:border-orange-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isAiLoading}
                  className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Customer Mobile Footer Nav Bar (Fixed UI) */}
      <div className={`absolute bottom-0 left-0 right-0 h-14 ${isDarkMode ? 'bg-slate-950 border-t border-slate-900' : 'bg-white border-t border-slate-200'} flex items-center justify-around px-3 z-30`}>
        <button 
          onClick={() => { setCurrentScreen('home'); setSelectedCategory('all'); }} 
          className={`flex flex-col items-center gap-0.5 ${currentScreen === 'home' ? 'text-orange-500' : 'text-slate-400 hover:text-orange-500'}`}
        >
          <Utensils className="w-4.5 h-4.5" />
          <span className="text-[8px] font-bold">Menu</span>
        </button>

        <button 
          onClick={() => setCurrentScreen('assistant')}
          className={`flex flex-col items-center gap-0.5 ${currentScreen === 'assistant' ? 'text-orange-500' : 'text-slate-400 hover:text-orange-500'}`}
        >
          <motion.div animate={{ scale: currentScreen === 'assistant' ? 1.1 : 1 }}>
            <Sparkles className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
          </motion.div>
          <span className="text-[8px] font-bold">Mithila AI</span>
        </button>

        <button 
          onClick={() => setCurrentScreen('cart')}
          className={`relative flex flex-col items-center gap-0.5 ${currentScreen === 'cart' ? 'text-orange-500' : 'text-slate-400 hover:text-orange-500'}`}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          {getCartCount() > 0 && (
            <span className="absolute top-[-3px] right-[4px] w-3.5 h-3.5 bg-orange-600 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
              {getCartCount()}
            </span>
          )}
          <span className="text-[8px] font-bold">Cart</span>
        </button>

        <button 
          onClick={() => setCurrentScreen('tracking')}
          className={`flex flex-col items-center gap-0.5 ${currentScreen === 'tracking' ? 'text-orange-500' : 'text-slate-400 hover:text-orange-500'}`}
        >
          <div className="relative">
            <Clock className="w-4.5 h-4.5" />
            {activeOrders.filter(o => o.customerId === 'cust_abc' && o.status !== 'Delivered').length > 0 && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-ping"></span>
            )}
          </div>
          <span className="text-[8px] font-bold">Track</span>
        </button>
      </div>

      {/* Screen edge Home Indicator pill */}
      <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-400/50 rounded-full z-40"></div>
    </div>
  );
}
