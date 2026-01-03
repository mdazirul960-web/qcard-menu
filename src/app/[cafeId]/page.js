"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import menuData from '../../data/menu.json'; // Ensure this path is correct

export default function CafeMenu() {
  const params = useParams();
  const cafeId = params.cafeId;
  const currentCafeData = menuData[cafeId];

  // --- ERROR STATE: If cafe doesn't exist ---
  if (!currentCafeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Cafe Not Found 😔</h1>
           <p className="text-gray-500 mt-2">Check the QR code or link again.</p>
           <a href="/" className="mt-4 inline-block bg-qcard-purple text-white px-4 py-2 rounded-lg text-sm font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  // --- STATE MANAGEMENT ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  // Filter States
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterPrice, setFilterPrice] = useState(false);
  const [filterRating, setFilterRating] = useState(false);

  // --- HERO SLIDES DATA ---
  const heroSlides = [
    {
      id: 1,
      bg: "bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400",
      title1: "FLAT",
      title2: "50% OFF",
      desc: "ON YOUR FIRST ORDER",
      code: "QCARD50",
      btnColor: "bg-black",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80"
    },
    {
      id: 2,
      bg: "bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600",
      title1: "FREE",
      title2: "DELIVERY",
      desc: "ON ORDERS ABOVE ₹499",
      code: "FREEDEL",
      btnColor: "bg-white text-purple-700",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
    },
    {
      id: 3,
      bg: "bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400",
      title1: "BUY 1",
      title2: "GET 1 FREE",
      desc: "ON ALL COFFEES",
      code: "COFFEELOVE",
      btnColor: "bg-white text-green-700",
      img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80"
    }
  ];

  // --- LOGIC: Track Hero Scroll ---
  const handleHeroScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setCurrentHeroIndex(index);
  };

  // --- HELPER: GET CATEGORY IMAGES ---
  const getCategoryImage = (cat) => {
    const images = {
      "All": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop&q=80",
      "Bestsellers": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=150&h=150&fit=crop&q=80",
      "Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop&q=80",
      "Coffee": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=150&h=150&fit=crop&q=80",
      "Desserts": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&h=150&fit=crop&q=80", 
      "Wraps": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=150&h=150&fit=crop&q=80",
      "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&q=80",
      "Fries": "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?w=150&h=150&fit=crop&q=80",
      "Drinks": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop&q=80"
    };
    return images[cat] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop";
  };

  // --- FILTERING LOGIC ---
  const items = currentCafeData.items || [];
  const adItem = items.find(i => i.type === 'ad_banner');
  const foodItems = items.filter(i => i.type !== 'ad_banner');

  const filteredFood = foodItems.filter(item => {
    if (searchQuery.length > 0) {
      const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      if (!searchMatch) return false;
    }
    if (activeCategory !== "All") {
      const matchesCategory = (item.tags && item.tags.includes(activeCategory));
      if (!matchesCategory) return false;
    }
    if (filterVeg && !item.is_veg) return false;
    if (filterPrice && item.price > 200) return false;
    if (filterRating && item.rating < 4.0) return false;
    return true;
  });

  // --- SMART INJECTION ---
  const finalDisplayList = [...filteredFood];
  if (adItem && finalDisplayList.length > 0) {
      const insertIndex = 2; 
      if (finalDisplayList.length >= insertIndex) {
          finalDisplayList.splice(insertIndex, 0, adItem);
      } else {
          finalDisplayList.push(adItem);
      }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
     {/* 1. HEADER & SEARCH */}
      <div className="bg-white sticky top-0 z-50 shadow-sm pb-2">
        <div className="flex items-center justify-between px-4 pt-4 mb-3">
           
           {/* LEFT: YOUR QCard Logo */}
           <img src="/logo.png" alt="QCard" className="h-8 w-auto object-contain" />

           {/* RIGHT: Client Name + Client Logo */}
           <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gray-900 font-bold text-lg leading-none">
                  {currentCafeData.cafe_details.name}
                </div>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{currentCafeData.cafe_details.location}</p>
              </div>
              
              {/* The Client Logo (Only shows if they have one) */}
              {currentCafeData.cafe_details.logo && (
                <img 
                  src={currentCafeData.cafe_details.logo} 
                  alt="Cafe Logo" 
                  className="h-12 w-12 rounded-full object-cover border border-gray-100 shadow-sm"
                />
              )}
           </div>
        </div>
        
        {/* Search Bar Section */}
        <div className="px-4">
          <div className="relative shadow-sm">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-700 focus:outline-none focus:border-qcard-purple focus:ring-1 focus:ring-qcard-purple transition-all shadow-sm placeholder-gray-400"
            />
             <svg className="absolute left-3 top-3.5 w-5 h-5 text-qcard-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION (SWIPEABLE) */}
      <div className="pt-4 pb-2 relative">
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-4 pb-4"
          onScroll={handleHeroScroll}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className={`flex-shrink-0 w-full relative h-48 rounded-2xl overflow-hidden shadow-lg snap-center ${slide.bg}`}>
               <div className="absolute top-6 left-5 z-10">
                 <h2 className="text-white font-black text-3xl italic leading-none drop-shadow-md">{slide.title1}</h2>
                 <h2 className="text-white font-black text-4xl italic leading-none mb-1 drop-shadow-md">{slide.title2}</h2>
                 <p className="text-white/90 text-[10px] font-medium tracking-wider mb-3">{slide.desc}</p>
                 <button className={`${slide.btnColor || 'bg-black'} ${slide.id === 2 || slide.id === 3 ? 'text-gray-900' : 'text-white'} text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-sm`}>
                   Use: {slide.code} <span className="text-xs">›</span>
                 </button>
               </div>
               <img 
                 src={slide.img} 
                 className="absolute -right-6 bottom-[-20px] w-48 h-48 object-contain drop-shadow-2xl transform rotate-[-10deg]"
                 alt="Hero"
               />
            </div>
          ))}
        </div>
        {/* HERO DOTS */}
        <div className="flex justify-center gap-1.5 absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
          {heroSlides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${currentHeroIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
          ))}
        </div>
      </div>

      {/* 3. CATEGORIES */}
      <div className="sticky top-[112px] z-40 bg-white shadow-sm">
        <div className="flex gap-4 px-4 py-4 overflow-x-auto no-scrollbar">
          {currentCafeData.categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className="flex flex-col items-center gap-2 min-w-[64px]"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 border-2 transition-all ${
                activeCategory === cat ? 'border-qcard-purple shadow-md scale-105' : 'border-transparent shadow-sm'
              }`}>
                <img src={getCategoryImage(cat)} alt={cat} className="w-full h-full object-cover rounded-full"/>
              </div>
              <span className={`text-xs font-bold ${activeCategory === cat ? 'text-qcard-purple' : 'text-gray-700'}`}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. FILTERS */}
      <div className="flex gap-3 px-4 mb-4 mt-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setFilterVeg(!filterVeg)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterVeg ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>{filterVeg ? '✓ Pure Veg' : 'Veg'}</button>
        <button onClick={() => setFilterPrice(!filterPrice)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterPrice ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>{filterPrice ? '✓ Under ₹200' : 'Under ₹200'}</button>
        <button onClick={() => setFilterRating(!filterRating)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterRating ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>{filterRating ? '✓ Rating 4.0+' : 'Rating 4.0+'}</button>
      </div>

      {/* 5. FEED (With Carousel & Ads) */}
      <div className="px-3 space-y-5 max-w-md mx-auto mt-2">
        {finalDisplayList.map((item, index) => {
          
          if (item.type === 'ad_banner') {
            return (
              <div key={index + 'ad'} className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white my-8">
                <div className="relative">
                   <img src={item.ad_image_url} alt="Ad" className="w-full h-44 object-cover" />
                   <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Sponsored</span>
                </div>
                <div className="p-3 flex justify-between items-center bg-gray-50">
                  <span className="text-xs font-medium text-gray-600">Promoted by {item.advertiser}</span>
                  <button className="text-qcard-purple text-xs font-extrabold uppercase tracking-wide">VISIT</button>
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 relative">
              
              {/* IMAGE CAROUSEL */}
              <div className="relative h-56 w-full bg-gray-100 group">
                 <div className="flex overflow-x-auto h-full w-full snap-x snap-mandatory no-scrollbar z-0 relative">
                    {/* Handle potential single image string vs array */}
                    {Array.isArray(item.images) ? item.images.map((imgSrc, imgIndex) => (
                      <img key={imgIndex} src={imgSrc} alt={`${item.name} ${imgIndex}`} className="w-full h-full object-cover flex-shrink-0 snap-center" />
                    )) : (
                      <img src={item.images} alt={item.name} className="w-full h-full object-cover flex-shrink-0 snap-center" />
                    )}
                 </div>
                 {/* DOTS */}
                 {Array.isArray(item.images) && item.images.length > 1 && (
                   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                     {item.images.map((_, dotIndex) => (
                       <div key={dotIndex} className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm"></div>
                     ))}
                   </div>
                 )}
                 {/* Overlays */}
                 <div className="absolute bottom-3 right-3 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">{item.rating} <span className="text-[10px]">★</span></div>
                 {item.tags?.includes('Bestseller') && (<div className="absolute bottom-3 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-r-lg shadow-sm z-10">FLAT 20% OFF</div>)}
                  <div className="absolute top-3 right-3 bg-white p-1 rounded-md shadow-sm z-10">
                    <div className={`w-3 h-3 border ${item.is_veg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-[1px]`}>
                       <div className={`w-full h-full rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                  </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-extrabold text-xl text-gray-900 leading-tight">{item.name}</h3>
                  <div className="text-lg font-bold text-gray-900">₹{item.price}</div>
                </div>
                <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-3">{item.description}</p>
                 <div className="flex items-center gap-3 border-t border-dashed border-gray-200 pt-3">
                   <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-purple-700" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase">Best in Class</span>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}