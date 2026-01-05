"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import menuData from '../../data/index'; 

export default function CafeMenu() {
  const params = useParams();
  const cafeId = params.cafeId;
  const currentCafeData = menuData[cafeId];

  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  // --- ERROR CHECK ---
  if (!currentCafeData) return <div>Cafe Not Found</div>;

  // --- DEBUGGER (THIS WILL SHOW ON YOUR SCREEN) ---
  const debugInfo = {
    hasData: !!currentCafeData,
    hasImagesBlock: !!currentCafeData.category_images,
    firstImageKey: currentCafeData.category_images ? Object.keys(currentCafeData.category_images)[0] : "NONE"
  };

  // --- SMART IMAGES ---
  const getCategoryImage = (cat) => {
    // 1. Check JSON
    if (currentCafeData.category_images && currentCafeData.category_images[cat]) {
      return currentCafeData.category_images[cat];
    }
    // 2. Backup
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop";
  };

  // --- LOAD DATA ---
  const heroSlides = currentCafeData.hero_slides || [];
  const handleHeroScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setCurrentHeroIndex(index);
  };

  const items = currentCafeData.items || [];
  const adItem = items.find(i => i.type === 'ad_banner');
  const foodItems = items.filter(i => i.type !== 'ad_banner');
  const filteredFood = foodItems.filter(item => {
    if (searchQuery.length > 0) {
      const match = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      if (!match) return false;
    }
    if (activeCategory !== "All" && !(item.tags && item.tags.includes(activeCategory))) return false;
    return true;
  });

  const finalDisplayList = [...filteredFood];
  if (adItem && finalDisplayList.length > 0) finalDisplayList.splice(2, 0, adItem);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
      {/* 🔴 DEBUG BOX (Start) */}
      <div className="bg-red-100 border-b-2 border-red-500 p-4 text-xs font-mono text-red-900">
        <p><strong>DEBUG REPORT:</strong></p>
        <p>1. Data Loaded: {debugInfo.hasData ? "YES ✅" : "NO ❌"}</p>
        <p>2. Found 'category_images': {debugInfo.hasImagesBlock ? "YES ✅" : "NO ❌"}</p>
        <p>3. First Key Found: {debugInfo.firstImageKey}</p>
      </div>
      {/* 🔴 DEBUG BOX (End) */}

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-50 shadow-sm pb-2">
        <div className="flex items-center justify-between px-4 pt-4 mb-3">
           <img src="/logo.png" alt="QCard" className="h-9 w-auto object-contain" />
           <div className="flex items-center gap-2">
              <div className="text-right">
                <h1 className="text-gray-900 font-extrabold text-sm leading-none tracking-tight">{currentCafeData.cafe_details.name}</h1>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wide uppercase">{currentCafeData.cafe_details.location}</p>
              </div>
           </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="sticky top-[112px] z-40 bg-white shadow-sm">
        <div className="flex gap-4 px-4 py-4 overflow-x-auto no-scrollbar">
          {currentCafeData.categories.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(cat)} className="flex flex-col items-center gap-2 min-w-[64px]">
              <div className={`w-16 h-16 rounded-full p-0.5 border-2 transition-all ${activeCategory === cat ? 'border-qcard-purple shadow-md scale-105' : 'border-transparent shadow-sm'}`}>
                <img src={getCategoryImage(cat)} alt={cat} className="w-full h-full object-cover rounded-full"/>
              </div>
              <span className={`text-xs font-bold ${activeCategory === cat ? 'text-qcard-purple' : 'text-gray-700'}`}>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FEED */}
      <div className="px-3 space-y-5 max-w-md mx-auto mt-2">
        {finalDisplayList.map((item, index) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold">{item.name}</h3>
            </div>
        ))}
      </div>
    </div>
  );
}