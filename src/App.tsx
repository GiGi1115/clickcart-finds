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
  Loader2
} from 'lucide-react';
import { PRODUCTS, PLATFORMS, Product, Review, Platform } from './constants';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRibaK4uT12Aj_VFwKVY2_PP4ASd6p7CYxF8r2SfVZJFMHR_-RzfFv1jbafw9-5PQTID7xlfvWyhvqS/pub?gid=0&single=true&output=csv";

interface ProductCardProps {
  product: Product;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  key?: string | number;
}

const ProductCard = ({ product, onAddReview }: ProductCardProps) => {
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
    switch (label) {
      case "Deal hot": return "HOT DEAL";
      case "Bán chạy": return "BEST SELLER";
      case "Giảm sâu": return "HUGE DROP";
      default: return label.toUpperCase();
    }
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
            product.label === 'Deal hot' ? 'bg-red-500' : 
            product.label === 'Bán chạy' ? 'bg-orange-500' : 'bg-indigo-500'
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePlatform, setActivePlatform] = useState<string>("All");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchProducts = () => {
    setIsLoading(true);
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const parsedProducts: Product[] = results.data
          .filter((row: any) => row['tên sản phẩm'] && row['tên sản phẩm'].trim() !== '')
          .map((row: any, index: number) => {
            const originalPriceStr = row['giá gốc'] || '0';
            const discountedPriceStr = row['giá ưu đãi'] || '';
            const hasDiscount = discountedPriceStr !== '' && discountedPriceStr !== originalPriceStr;
            
            // Extract number from string like "rm36" or "100.000"
            const parsePrice = (str: string) => {
              if (!str) return 0;
              // Remove currency prefix like rm, ₫, $ etc and separators
              const cleaned = str.replace(/[^\d.]/g, '');
              return parseFloat(cleaned) || 0;
            };

            const rawPlatform = row['nền tảng (platform)'] || 'Shopee';
            // Capitalize first letter (e.g. shein -> Shein)
            const platform = (rawPlatform.charAt(0).toUpperCase() + rawPlatform.slice(1)) as Platform;

            return {
              id: `sheet-${index}`,
              name: row['tên sản phẩm'] || 'Product Name',
              platform,
              category: row['hangj mục (category )'] || 'General',
              affiliateLink: row['Affiliate link'] || '#',
              image: row['Ảnh sản phẩm'] || 'https://via.placeholder.com/400',
              originalPrice: parsePrice(originalPriceStr),
              discountedPrice: parsePrice(hasDiscount ? discountedPriceStr : originalPriceStr),
              priceString: originalPriceStr,
              discountPriceString: hasDiscount ? discountedPriceStr : '',
              label: index % 3 === 0 ? "Deal hot" : index % 3 === 1 ? "Bán chạy" : "Giảm sâu",
              reviews: []
            };
          });

        setAllProducts(parsedProducts.length > 0 ? parsedProducts : PRODUCTS);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing sheet:", error);
        setAllProducts(PRODUCTS);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category));
    return ["All", ...Array.from(cats)].sort();
  }, [allProducts]);

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

  // Handle scroll to show "Back to top" button
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 500);
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    const dealsSection = document.getElementById('deals');
    dealsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Contact Bar */}
      <div className="bg-slate-900 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-slate-400">
          <div className="flex items-center gap-6">
            <a href="tel:01133566588" className="flex items-center gap-2 hover:text-shopee transition-colors">
              <Phone size={10} className="text-shopee" />
              01133566588
            </a>
            <a href="https://wa.me/0136546858" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-shopee transition-colors">
              <MessageSquare size={10} className="text-shopee" />
              WA: 013-654 6858
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:qqphan88@gmail.com" className="flex items-center gap-2 hover:text-shopee transition-colors lowercase font-medium tracking-normal">
              <Mail size={10} className="text-shopee" />
              qqphan88@gmail.com
            </a>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/profile.php?id=100027900461622" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook size={12} />
              </a>
              <a href="https://www.instagram.com/qq.accessories_/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-shopee w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">C</div>
          <span className="text-xl font-black tracking-tight text-shopee uppercase">clickcart finds.com</span>
        </div>
        
        <div className="flex items-center gap-10">
          <span className="hidden lg:inline-flex bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm items-center gap-2">
            <ShieldCheck size={12} />
            Official Product Links
          </span>
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#deals" className="hover:text-shopee transition-colors">Deals</a>
            <a href="#features" className="hover:text-shopee transition-colors hidden sm:block">Quality</a>
            <a href="#footer" className="hover:text-shopee transition-colors">Contact</a>
          </div>
          <button onClick={fetchProducts} className="text-slate-400 hover:text-shopee transition-all p-2 rounded-lg hover:bg-slate-50">
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </nav>

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
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing with Sheet...</p>
            </div>
          )}

          <div className="flex flex-col mb-10 gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 id="deals" className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                {activePlatform === "All" ? "Hottest Deals" : `${activePlatform} Deals`}
                <div className="w-10 h-1 bg-shopee rounded-full flex-shrink-0" />
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {["All", ...PLATFORMS].map((plt) => (
                  <button
                    key={plt}
                    onClick={() => setActivePlatform(plt)}
                    className={`px-4 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
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
                  className={`px-4 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                    activeCategory === cat 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm"
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
                />
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProducts.length === 0 && !isLoading && (
            <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest">
              No products found for this selection.
            </div>
          )}

          {/* Features Detail Section */}
          <section id="features" className="mt-20 border-t border-slate-200 pt-16">
            <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Quality Guarantee</h3>
            <div className="grid sm:grid-cols-2 gap-8 font-medium">
              <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <ShieldCheck className="text-shopee mb-4" size={32} />
                <h4 className="font-black text-slate-800 mb-2 uppercase text-sm">Official Sources Only</h4>
                <p className="text-slate-500 text-sm leading-relaxed">We only curate links from official brand malls and authorized dealers to ensure 100% authenticity.</p>
              </div>
              <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <TrendingUp className="text-blue-600 mb-4" size={32} />
                <h4 className="font-black text-slate-800 mb-2 uppercase text-sm">Maximum Savings</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Our team manually verifies every discount to ensure you're getting the best possible price on the market.</p>
              </div>
            </div>
          </section>

          {/* Footer Info */}
          <footer id="footer" className="mt-auto pt-20 pb-8 text-center sm:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-900 w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm uppercase">C</div>
                <span className="text-sm font-black tracking-widest text-slate-900 uppercase">clickcart finds.com</span>
              </div>
              <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <a href="#" className="hover:text-shopee transition-colors">Terms</a>
                <a href="#" className="hover:text-shopee transition-colors">Privacy</a>
                <a href="#" className="hover:text-shopee transition-colors">Security</a>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-200 pt-6">
              © 2024 clickcart finds.com. Dedicated. Trustworthy. Best Deals.
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
