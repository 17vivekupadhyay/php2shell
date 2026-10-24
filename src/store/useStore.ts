import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Severity, VulnType } from "@/types";

export interface Filters {
  severity?: Severity;
  type?: VulnType;
  cwe?: number;
  tag?: string;
}

interface StoreState {
  selectedVulnerability: string | null;
  searchQuery: string;
  filters: Filters;
  checkedItems: Record<string, boolean>;

  setSelectedVulnerability: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedVulnerability: null,
      searchQuery: "",
      filters: {},
      checkedItems: {},

      setSelectedVulnerability: (id) => set({ selectedVulnerability: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),
      toggleChecklistItem: (id) =>
        set((state) => ({
          checkedItems: { ...state.checkedItems, [id]: !state.checkedItems[id] },
        })),
      resetChecklist: () => set({ checkedItems: {} }),
    }),
    {
      name: "php2shell-store",
      // Only persist checklist progress across sessions; everything else
      // (search/filters/selection) should reset on reload.
      partialize: (state) => ({ checkedItems: state.checkedItems }),
    }
  )
);
