"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation'; // Hook to read URL
import menuData from '../../data/menu.json'; // Note the extra ../

export default function CafeMenu() {
  const params = useParams();
  const cafeId = params.cafeId; // This gets "urban" or "demo" from the URL

  // 1. SELECT THE RIGHT DATA
  // If the cafe doesn't exist in our JSON, show a simple error
  const currentCafeData = menuData[cafeId];

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
  
  // Filter States
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterPrice, setFilterPrice] = useState(false);
  const [filterRating, setFilterRating] = useState(false);

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

  // --- LOGIC: SEPARATE AD FROM CONTENT ---
  const items = currentCafeData.items || [];
  const adItem = items.find(i => i.type === 'ad_banner');
  const foodItems = items.filter(i => i.type !== 'ad_banner');

  // --- FILTERING LOGIC ---
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
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-50 shadow-sm pb-2">
        <div className="flex items-center justify-between px-4 pt-4 mb-3">
           <img src="/logo.png" alt="QCard" className="h-9 w-auto object-contain" />
           <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-gray-900 font-bold text-lg leading-none">
                {currentCafeData.cafe_details.name}
              </div>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{currentCafeData.cafe_details.location}</p>
           </div>
        </div>
        <div className="px-4">
          <div className="relative shadow-sm">
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-700 focus:outline-none focus:border-qcard-purple focus:ring-1 focus:ring-qcard-purple transition-all shadow-sm placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="sticky top-[100px] z-40 bg-white shadow-sm">
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

      {/* FEED */}
      <div className="px-3 space-y-5 max-w-md mx-auto mt-4">
        {finalDisplayList.map((item, index) => {
          if (item.type === 'ad_banner') {
             return <div key={index} className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white"><img src={item.ad_image_url} className="w-full h-44 object-cover"/></div>
          }
          return (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
               <div className="relative h-56 w-full">
                 <img src={item.images?.[0] || ""} className="w-full h-full object-cover"/>
                 <div className="absolute bottom-3 right-3 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-lg">{item.rating} ★</div>
               </div>
               <div className="p-4">
                 <h3 className="font-extrabold text-xl text-gray-900">{item.name}</h3>
                 <div className="text-lg font-bold text-gray-900">₹{item.price}</div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}