/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  ShoppingBag, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  RefreshCcw, 
  ExternalLink,
  ChevronUp,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MessageSquare,
  Star,
  User,
  Send,
  Loader2,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Bird
} from 'lucide-react';
import { PRODUCTS, PLATFORMS, Product, Review, Platform } from './constants';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRibaK4uT12Aj_VFwKVY2_PP4ASd6p7CYxF8r2SfVZJFMHR_-RzfFv1jbafw9-5PQTID7xlfvWyhvqS/pub?output=csv&gid=0";

interface CartItem extends Product {
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  onAddToCart: (product: Product) => void;
  key?: string | number;
}

const ProductCard = ({ product, onAddReview, onAddToCart }: ProductCardProps) => {
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');

  // Use the currency identified or default to VND if none. Detect if "rm" is present
  const isRM = product.priceString?.toLowerCase().includes('rm');
  const currencySymbol = isRM ? 'RM' : '₫';
  
  const formattedOriginalPrice = product.priceString && !product.originalPrice 
    ? product.priceString 
    : new Intl.NumberFormat(isRM ? 'en-MY' : 'vi-VN', { 
        style: 'currency', 
        currency: isRM ? 'MYR' : 'VND',
        minimumFractionDigits: 0
      }).format(product.originalPrice || 0);

  const formattedDiscountedPrice = product.discountPriceString && !product.discountedPrice
    ? product.discountPriceString
    : new Intl.NumberFormat(isRM ? 'en-MY' : 'vi-VN', { 
        style: 'currency', 
        currency: isRM ? 'MYR' : 'VND',
        minimumFractionDigits: 0
      }).format(product.discountedPrice || 0);

  const averageRating = product.reviews.length > 0 
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : "0";

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;
    onAddReview(product.id, {
      userName: newName,
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    setNewName('');
    setNewRating(5);
  };

  const getPlatformStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === "shopee") return "bg-shopee text-white";
    if (p === "shein") return "bg-black text-white";
    if (p === "tiktok") return "bg-cyan-500 text-black";
    if (p === "lazada") return "bg-[#000083] text-white";
    if (p === "amazon") return "bg-[#232F3E] text-white";
    return "bg-slate-200 text-slate-800";
  };

  const getLabelTranslation = (label: string) => {
    return label.toUpperCase();
  };

  const getPlatformColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p === "shopee") return "#EE4D2D";
    if (p === "shein") return "#000000";
    if (p === "tiktok") return "#06B6D4";
    if (p === "lazada") return "#000083";
    if (p === "amazon") return "#FF9900";
    return "#64748b";
  };

  return (
    <motion.div 
      layout
      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
      style={{ '--hover-border': getPlatformColor(product.platform) } as any}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = getPlatformColor(product.platform))}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
      id={`product-${product.id}`}
    >
      <div className="relative aspect-square bg-slate-100 rounded-xl mb-3 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <span className={`text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest ${
            product.label === 'Hot Deal' ? 'bg-red-500' : 
            product.label === 'Best Seller' ? 'bg-orange-500' : 'bg-indigo-500'
          }`}>
            {getLabelTranslation(product.label)}
          </span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest ${getPlatformStyle(product.platform)}`}>
            {product.platform}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-sm leading-tight text-slate-800 line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">({product.reviews.length})</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-shopee font-black text-lg text-nowrap">
              {isRM ? formattedDiscountedPrice : formattedDiscountedPrice.replace('₫', '').trim()}
              {!isRM && <span className="text-xs ml-0.5 font-bold">k</span>}
            </span>
            {product.discountPriceString && (
              <span className="text-slate-400 text-[10px] line-through decoration-slate-300">
                {formattedOriginalPrice}
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full text-white font-black py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
              style={{ backgroundColor: getPlatformColor(product.platform) }}
              id={`btn-buy-${product.id}`}
            >
              Shop on {product.platform}
              <ExternalLink size={12} />
            </a>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-slate-100 text-slate-800 hover:bg-slate-200 font-black py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
              id={`btn-cart-${product.id}`}
            >
              Add to Cart
              <Plus size={12} />
            </button>
            
            <button 
              onClick={() => setShowReviews(!showReviews)}
              className="text-[10px] font-black text-slate-400 hover:text-shopee uppercase tracking-tighter text-center pb-1 cursor-pointer transition-colors"
            >
              {showReviews ? "Close Reviews" : "Reviews"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReviews && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 rounded-xl mt-3"
          >
            <div className="p-3 max-h-64 overflow-y-auto no-scrollbar border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Real Customer Reviews</h4>
              
              <div className="space-y-2 mb-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={8} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate">{review.userName}</span>
                      </div>
                      <div className="flex text-yellow-500 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{review.comment}"</p>
                    <span className="text-[9px] text-slate-400 mt-1 block uppercase font-bold tracking-tighter">{review.date}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitReview} className="border-t border-slate-200 pt-3">
                <p className="text-[10px] font-black text-slate-800 mb-2 uppercase tracking-tight">Write a Review</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-[10px] p-2 bg-white border border-slate-200 rounded-lg focus:border-shopee outline-none font-medium"
                    required
                  />
                  <select 
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="text-[10px] p-2 bg-white border border-slate-200 rounded-lg focus:border-shopee outline-none font-bold"
                  >
                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} Stars</option>)}
                  </select>
                </div>
                <textarea 
                  placeholder="Your feedback..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-[10px] p-2 bg-white border border-slate-200 rounded-lg focus:border-shopee outline-none mb-2 min-h-[40px] font-medium"
                  required
                ></textarea>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 border border-slate-900 text-white hover:bg-black py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
                >
                  Submit Review
                  <Send size={10} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePlatform, setActivePlatform] = useState<string>("All");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  }, [cart]);

  const fetchProducts = () => {
    setIsLoading(true);
    console.log("Fetching products from:", SHEET_URL);
    
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        console.log("Raw CSV results:", results);
        
        const getValue = (row: any, keyPattern: string, index?: number) => {
          if (!row || typeof row !== 'object') return undefined;
          
          const keys = Object.keys(row);
          // 1. Try exact match
          if (row[keyPattern] !== undefined) return row[keyPattern];
          
          // 2. Try normalized search in keys
          const normalizedPattern = keyPattern.toLowerCase().replace(/\s+/g, '');
          const foundKey = keys.find(k => {
            const normalizedK = k.split('(')[0].toLowerCase().replace(/\s+/g, '').trim();
            return normalizedK.includes(normalizedPattern) || normalizedPattern.includes(normalizedK);
          });
          
          if (foundKey) return row[foundKey];
          
          // 3. Fallback to index if available (for rows without headers or failed header detect)
          if (index !== undefined && results.meta.fields === undefined) {
             const rowValues = Object.values(row);
             return rowValues[index];
          }
          
          return undefined;
        };

        let data = results.data;
        
        // If data seems invalid (e.g., PapaParse failed to get headers correctly)
        // results.meta.fields empty means it might be an array of arrays or misinterpreted
        const parsedProducts: Product[] = data
          .map((row: any, idx: number) => {
            // Helper to get string version safely
            const s = (val: any) => val === undefined || val === null ? "" : String(val).trim();
            
            // Extensive fallback for name identification
            const name = s(
              getValue(row, 'tên sản phẩm', 0) || 
              getValue(row, 'name', 0) || 
              getValue(row, 'sản phẩm', 0) ||
              getValue(row, 'tiêu đề', 0) ||
              row['Tên sản phẩm'] ||
              row['Name']
            );
            
            if (!name || name === 'Product Name' || name === '0' || name === 'Header') return null;

            const category = s(
              getValue(row, 'hạng mục', 2) || 
              getValue(row, 'category', 2) || 
              getValue(row, 'loại', 2) ||
              'General'
            );

            const originalPriceStr = s(getValue(row, 'giá gốc', 5) || getValue(row, 'price', 5) || '0');
            const discountedPriceStr = s(getValue(row, 'giá ưu đãi', 6) || getValue(row, 'sale price', 6) || '');
            const hasDiscount = discountedPriceStr !== '' && discountedPriceStr !== originalPriceStr;
            
            const parsePrice = (str: string) => {
              if (!str) return 0;
              const cleaned = str.replace(/[^\d.]/g, '');
              return parseFloat(cleaned) || 0;
            };

            const rawPlatform = s(
              getValue(row, 'nền tảng', 1) || 
              getValue(row, 'platform', 1) || 
              'Shopee'
            );
            
            let platform: Platform = "Shopee";
            const lp = rawPlatform.toLowerCase();
            if (lp.includes('shopee')) platform = "Shopee";
            else if (lp.includes('shein')) platform = "Shein";
            else if (lp.includes('tiktok')) platform = "TikTok";
            else if (lp.includes('lazada')) platform = "Lazada";
            else if (lp.includes('amazon')) platform = "Amazon";

            const link = s(
              getValue(row, 'link', 3) || 
              getValue(row, 'Affiliate', 3) || 
              getValue(row, 'đường dẫn', 3) ||
              '#'
            );
            
            const image = s(
              getValue(row, 'ảnh', 4) || 
              getValue(row, 'image', 4) || 
              getValue(row, 'hình', 4) ||
              'https://via.placeholder.com/400'
            );

            return {
              id: `sheet-${idx}`,
              name,
              platform,
              category: category || 'General',
              affiliateLink: link || '#',
              image: image || 'https://via.placeholder.com/400',
              originalPrice: parsePrice(originalPriceStr),
              discountedPrice: parsePrice(hasDiscount ? discountedPriceStr : originalPriceStr),
              priceString: originalPriceStr,
              discountPriceString: hasDiscount ? discountedPriceStr : '',
              label: idx % 3 === 0 ? "Hot Deal" : idx % 3 === 1 ? "Best Seller" : "Price Drop",
              reviews: []
            } as Product;
          })
          .filter((p): p is Product => p !== null);

        console.log("Final parsed products:", parsedProducts);
        
        if (parsedProducts.length > 0) {
          setAllProducts(parsedProducts);
        } else {
          console.warn("No products parsed from sheet, showing mock data.");
          setAllProducts(PRODUCTS);
        }
        setIsLoading(false);
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setAllProducts(PRODUCTS);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    let productsForCategories = allProducts;
    if (activePlatform !== "All") {
      productsForCategories = allProducts.filter(p => p.platform.toLowerCase() === activePlatform.toLowerCase());
    }
    const cats = new Set(productsForCategories.map(p => p.category));
    return ["All", ...Array.from(cats)].sort();
  }, [allProducts, activePlatform]);

  // Handle category reset if platform changes and category is no longer available
  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activePlatform, categories, activeCategory]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (activePlatform !== "All") {
      filtered = filtered.filter(p => p.platform.toLowerCase() === activePlatform.toLowerCase());
    }
    return filtered;
  }, [activeCategory, activePlatform, allProducts]);

  const handleAddReview = (productId: string, newReviewData: Omit<Review, 'id' | 'date'>) => {
    setAllProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview: Review = {
          ...newReviewData,
          id: `r-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        };
        return { ...p, reviews: [newReview, ...p.reviews] };
      }
      return p;
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    const dealsSection = document.getElementById('deals');
    dealsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      <div className="flex items-center gap-3 shrink-0 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="relative">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-slate-900 border-2 border-slate-100 shadow-sm group-hover:border-shopee group-hover:text-shopee transition-all duration-300 overflow-hidden">
            <Bird size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            <img 
              src="/logo.png" 
              alt="Clickcart Finds" 
              className="absolute inset-0 w-full h-full object-cover hidden"
              onLoad={(e) => {
                e.currentTarget.classList.remove('hidden');
                e.currentTarget.previousElementSibling?.classList.add('hidden');
              }}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">CLICKCART FINDS</span>
        </div>
      </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <span className="hidden lg:inline-flex bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm items-center gap-2">
            <ShieldCheck size={12} />
            Official Product Links
          </span>
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#deals" className="hover:text-shopee transition-colors">Deals</a>
            <a href="#features" className="hover:text-shopee transition-colors hidden sm:block">Quality</a>
            <button 
              onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-shopee transition-colors"
            >Contact</button>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchProducts} className="text-slate-400 hover:text-shopee transition-all p-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
              <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black transition-all transform hover:scale-105"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-shopee text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight">Shopping Cart</h2>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{cart.length} items collected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag size={40} strokeWidth={1} />
                    </div>
                    <p className="font-bold uppercase text-[11px] tracking-widest">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 text-shopee font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-sm text-slate-800 line-clamp-1 truncate">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] font-bold text-shopee uppercase tracking-widest mt-0.5">{item.platform}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 scale-90 -ml-2">
                            <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 px-2 hover:bg-slate-200 transition-colors text-slate-500">
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-black text-slate-800 tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 px-2 hover:bg-slate-200 transition-colors text-slate-500">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-black text-sm text-slate-900">
                            {new Intl.NumberFormat(item.priceString?.toLowerCase().includes('rm') ? 'en-MY' : 'vi-VN', { 
                              style: 'currency', 
                              currency: item.priceString?.toLowerCase().includes('rm') ? 'MYR' : 'VND',
                              minimumFractionDigits: 0
                            }).format(item.discountedPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">Total Value</span>
                    <span className="text-2xl font-black text-slate-900">
                      {new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND',
                        minimumFractionDigits: 0
                      }).format(cartTotal)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      // In an affiliate site, this could show links for all items
                      alert("Checkout logic: Redirecting to affiliate stores...");
                    }}
                    className="w-full bg-shopee text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Go to Checkout
                    <Zap size={20} fill="currentColor" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                    Checkout completes on the official platforms
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row grow min-h-0 max-w-7xl mx-auto w-full">
        {/* Sidebar: Hero & Info */}
        <aside className="lg:w-1/3 p-8 lg:border-r border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6 text-slate-900 tracking-tight">
              Great Deals Daily — <span className="text-shopee">Right Price, Right Place.</span>
            </h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              Handpicked deals from Shopee, Lazada, Amazon, TikTok, and Shein. No spam, just pure quality for your discovery.
            </p>
            
            <button 
              onClick={scrollToDeals}
              className="w-full bg-shopee text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-shopee-dark transition-all transform hover:-translate-y-1 mb-12 flex items-center justify-center gap-3"
            >
              Browse Today's Deals
              <Zap size={20} fill="currentColor" />
            </button>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-orange-50 rounded-2xl flex items-center justify-center text-shopee shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Verified Deals Only</h4>
                  <p className="text-xs text-slate-500 font-medium leading-normal mt-1">Products with 4.9* ratings and top-tier reviews.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Updated Daily</h4>
                  <p className="text-xs text-slate-500 font-medium leading-normal mt-1">Stay ahead with the best limited-time flash sales.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Official Product Links</h4>
                  <p className="text-xs text-slate-500 font-medium leading-normal mt-1">Direct links to official stores for guaranteed authenticity.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-widest opacity-80">
              Disclaimer: We share high-quality products with promotional prices. Clicking buy opens the official store in a new tab.
            </p>
          </div>
        </aside>

        {/* Main Content: Catalog Grid */}
        <main className="lg:w-2/3 p-4 md:p-8 bg-slate-50 flex flex-col min-h-screen relative">
          {isLoading && (
            <div className="absolute inset-0 z-[60] bg-slate-50/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-shopee" size={48} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing with Catalog...</p>
            </div>
          )}

          <div className="flex flex-col mb-10 gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 id="deals" className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  {activePlatform === "All" ? "Today's Top Picks" : `${activePlatform} Collection`}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Discover {filteredProducts.length} best value items
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["All", ...PLATFORMS].map((plt) => (
                  <button
                    key={plt}
                    onClick={() => setActivePlatform(plt)}
                    className={`px-5 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                      activePlatform.toLowerCase() === plt.toLowerCase()
                        ? (plt === "Shopee" ? "bg-shopee border-shopee text-white shadow-lg shadow-orange-100" : 
                           plt === "Shein" ? "bg-black border-black text-white shadow-lg shadow-slate-200" :
                           plt === "TikTok" ? "bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-100" :
                           plt === "Lazada" ? "bg-[#000083] border-[#000083] text-white shadow-lg shadow-blue-100" :
                           plt === "Amazon" ? "bg-[#FF9900] border-[#FF9900] text-black shadow-lg shadow-orange-100" :
                           "bg-slate-900 border-slate-900 text-white shadow-lg")
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {plt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                    activeCategory === cat 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddReview={handleAddReview}
                  onAddToCart={addToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProducts.length === 0 && !isLoading && (
            <div className="py-32 flex flex-col items-center justify-center text-slate-400">
               <ShoppingBag size={48} className="mb-4 opacity-20" />
               <p className="font-black uppercase tracking-widest text-sm">No items matching your criteria.</p>
               <button onClick={() => {setActivePlatform("All"); setActiveCategory("All");}} className="mt-4 text-shopee font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
            </div>
          )}


          {/* Footer Info */}
          <footer id="footer" className="mt-auto pt-20 pb-8 text-center sm:text-left scroll-mt-32">
            <div className="grid md:grid-cols-3 gap-12 mb-16 border-t border-slate-200 pt-16">
              <div className="col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-900 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden relative">
                    <Bird size={20} />
                    <img 
                      src="/logo.png" 
                      alt="Logo" 
                      className="absolute inset-0 w-full h-full object-cover hidden"
                      onLoad={(e) => {
                        e.currentTarget.classList.remove('hidden');
                        e.currentTarget.previousElementSibling?.classList.add('hidden');
                      }}
                    />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">clickcart finds</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Global product curation across leading platforms. We help you find premium items with verified high ratings and the best historical prices.
                </p>
              </div>

              <div id="contact-info" className="col-span-1">
                <h4 className="font-black text-xs uppercase tracking-widest text-shopee mb-6">Contact Info</h4>
                <div className="flex flex-col gap-5 text-sm font-bold text-slate-700">
                  <a href="tel:01133566588" className="flex items-center gap-3 hover:text-shopee transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-shopee group-hover:text-white transition-all">
                      <Phone size={14} />
                    </div>
                    +60 11-3356 6588
                  </a>
                  <a href="https://wa.me/0136546858" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-shopee transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <MessageSquare size={14} />
                    </div>
                    WhatsApp Support
                  </a>
                  <a href="mailto:qqphan88@gmail.com" className="flex items-center gap-3 hover:text-shopee transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Mail size={14} />
                    </div>
                    qqphan88@gmail.com
                  </a>
                </div>
              </div>

              <div className="col-span-1">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6">Social Presence</h4>
                <div className="flex gap-4 mb-8">
                  <a href="https://www.facebook.com/profile.php?id=100027900461622" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-shopee hover:text-white shadow-sm transition-all transform hover:-translate-y-1">
                    <Facebook size={24} />
                  </a>
                  <a href="https://www.instagram.com/qq.accessories_/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-shopee hover:text-white shadow-sm transition-all transform hover:-translate-y-1">
                    <Instagram size={24} />
                  </a>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <a href="#" className="hover:text-shopee transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-shopee transition-colors">Privacy Policy</a>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              © 2024 clickcart finds.com
            </p>
          </footer>
        </main>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl hover:bg-black transition-all transform hover:scale-110"
            id="btn-scroll-top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
