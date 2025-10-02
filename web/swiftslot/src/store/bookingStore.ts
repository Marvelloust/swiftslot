import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type Vendor = { id: number; name: string; timezone: string };
type BookingStore = {
  vendor: Vendor | null;
  selectedDate: string; // YYYY-MM-DD
  selectedSlotUtc: string | null;

  setVendor: (v: Vendor | null) => void;
  setDate: (date: string) => void;
  setSlot: (slotUtc: string) => void;
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      vendor: null,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedSlotUtc: null,

      setVendor: (v) => set({ vendor: v }),
      setDate: (date) => set({ selectedDate: date }),
      setSlot: (slotUtc) => set({ selectedSlotUtc: slotUtc }),
    }),
    {
      name: 'booking-store', // localStorage key
    }
  )
);
