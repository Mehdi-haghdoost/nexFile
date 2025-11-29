// src/store/ui/dropdownStore.js

import { create } from 'zustand';

const useDropdownStore = create((set) => ({
  // More Dropdown
  isMoreDropdownOpen: false,
  moreDropdownPosition: null,
  
  // Action Button Dropdown (Create, Upload, etc.)
  activeActionDropdown: null, // id دکمه‌ای که dropdown اش باز است
  
  openMoreDropdown: (position) => set({ 
    isMoreDropdownOpen: true,
    moreDropdownPosition: position,
    activeActionDropdown: null, // بستن action dropdown ها
  }),
  
  closeMoreDropdown: () => set({ 
    isMoreDropdownOpen: false,
    moreDropdownPosition: null 
  }),
  
  toggleMoreDropdown: (position) => set((state) => ({
    isMoreDropdownOpen: !state.isMoreDropdownOpen,
    moreDropdownPosition: state.isMoreDropdownOpen ? null : position,
    activeActionDropdown: null, // بستن action dropdown ها
  })),

  // برای Action Button Dropdowns
  setActiveActionDropdown: (dropdownId) => set({
    activeActionDropdown: dropdownId,
    isMoreDropdownOpen: false, // بستن More dropdown
    moreDropdownPosition: null,
  }),

  closeActiveActionDropdown: () => set({
    activeActionDropdown: null,
  }),

  closeAllDropdowns: () => set({
    isMoreDropdownOpen: false,
    moreDropdownPosition: null,
    activeActionDropdown: null,
  }),
}));

export default useDropdownStore;