import { create } from 'zustand';

const useDropdownStore = create((set) => ({
  // "More" dropdown
  isMoreDropdownOpen: false,
  moreDropdownPosition: null,

  // Action button dropdowns (Create, Upload, etc.)
  activeActionDropdown: null, // id of the button whose dropdown is open

  openMoreDropdown: (position) => set({
    isMoreDropdownOpen: true,
    moreDropdownPosition: position,
    activeActionDropdown: null, // close any open action dropdown
  }),

  closeMoreDropdown: () => set({
    isMoreDropdownOpen: false,
    moreDropdownPosition: null
  }),

  toggleMoreDropdown: (position) => set((state) => ({
    isMoreDropdownOpen: !state.isMoreDropdownOpen,
    moreDropdownPosition: state.isMoreDropdownOpen ? null : position,
    activeActionDropdown: null, // close any open action dropdown
  })),

  // Action button dropdown controls
  setActiveActionDropdown: (dropdownId) => set({
    activeActionDropdown: dropdownId,
    isMoreDropdownOpen: false, // close the More dropdown
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