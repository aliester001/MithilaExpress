// Mock Data and Interfaces for Mithila Express (Mahottari, Nepal)

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  isAvailable: boolean;
  prepTime: number; // in mins
  isVeg: boolean;
  spicyLevel: 'Mild' | 'Medium' | 'Spicy' | 'Mithila Fire';
}

export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  mobileNumber: string;
  email: string;
  address: string;
  municipality: string;
  wardNumber: number;
  description: string;
  openingTime: string;
  closingTime: string;
  logo: string;
  coverImage: string;
  rating: number;
  deliveryTime: number; // in mins
  deliveryCharge: number; // in NPR
  isApproved: boolean;
  reviews: { id: string; user: string; rating: number; text: string; date: string }[];
}

export interface OrderItem {
  foodItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'Order Received' | 'Preparing' | 'Picked Up' | 'On the Way' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  total: number;
  municipality: string;
  wardNumber: number;
  deliveryAddress: string;
  paymentMethod: 'eSewa' | 'Khalti' | 'Bank Transfer' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  status: OrderStatus;
  orderDate: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  eta: number; // remaining minutes
  notes?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleNo: string;
  isAvailable: boolean;
  ratings: number;
  todayEarnings: number;
}

// 14 Municipalities of Mahottari District, Nepal
export const MAHOTTARI_MUNICIPALITIES = [
  "Bardibas",
  "Gaushala",
  "Jaleshwar",
  "Aurahi",
  "Balwa",
  "Bhangaha",
  "Ekdara",
  "Loharpatti",
  "Manara Shiswa",
  "Matihani",
  "Pipra",
  "Ramgopalpur",
  "Samsi",
  "Sonama"
];

// Seed Categories
export const FOOD_CATEGORIES = [
  { id: 'all', name: 'All Dishes', icon: 'Utensils' },
  { id: 'momo', name: 'Momo', icon: 'Soup' },
  { id: 'burger', name: 'Burger', icon: 'Egg' },
  { id: 'pizza', name: 'Pizza', icon: 'Pizza' },
  { id: 'chowmein', name: 'Chowmein', icon: 'FlameKindling' },
  { id: 'biryani', name: 'Biryani', icon: 'Container' },
  { id: 'local', name: 'Local Foods', icon: 'Heart' },
  { id: 'sweets', name: 'Sweets', icon: 'Cookie' },
  { id: 'snacks', name: 'Snacks', icon: 'Layers' },
  { id: 'drinks', name: 'Drinks', icon: 'CupSoda' },
  { id: 'bakery', name: 'Bakery', icon: 'Croissant' },
  { id: 'coffee', name: 'Tea & Coffee', icon: 'Coffee' }
];

// Initial Food Items Pool
export const INITIAL_FOOD_ITEMS: MenuItem[] = [
  {
    id: 'food_1',
    name: 'Steamed Buff Momo',
    category: 'momo',
    description: 'Juicy steamed dumplings stuffed with spiced minced buff meat, served with spicy tomato chutney.',
    price: 150,
    discountPrice: 130,
    image: 'https://picsum.photos/seed/momo/400/300',
    isAvailable: true,
    prepTime: 15,
    isVeg: false,
    spicyLevel: 'Spicy'
  },
  {
    id: 'food_2',
    name: 'Mithila Special Veg Thali',
    category: 'local',
    description: 'Traditional Thali featuring Basmati rice, local dal, Taruwa, seasonal green vegetables, Ghugni salad, and fresh sweet curd.',
    price: 320,
    image: 'https://picsum.photos/seed/thali/400/300',
    isAvailable: true,
    prepTime: 25,
    isVeg: true,
    spicyLevel: 'Medium'
  },
  {
    id: 'food_3',
    name: 'Suhani Peda (Bardibas Classic)',
    category: 'sweets',
    description: 'The famous sweet condensed milk fudge, slow-cooked in local dairy ghee, from Bardibas, Mahottari.',
    price: 180,
    discountPrice: 160,
    image: 'https://picsum.photos/seed/peda/400/300',
    isAvailable: true,
    prepTime: 5,
    isVeg: true,
    spicyLevel: 'Mild'
  },
  {
    id: 'food_4',
    name: 'Mithila Fire Spicy Chicken Burger',
    category: 'burger',
    description: 'Crispy deep-fried poultry patty layered with secret Bhut Jolokia spicy sauce, cheese, and crunchy lettuce.',
    price: 240,
    image: 'https://picsum.photos/seed/burger/400/300',
    isAvailable: true,
    prepTime: 12,
    isVeg: false,
    spicyLevel: 'Mithila Fire'
  },
  {
    id: 'food_5',
    name: 'Jaleshwar Hyderabadi Biryani',
    category: 'biryani',
    description: 'Rich aromatic rice spiced with local cardamom and saffron, layered with slow-cooked marinated chicken.',
    price: 380,
    discountPrice: 340,
    image: 'https://picsum.photos/seed/biryani/400/300',
    isAvailable: true,
    prepTime: 20,
    isVeg: false,
    spicyLevel: 'Spicy'
  },
  {
    id: 'food_6',
    name: 'Mithila Special Mango Lassi',
    category: 'drinks',
    description: 'Creamy yogurt beverage infused with fresh pulp of handpicked sweet local Malda mangoes directly from Gaushala orchards.',
    price: 120,
    image: 'https://picsum.photos/seed/lassi/400/300',
    isAvailable: true,
    prepTime: 8,
    isVeg: true,
    spicyLevel: 'Mild'
  },
  {
    id: 'food_7',
    name: 'Chicken Chowmein (Gaushala Style)',
    category: 'chowmein',
    description: 'Stir-fried wheat noodles tossed with spicy chicken shreds, green cabbage, bell peppers, soy sauce and local herbs.',
    price: 180,
    image: 'https://picsum.photos/seed/chowmein/400/300',
    isAvailable: true,
    prepTime: 10,
    isVeg: false,
    spicyLevel: 'Medium'
  },
  {
    id: 'food_8',
    name: 'Paneer Butter Masala Pizza',
    category: 'pizza',
    description: 'Thin-crust dough baked with spiced butter paneer gravy, loads of mozzarella cheese, capsicum, and fresh coriander.',
    price: 420,
    discountPrice: 390,
    image: 'https://picsum.photos/seed/pizza/400/300',
    isAvailable: true,
    prepTime: 18,
    isVeg: true,
    spicyLevel: 'Medium'
  },
  {
    id: 'food_9',
    name: 'Crispy Aaloo Taruwa & Chiura',
    category: 'local',
    description: 'Traditional thin-sliced crispy potato fritters battered in spiced chickpea flour, served with crunchy beaten rice (Chiura).',
    price: 110,
    image: 'https://picsum.photos/seed/taruwa/400/300',
    isAvailable: true,
    prepTime: 10,
    isVeg: true,
    spicyLevel: 'Medium'
  },
  {
    id: 'food_10',
    name: 'Hot Milk Chai with Rabri',
    category: 'coffee',
    description: 'Spiced hot Nepalese organic orthodox tea brewed directly in rich milk, topped with a luscious dollop of sweet rabri.',
    price: 60,
    image: 'https://picsum.photos/seed/tea/400/300',
    isAvailable: true,
    prepTime: 6,
    isVeg: true,
    spicyLevel: 'Mild'
  }
];

// Initial Restaurants
export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest_1',
    name: 'Bardibas Royal Sweets & Bakers',
    ownerName: 'Ramesh Peda-Wala',
    mobileNumber: '9844012345',
    email: 'info@bardibasroyal.com',
    address: 'Suhani Tole, Ward 3',
    municipality: 'Bardibas',
    wardNumber: 3,
    description: 'Home of the absolute authentic Mahottari Peda! We offer pristine sweets, fresh bakery foods, snacks, and local favorites.',
    openingTime: '07:00 AM',
    closingTime: '09:00 PM',
    logo: 'https://picsum.photos/seed/logo1/150/150',
    coverImage: 'https://picsum.photos/seed/cover1/800/400',
    rating: 4.8,
    deliveryTime: 25,
    deliveryCharge: 40,
    isApproved: true,
    reviews: [
      { id: 'rev_1', user: 'Anjali Sharma', rating: 5, text: 'The Pedas are absolutely celestial. Mithila traditional taste at its best!', date: '2026-06-18' },
      { id: 'rev_2', user: 'Rajesh Mandal', rating: 4.5, text: 'Excellent sweets, quick delivery around Bardibas chowk.', date: '2026-06-19' }
    ]
  },
  {
    id: 'rest_2',
    name: 'Janakpur & Jaleshwar Biryani Point',
    ownerName: 'Mohammad Farooq',
    mobileNumber: '9808054321',
    email: 'jaleshwar.biryani@gmail.com',
    address: 'Hospital Road, Ward 4',
    municipality: 'Jaleshwar',
    wardNumber: 4,
    description: 'Serving hot, authentic Dum Biryani, spicy Moghlai chicken, and cold mango beverages. The oldest Biryani destination in Jaleshwar.',
    openingTime: '11:00 AM',
    closingTime: '10:00 PM',
    logo: 'https://picsum.photos/seed/logo2/150/150',
    coverImage: 'https://picsum.photos/seed/cover2/800/400',
    rating: 4.6,
    deliveryTime: 35,
    deliveryCharge: 60,
    isApproved: true,
    reviews: [
      { id: 'rev_3', user: 'Krishna Sah', rating: 5, text: 'Very delicious spicy chicken biryani! Loved the basmati fragrance.', date: '2026-06-15' }
    ]
  },
  {
    id: 'rest_3',
    name: 'Gaushala Momo Express & Local Kitchen',
    ownerName: 'Manish Chaudhary',
    mobileNumber: '9812345678',
    email: 'gaushala.momo@outlook.com',
    address: 'Bazaar Chowk, Ward 7',
    municipality: 'Gaushala',
    wardNumber: 7,
    description: 'We serve high-speed tasty steamed and fried momos, spicy flame chowmein, and traditional Mithila Taruwa and Chiura. All ingredients sourced from Gaushala farms.',
    openingTime: '10:00 AM',
    closingTime: '08:30 PM',
    logo: 'https://picsum.photos/seed/logo3/150/150',
    coverImage: 'https://picsum.photos/seed/cover3/800/400',
    rating: 4.4,
    deliveryTime: 20,
    deliveryCharge: 30,
    isApproved: true,
    reviews: [
      { id: 'rev_4', user: 'Rina Mahato', rating: 4, text: 'Extremely fast delivery. Best Buff Momo in Gaushala!', date: '2026-06-17' }
    ]
  },
  {
    id: 'rest_4',
    name: 'Mithila Standard Multi-Cuisine',
    ownerName: 'Binod Dev',
    mobileNumber: '9844099887',
    email: 'binod@mithilacuisine.com',
    address: 'Main Chowk, Ward 2',
    municipality: 'Aurahi',
    wardNumber: 2,
    description: 'Specializing in traditional Maithili Thalis, beaten rice, mango pickles, paneer specialties, and crispy authentic Taruwa.',
    openingTime: '09:00 AM',
    closingTime: '09:30 PM',
    logo: 'https://picsum.photos/seed/logo4/150/150',
    coverImage: 'https://picsum.photos/seed/cover4/800/400',
    rating: 4.5,
    deliveryTime: 30,
    deliveryCharge: 50,
    isApproved: true,
    reviews: []
  },
  {
    id: 'rest_pending',
    name: 'Gaushala Mango Bites & Juice Cafe',
    ownerName: 'Sanju Yadav',
    mobileNumber: '9812993344',
    email: 'sanju@mangobites.com',
    address: 'Horticulture Road, Ward 5',
    municipality: 'Gaushala',
    wardNumber: 5,
    description: 'Pending Approval Cafe! Special fruit salads, local mango smoothies, cold drinks, sandwiches, and momos.',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    logo: 'https://picsum.photos/seed/logo_p/150/150',
    coverImage: 'https://picsum.photos/seed/cover_p/800/400',
    rating: 3.5,
    deliveryTime: 15,
    deliveryCharge: 20,
    isApproved: false, // Pending
    reviews: []
  }
];

// Initial Delivery Partners
export const INITIAL_DRIVERS: DeliveryPartner[] = [
  { id: 'driver_1', name: 'Ram Baran Yadav', phone: '9811223344', vehicleNo: 'Ba 54 Pa 8219', isAvailable: true, ratings: 4.9, todayEarnings: 1200 },
  { id: 'driver_2', name: 'Krishna Mandal', phone: '9807766554', vehicleNo: 'Ba 93 Pa 1102', isAvailable: true, ratings: 4.7, todayEarnings: 850 },
  { id: 'driver_3', name: 'Shyam Sah', phone: '9844093821', vehicleNo: 'Pradesh 2-02-004 Pa 7780', isAvailable: false, ratings: 4.8, todayEarnings: 1500 }
];

// Promo coupons
export const PROMO_COUPONS = [
  { code: 'MITHILA10', discount: 10, type: 'percent', label: '10% OFF on all Mahottari orders' },
  { code: 'BARDIBAS25', discount: 25, type: 'percent', label: '25% Special Discount for Bardibas' },
  { code: 'SITASARAN', discount: 100, type: 'flat', label: 'FLAT NPR 100 off on traditional local thali' }
];

// Seed active orders
export const SEED_ORDERS: Order[] = [
  {
    id: 'order_101',
    customerId: 'cust_abc',
    customerName: 'Aashish Chaudhary',
    customerPhone: '9822334455',
    restaurantId: 'rest_1',
    restaurantName: 'Bardibas Royal Sweets & Bakers',
    items: [
      { foodItem: INITIAL_FOOD_ITEMS[2], quantity: 2 }, // Suhani Peda
      { foodItem: INITIAL_FOOD_ITEMS[9], quantity: 1 }  // Hot Milk Chai
    ],
    subtotal: 420,
    deliveryCharge: 40,
    tax: 21,
    discount: 42,
    total: 439,
    municipality: 'Bardibas',
    wardNumber: 4,
    deliveryAddress: 'Hospital Road, Behind Red Cross building',
    paymentMethod: 'eSewa',
    paymentStatus: 'Paid',
    status: 'Preparing',
    orderDate: '2026-06-20T09:10:00-07:00',
    deliveryPartnerId: 'driver_1',
    deliveryPartnerName: 'Ram Baran Yadav',
    eta: 15,
    notes: 'Please pack the sweets tightly. Thank you!'
  },
  {
    id: 'order_102',
    customerId: 'cust_xyz',
    customerName: 'Priya Mahato',
    customerPhone: '9801122334',
    restaurantId: 'rest_3',
    restaurantName: 'Gaushala Momo Express & Local Kitchen',
    items: [
      { foodItem: INITIAL_FOOD_ITEMS[0], quantity: 3 }, // Buff Momo
      { foodItem: INITIAL_FOOD_ITEMS[5], quantity: 2 }  // Mango Lassi
    ],
    subtotal: 690,
    deliveryCharge: 30,
    tax: 34,
    discount: 0,
    total: 754,
    municipality: 'Gaushala',
    wardNumber: 1,
    deliveryAddress: 'Shree Tribhuvan Secondary School Marg',
    paymentMethod: 'Khalti',
    paymentStatus: 'Paid',
    status: 'Order Received',
    orderDate: '2026-06-20T09:35:00-07:00',
    eta: 22,
    notes: 'Extra spicy momo soup sauce please!'
  }
];
