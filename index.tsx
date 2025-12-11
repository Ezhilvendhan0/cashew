import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  BarChart3, 
  Users,
  ChevronDown,
  Play,
  CheckCircle2,
  Package,
  X,
  Mic,
  Rotate3D,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Types & Data ---

type Product = {
  id: string;
  name: string;
  grade: string;
  priceB2C: number;
  priceB2B: number;
  image: string;
  description: string;
  category: 'Whole' | 'Pieces' | 'Flavored';
  inventory: number;
  certifications: string[];
  specs: { moisture: string; count: number; origin: string };
};

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal W180 King Cashews',
    grade: 'W180',
    priceB2C: 28.50,
    priceB2B: 18.00,
    image: 'https://images.unsplash.com/photo-1596484552882-628d3224b75c?q=80&w=800&auto=format&fit=crop',
    description: 'The "King of Cashews". Extra large, white, whole kernels. Handpicked for premium gifting and luxury retail.',
    category: 'Whole',
    inventory: 4500,
    certifications: ['FSSAI', 'Organic'],
    specs: { moisture: '<5%', count: 180, origin: 'Goa, India' }
  },
  {
    id: '2',
    name: 'Premium W240 Whole',
    grade: 'W240',
    priceB2C: 22.00,
    priceB2B: 14.50,
    image: 'https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=800&auto=format&fit=crop',
    description: 'Standard large size, perfect for everyday snacking and confectionery use. Consistent size and crunch.',
    category: 'Whole',
    inventory: 12000,
    certifications: ['ISO 22000', 'Fair Trade'],
    specs: { moisture: '<5%', count: 240, origin: 'Kerala, India' }
  },
  {
    id: '3',
    name: 'Roasted & Salted Gold',
    grade: 'W320',
    priceB2C: 24.00,
    priceB2B: 16.00,
    image: 'https://images.unsplash.com/photo-1596484552993-9426f8c7e30d?q=80&w=800&auto=format&fit=crop',
    description: 'Slow-roasted to perfection with a hint of Himalayan pink salt. The ultimate party snack.',
    category: 'Flavored',
    inventory: 3000,
    certifications: ['HACCP'],
    specs: { moisture: '<3%', count: 320, origin: 'Maharashtra, India' }
  },
  {
    id: '4',
    name: 'Broken LWP Pieces',
    grade: 'LWP',
    priceB2C: 12.00,
    priceB2B: 8.50,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
    description: 'Large White Pieces. Ideal for bakeries, restaurants, and paste making. High economical value.',
    category: 'Pieces',
    inventory: 25000,
    certifications: ['FSSAI'],
    specs: { moisture: '<5%', count: 0, origin: 'Mixed Origins' }
  },
];

// --- SEO Component (Phase 5) ---

const SchemaMarkup = ({ data }: { data: any }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

// --- Helper Components ---

const Product360Viewer = ({ image }: { image: string }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    setRotation((prev) => prev + delta * 0.5);
    startX.current = e.clientX;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none flex items-center justify-center select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 grid place-items-center opacity-10 pointer-events-none">
        <div className="w-full h-[1px] bg-brand-900" />
        <div className="h-full w-[1px] bg-brand-900 absolute" />
      </div>
      
      {/* Simulated 3D Object - using CSS rotation on the image */}
      <motion.div 
        style={{ rotateY: rotation }}
        className="w-3/4 h-3/4 relative"
      >
        <img src={image} className="w-full h-full object-contain drop-shadow-2xl" draggable={false} alt="360 view" />
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 pointer-events-none text-brand-900 shadow-sm">
        <Rotate3D size={16} />
        Drag to Rotate
      </div>
    </div>
  );
};

// --- Main Components ---

const Navbar = ({ mode, setMode, cartCount, onSearchClick }: any) => (
  <nav className="fixed top-0 w-full z-50 bg-brand-50/90 backdrop-blur-md border-b border-brand-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="w-10 h-10 bg-nature-900 rounded-full flex items-center justify-center text-brand-50 group-hover:scale-110 transition-transform">
            <Leaf size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-nature-900">Yuvaraj</span>
            <span className="text-[0.6rem] uppercase tracking-widest text-brand-600">Premium Nuts India</span>
          </div>
        </div>

        {/* Center: Search & Nav (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {['Shop', 'Our Farms', 'Sustainability', 'Contact'].map((item) => (
            <a key={item} href="#" className="text-brand-800 hover:text-nature-900 font-medium transition-colors text-sm uppercase tracking-wide">
              {item}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div 
            onClick={() => setMode(mode === 'B2C' ? 'B2B' : 'B2C')}
            className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all border select-none ${
              mode === 'B2B' 
                ? 'bg-nature-900 text-brand-50 border-nature-900 shadow-lg shadow-nature-900/20' 
                : 'bg-transparent text-nature-900 border-nature-900 hover:bg-brand-200'
            }`}
          >
            {mode === 'B2B' ? 'WHOLESALE' : 'RETAIL'}
          </div>

          <button onClick={onSearchClick} className="p-2 text-brand-800 hover:bg-brand-100 rounded-full transition-colors">
            <Search size={20} />
          </button>
          
          <div className="relative p-2 text-brand-800 hover:bg-brand-100 rounded-full transition-colors cursor-pointer">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const SearchOverlay = ({ isOpen, onClose, products, onProductSelect }: any) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  if (!isOpen) return null;

  const filtered = products.filter((p: Product) => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.grade.toLowerCase().includes(query.toLowerCase())
  );

  const startListening = () => {
    setIsListening(true);
    // Simulation of Voice Search (Web Speech API would go here)
    setTimeout(() => {
        setQuery('W180 King');
        setIsListening(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <Search className="text-gray-400" />
          <input 
            autoFocus
            className="flex-1 text-lg outline-none placeholder-gray-300" 
            placeholder={isListening ? "Listening..." : "Search for grades, products, or recipes..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={startListening}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <Mic size={20} />
          </button>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query && filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">No products found.</div>
          )}
          {query && filtered.map((p: Product) => (
            <div 
                key={p.id} 
                onClick={() => { onProductSelect(p); onClose(); }}
                className="flex items-center gap-4 p-3 hover:bg-brand-50 rounded-xl cursor-pointer transition-colors group"
            >
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-brand-900 group-hover:text-nature-900">{p.name}</h4>
                <p className="text-xs text-brand-500">{p.grade} • Stock: {p.inventory}kg</p>
              </div>
              <ArrowRight size={16} className="text-brand-300 group-hover:text-nature-900" />
            </div>
          ))}
          {!query && (
            <div className="text-sm text-brand-400 p-2">
              <p className="font-bold mb-3 text-xs tracking-wider uppercase text-brand-300">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {['W180 King', 'Salted Cashews', 'Gift Packs', 'Bulk 50kg'].map(t => (
                  <span key={t} onClick={() => setQuery(t)} className="bg-brand-50 border border-brand-100 text-brand-600 px-3 py-1 rounded-full hover:bg-brand-100 cursor-pointer transition-colors">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProductDetailModal = ({ product, isOpen, onClose, mode, addToCart }: any) => {
    if (!isOpen || !product) return null;
    const [activeTab, setActiveTab] = useState('details');

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* JSON-LD for Product */}
            <SchemaMarkup data={{
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "image": [product.image],
                "description": product.description,
                "sku": product.grade,
                "brand": { "@type": "Brand", "name": "Yuvaraj Nuts" },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": mode === 'B2C' ? product.priceB2C : product.priceB2B,
                    "availability": "https://schema.org/InStock"
                }
            }} />

            <motion.div 
                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                    <X size={24} />
                </button>

                {/* Left: Visuals */}
                <div className="w-full md:w-1/2 bg-brand-50 p-8 flex flex-col justify-center relative">
                    <Product360Viewer image={product.image} />
                    
                    <div className="mt-6 flex justify-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 rounded-full text-xs font-bold text-brand-800 hover:bg-brand-100">
                            <Share2 size={14} /> Share
                        </button>
                        {mode === 'B2B' && (
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 rounded-full text-xs font-bold text-brand-800 hover:bg-brand-100">
                                <Download size={14} /> Spec Sheet
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-nature-100 text-nature-800 text-[10px] font-bold uppercase tracking-wider rounded">
                            {product.certifications.join(' • ')}
                        </span>
                        <span className="px-2 py-1 bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider rounded">
                            Grade: {product.grade}
                        </span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl text-brand-900 mb-4">{product.name}</h2>
                    <p className="text-brand-600 mb-6 leading-relaxed">{product.description}</p>

                    <div className="flex items-end gap-4 mb-8">
                        <div>
                            <p className="text-xs text-brand-400 uppercase tracking-wide">Price</p>
                            <p className="text-4xl font-bold text-brand-900">
                                ${mode === 'B2C' ? product.priceB2C.toFixed(2) : product.priceB2B.toFixed(2)}
                            </p>
                        </div>
                        <span className="text-sm text-brand-500 mb-2">/ {mode === 'B2C' ? '500g Pack' : 'kg (Min 50kg)'}</span>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-100 mb-6">
                        <div className="flex gap-6">
                            {['Details', 'Specs', 'Reviews'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`pb-2 text-sm font-bold transition-colors border-b-2 ${activeTab === tab.toLowerCase() ? 'text-nature-900 border-nature-900' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 min-h-[100px]">
                        {activeTab === 'details' && (
                            <div className="space-y-2 text-sm text-brand-700">
                                <p>Harvested from our partner farms in {product.specs.origin}. Processed within 48 hours of picking to ensure maximum freshness and nutritional retention.</p>
                            </div>
                        )}
                        {activeTab === 'specs' && (
                             <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-400 text-xs">Moisture</span>
                                    <span className="font-bold text-brand-900">{product.specs.moisture}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-400 text-xs">Count/lb</span>
                                    <span className="font-bold text-brand-900">{product.specs.count || 'N/A'}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-400 text-xs">Origin</span>
                                    <span className="font-bold text-brand-900">{product.specs.origin}</span>
                                </div>
                             </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-sm text-gray-500 italic">No reviews yet. Be the first to taste the excellence!</div>
                        )}
                    </div>

                    <button 
                        onClick={() => { addToCart(product); onClose(); }}
                        className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={20} />
                        {mode === 'B2C' ? 'Add to Cart' : 'Add to Quote Request'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

const Hero = ({ mode }: { mode: 'B2C' | 'B2B' }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1549410123-5e92be974052?q=80&w=2500&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60 scale-105"
          alt="Cashew Farm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/40 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {mode === 'B2B' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-100 mb-6 backdrop-blur-md">
              <Truck size={16} /> <span>Global Supply Chain Partner</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-400/20 border border-brand-400/30 rounded-full text-brand-100 mb-6 backdrop-blur-md">
              <Star size={16} className="text-brand-400" /> <span>Award Winning Taste 2024</span>
            </div>
          )}
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-50 mb-6 leading-tight">
            {mode === 'B2C' ? 'Taste the ' : 'Source the '}
            <span className="italic text-brand-400">Extraordinary.</span>
          </h1>
          
          <p className="text-xl text-brand-100/90 max-w-xl mb-10 font-light leading-relaxed">
            {mode === 'B2C' 
              ? 'Handpicked W180 King Cashews from the pristine orchards of Goa. Roasted in small batches for the ultimate crunch.'
              : 'Direct-from-farm procurement. Full traceability blockchain. Competitive bulk pricing for Enterprise & Wholesale.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-brand-400 hover:bg-brand-500 text-brand-950 font-bold text-lg rounded-full transition-all flex items-center justify-center gap-2">
              {mode === 'B2C' ? 'Shop Collections' : 'View Catalog'} <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-brand-50 border border-white/20 font-bold text-lg rounded-full transition-all">
              {mode === 'B2C' ? 'Our Farm Story' : 'Request Quote'}
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-200 flex flex-col items-center gap-2 opacity-70"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </div>
  );
};

const FarmStory = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const steps = [
    { title: "Harvest", desc: "Hand-picked at peak ripeness in Goa.", icon: <Leaf /> },
    { title: "Sun Dry", desc: "Natural 48-hour sun drying process.", icon: <Star /> },
    { title: "Steam", desc: "Gentle steaming to loosen the shell.", icon: <Package /> },
    { title: "Grade", desc: "AI-assisted sorting for perfect sizing.", icon: <CheckCircle2 /> },
  ];

  return (
    <section ref={ref} className="py-24 bg-brand-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <span className="text-nature-500 font-bold tracking-widest uppercase text-sm mb-2 block">Blockchain Verified</span>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-900 mb-6">Transparency from Soil to Soul.</h2>
            <p className="text-brand-700 text-lg leading-relaxed mb-8">
              Every pack comes with a QR code. Scan to see the exact farm, harvest date, and quality report of your batch. We believe trust tastes better.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-nature-900/10 text-nature-900 rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-brand-900 text-lg">{step.title}</h4>
                  <p className="text-brand-600 text-sm mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div style={{ y }} className="w-full md:w-1/2 relative">
             <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1585827552668-d0728b355e3d?q=80&w=800&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live Harvest Data</span>
                  </div>
                  <div className="text-xs text-brand-800 space-y-1">
                    <div className="flex justify-between"><span>Batch:</span> <span>#YUV-24-X9</span></div>
                    <div className="flex justify-between"><span>Origin:</span> <span>North Goa, IN</span></div>
                    <div className="flex justify-between"><span>Farmer:</span> <span>R. Naik</span></div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const B2BPortal = () => {
  const [qty, setQty] = useState(500);
  
  // Simple volume discount logic
  const getDiscount = (q: number) => {
    if (q >= 1000) return 20;
    if (q >= 500) return 15;
    if (q >= 100) return 10;
    return 0;
  };
  
  const discount = getDiscount(qty);

  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-4 border border-blue-500/30">
              B2B PROCUREMENT ENGINE
            </div>
            <h2 className="text-4xl font-serif mb-6">Smart Bulk Ordering</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Our AI-driven pricing engine adjusts in real-time based on global market indices and your order volume.
            </p>
            
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <label className="block text-sm font-bold text-slate-300 mb-2">Order Quantity (KG)</label>
              <input 
                type="range" 
                min="50" 
                max="2000" 
                step="50" 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full mb-4 accent-brand-400"
              />
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-4xl font-bold text-brand-400">{qty} kg</div>
                  <div className="text-sm text-slate-400">Selected Volume</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-1">Estimated Discount</div>
                  <div className="text-2xl font-bold text-green-400">{discount}% OFF</div>
                </div>
              </div>

              <button className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors">
                Generate Instant Quote
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Inventory', val: 'Real-time', icon: <BarChart3 /> },
              { label: 'Shipping', val: 'Global', icon: <Truck /> },
              { label: 'Support', val: '24/7 Priority', icon: <Users /> },
              { label: 'Payment', val: 'Net-60', icon: <ShieldCheck /> }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <div className="text-brand-400 mb-3">{stat.icon}</div>
                <div className="text-lg font-bold">{stat.val}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductGrid = ({ mode, products, addToCart, onProductClick }: any) => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-serif text-4xl text-brand-900 mb-2">
            {mode === 'B2C' ? 'Curated Selections' : 'Wholesale Catalog'}
          </h2>
          <p className="text-brand-600">
            {mode === 'B2C' ? 'Small batches, artisanal roasting.' : 'Consistent grading, container-load capacity.'}
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-brand-800 font-bold hover:text-nature-900">
          View All <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: Product) => (
          <div 
            key={product.id} 
            onClick={() => onProductClick(product)}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-100 cursor-pointer"
          >
            
            {/* Image Area */}
            <div className="aspect-square overflow-hidden relative bg-brand-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {mode === 'B2C' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="absolute bottom-4 right-4 bg-white text-brand-900 p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-900 hover:text-white"
                >
                  <ShoppingBag size={20} />
                </button>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold tracking-wider text-brand-800">
                  {product.grade}
                </span>
              </div>
            </div>

            {/* Info Area */}
            <div className="p-5">
              <h3 className="font-serif text-lg font-bold text-brand-900 mb-1 truncate">{product.name}</h3>
              <p className="text-xs text-brand-500 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-400 block uppercase tracking-wide">
                    {mode === 'B2C' ? 'Per 500g' : 'Per Kg (Min 50kg)'}
                  </span>
                  <span className="text-xl font-bold text-brand-900">
                    ${mode === 'B2C' ? product.priceB2C.toFixed(2) : product.priceB2B.toFixed(2)}
                  </span>
                </div>
                
                {mode === 'B2B' && (
                  <button className="text-xs font-bold border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50">
                    Specs PDF
                  </button>
                )}
              </div>
              
              {mode === 'B2B' && (
                <div className="mt-4 pt-3 border-t border-brand-50">
                  <div className="flex justify-between text-xs text-brand-500">
                    <span>Stock: {product.inventory.toLocaleString()}kg</span>
                    <span className="text-green-600 font-bold">Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-brand-900 text-brand-100 py-16">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="text-brand-400" />
          <span className="font-serif text-2xl font-bold text-brand-50">Yuvaraj Nuts</span>
        </div>
        <p className="max-w-md text-brand-200/80 mb-8">
          Pioneering the future of cashew commerce. Combining heritage farming with blockchain transparency and AI-driven logistics.
        </p>
        <div className="flex gap-4">
          {[1,2,3,4].map(i => (
             <div key={i} className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center hover:bg-brand-700 cursor-pointer transition-colors">
               <span className="text-xs">Soc</span>
             </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Products</h4>
        <ul className="space-y-4 text-sm text-brand-200/80">
          <li className="hover:text-brand-400 cursor-pointer">W180 King Cashews</li>
          <li className="hover:text-brand-400 cursor-pointer">Roasted & Salted</li>
          <li className="hover:text-brand-400 cursor-pointer">Organic Raw</li>
          <li className="hover:text-brand-400 cursor-pointer">Gift Hampers</li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Company</h4>
        <ul className="space-y-4 text-sm text-brand-200/80">
          <li className="hover:text-brand-400 cursor-pointer">Our Story</li>
          <li className="hover:text-brand-400 cursor-pointer">B2B Portal</li>
          <li className="hover:text-brand-400 cursor-pointer">Sustainability</li>
          <li className="hover:text-brand-400 cursor-pointer">Contact Us</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-8 mt-12 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center text-xs text-brand-500">
      <p>© 2024 Yuvaraj Nuts India. All rights reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Sitemap</span>
      </div>
    </div>
  </footer>
);

// --- Main App ---

const App = () => {
  const [mode, setMode] = useState<'B2C' | 'B2B'>('B2C');
  const [cart, setCart] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Phase 5: PWA Service Worker Registration logic placeholder
    if ('serviceWorker' in navigator) {
        // navigator.serviceWorker.register('/sw.js');
        console.log("Service Worker ready to register");
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    // Simple toast notification could go here
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-nature-500 selection:text-white">
      {/* Dynamic Title and Meta via simple effect for demo, normally handled by Head/Helmet */}
      <Navbar 
        mode={mode} 
        setMode={setMode} 
        cartCount={cart.length} 
        onSearchClick={() => setIsSearchOpen(true)}
      />
      
      <main>
        <Hero mode={mode} />
        
        {/* Dynamic Content based on User Mode */}
        {mode === 'B2C' ? (
          <>
            <FarmStory />
            <ProductGrid mode="B2C" products={PRODUCTS} addToCart={addToCart} onProductClick={setSelectedProduct} />
            
            {/* Culinary Inspiration Section (B2C Only) */}
            <section className="bg-brand-900 py-24 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
               <div className="relative max-w-4xl mx-auto px-6">
                 <h2 className="font-serif text-4xl text-brand-50 mb-6">Culinary Excellence</h2>
                 <p className="text-brand-200 mb-8">Discover AI-generated recipes tailored to your taste profile.</p>
                 <button className="px-8 py-3 border border-brand-400 text-brand-400 rounded-full hover:bg-brand-400 hover:text-brand-900 transition-colors uppercase tracking-widest text-xs font-bold">
                   Explore Recipes
                 </button>
               </div>
            </section>
          </>
        ) : (
          <>
            <B2BPortal />
            <ProductGrid mode="B2B" products={PRODUCTS} addToCart={addToCart} onProductClick={setSelectedProduct} />
            
            {/* Certifications Strip (B2B Only) */}
            <section className="bg-white py-12 border-t border-brand-100">
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                 {/* Placeholders for logos */}
                 <div className="text-xl font-bold text-gray-400">ISO 22000</div>
                 <div className="text-xl font-bold text-gray-400">HACCP Certified</div>
                 <div className="text-xl font-bold text-gray-400">FSSAI</div>
                 <div className="text-xl font-bold text-gray-400">APEDA</div>
                 <div className="text-xl font-bold text-gray-400">Halal</div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
            products={PRODUCTS} 
            onProductSelect={setSelectedProduct}
          />
        )}
        {selectedProduct && (
            <ProductDetailModal 
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                mode={mode}
                addToCart={addToCart}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;