"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import menuData from '../../data/index'; 

export default function CafeMenu() {
  const params = useParams();
  const cafeId = params.cafeId;
  const currentCafeData = menuData[cafeId];

  // --- ERROR STATE ---
  if (!currentCafeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Cafe Not Found 😔</h1></div>
      </div>
    );
  }

  // --- CONFIGURATION (DEFAULTS) ---
  // If you don't define this in JSON, it uses these defaults
  const filters = currentCafeData.filter_config || {
    veg: { show: true, label: "Veg" },
    price: { show: true, limit: 200, label: "Under ₹200" },
    rating: { show: true, limit: 4.0, label: "Rating 4.0+" }
  };

  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  
  // Filter States
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterPrice, setFilterPrice] = useState(false);
  const [filterRating, setFilterRating] = useState(false);

  // --- LOAD DATA ---
  const heroSlides = currentCafeData.hero_slides || [];
  const handleHeroScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setCurrentHeroIndex(index);
  };

// --- SMART IMAGES (100% CONTROLLED BY JSON) ---
  const getCategoryImage = (cat) => {
    // 1. Look for the image in YOUR sish.json file
    if (currentCafeData.category_images && currentCafeData.category_images[cat]) {
      return currentCafeData.category_images[cat];
    }

    // 2. If you forgot to add an image in JSON, show a simple grey placeholder
    // This way, the app won't crash, but you know you need to fix the JSON.
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop";
  };

  // --- FILTERING LOGIC ---
  const items = currentCafeData.items || [];
  const adItem = items.find(i => i.type === 'ad_banner');
  const foodItems = items.filter(i => i.type !== 'ad_banner');

  const filteredFood = foodItems.filter(item => {
    // 1. Search
    if (searchQuery.length > 0) {
      const match = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      if (!match) return false;
    }
    // 2. Category
    if (activeCategory !== "All" && !(item.tags && item.tags.includes(activeCategory))) return false;
    
    // 3. Custom Filters (Using JSON Configuration)
    if (filterVeg && !item.is_veg) return false;
    
    // Use the limit from JSON (or default 200)
    if (filterPrice && item.price > (filters.price.limit || 200)) return false;
    
    // Use the limit from JSON (or default 4.0)
    if (filterRating && item.rating < (filters.rating.limit || 4.0)) return false;
    
    return true;
  });

  const finalDisplayList = [...filteredFood];
  if (adItem && finalDisplayList.length > 0) finalDisplayList.splice(2, 0, adItem);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
      {/* 1. HEADER */}
      <div className="bg-white sticky top-0 z-50 shadow-sm pb-2">
        <div className="flex items-center justify-between px-4 pt-4 mb-3">
           <img src="/logo.png" alt="QCard" className="h-9 w-auto object-contain" />
           <div className="flex items-center gap-2">
              <div className="text-right">
                <h1 className="text-gray-900 font-extrabold text-sm leading-none tracking-tight">{currentCafeData.cafe_details.name}</h1>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wide uppercase">{currentCafeData.cafe_details.location}</p>
              </div>
              {currentCafeData.cafe_details.logo && (
                <img src={currentCafeData.cafe_details.logo} alt="Cafe Logo" className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-sm"/>
              )}
           </div>
        </div>
        <div className="px-4">
          <div className="relative shadow-sm">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-700 focus:outline-none focus:border-qcard-purple focus:ring-1 focus:ring-qcard-purple transition-all shadow-sm placeholder-gray-400"/>
             <svg className="absolute left-3 top-3.5 w-5 h-5 text-qcard-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      {heroSlides.length > 0 && (
        <div className="pt-4 pb-2 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-4 pb-4" onScroll={handleHeroScroll}>
            {heroSlides.map((slide) => {
              const isDesignerMode = !slide.title1 || slide.title1 === "";
              return (
                <div key={slide.id} className={`flex-shrink-0 w-full relative h-48 rounded-2xl overflow-hidden shadow-lg snap-center ${isDesignerMode ? 'bg-transparent' : slide.bg}`}>
                   {!isDesignerMode && (
                     <div className="absolute top-6 left-5 z-10">
                       <h2 className="text-white font-black text-3xl italic leading-none drop-shadow-md">{slide.title1}</h2>
                       <h2 className="text-white font-black text-4xl italic leading-none mb-1 drop-shadow-md">{slide.title2}</h2>
                       <p className="text-white/90 text-[10px] font-medium tracking-wider mb-3">{slide.desc}</p>
                       <button className={`${slide.btnColor} text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-sm`}>
                         Use: {slide.code} <span className="text-xs">›</span>
                       </button>
                     </div>
                   )}
                   <img src={slide.img} className={isDesignerMode ? "w-full h-full object-cover" : "absolute -right-6 bottom-[-20px] w-48 h-48 object-contain drop-shadow-2xl transform rotate-[-10deg]"} alt="Hero" />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-1.5 absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
            {heroSlides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${currentHeroIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CATEGORIES */}
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

      {/* 4. DYNAMIC FILTERS */}
      <div className="flex gap-3 px-4 mb-4 mt-2 overflow-x-auto no-scrollbar">
        
        {/* Veg Filter (Visible only if filters.veg.show is true) */}
        {filters.veg?.show && (
          <button onClick={() => setFilterVeg(!filterVeg)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterVeg ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>
            {filterVeg ? `✓ ${filters.veg.label}` : filters.veg.label}
          </button>
        )}

        {/* Price Filter (Visible only if filters.price.show is true) */}
        {filters.price?.show && (
          <button onClick={() => setFilterPrice(!filterPrice)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterPrice ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>
            {filterPrice ? `✓ ${filters.price.label}` : filters.price.label}
          </button>
        )}

        {/* Rating Filter (Visible only if filters.rating.show is true) */}
        {filters.rating?.show && (
          <button onClick={() => setFilterRating(!filterRating)} className={`border rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shadow-sm transition-all ${filterRating ? 'bg-qcard-purple text-white border-qcard-purple' : 'bg-white text-gray-700 border-gray-300'}`}>
            {filterRating ? `✓ ${filters.rating.label}` : filters.rating.label}
          </button>
        )}

      </div>

      {/* 5. FEED */}
      <div className="px-3 space-y-5 max-w-md mx-auto mt-2">
        {finalDisplayList.map((item, index) => {
          if (item.type === 'ad_banner') return <div key={index+'ad'} className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white my-8"><img src={item.ad_image_url} className="w-full h-44 object-cover"/><div className="p-3 bg-gray-50 flex justify-between"><span className="text-xs text-gray-600">Promoted by {item.advertiser}</span><span className="text-qcard-purple text-xs font-extrabold">VISIT</span></div></div>;
          return (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 relative">
              <div className="relative h-56 w-full bg-gray-100 group">
                 <div className="flex overflow-x-auto h-full w-full snap-x snap-mandatory no-scrollbar">
                    {Array.isArray(item.images) ? item.images.map((src, i) => <img key={i} src={src} className="w-full h-full object-cover flex-shrink-0 snap-center"/>) : <img src={item.images} className="w-full h-full object-cover flex-shrink-0 snap-center"/>}
                 </div>
                 <div className="absolute bottom-3 right-3 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm z-10">{item.rating} ★</div>
                 {item.discount && <div className="absolute bottom-3 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-r-lg shadow-sm z-10">{item.discount}</div>}
                  <div className="absolute top-3 right-3 bg-white p-1 rounded-md shadow-sm z-10"><div className={`w-3 h-3 border ${item.is_veg?'border-green-600':'border-red-600'} p-[1px] flex justify-center items-center`}><div className={`w-full h-full rounded-full ${item.is_veg?'bg-green-600':'bg-red-600'}`}></div></div></div>
              </div>
              <div className="p-4"><div className="flex justify-between items-start mb-1"><h3 className="font-extrabold text-xl text-gray-900 leading-tight">{item.name}</h3><div className="text-lg font-bold text-gray-900">₹{item.price}</div></div><p className="text-xs text-gray-500 font-medium line-clamp-1 mb-3">{item.description}</p><div className="flex items-center gap-3 border-t border-dashed border-gray-200 pt-3"><div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-purple-700" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div><span className="text-[10px] font-bold text-purple-700 uppercase">Best in Class</span></div></div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}