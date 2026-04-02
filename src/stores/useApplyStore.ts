import { create } from 'zustand';

interface ApplyFormState {
  name: string;
  phone: string;
  verificationSent: boolean;
  address: string;
  area: string;
  buildingType: string;
}

interface ApplyStore extends ApplyFormState {
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setVerificationSent: (sent: boolean) => void;
  setAddress: (address: string) => void;
  setArea: (area: string) => void;
  setBuildingType: (buildingType: string) => void;
  reset: () => void;
}

const initialState: ApplyFormState = {
  name: '',
  phone: '',
  verificationSent: false,
  address: '',
  area: '',
  buildingType: '단독 주택',
};

export const useApplyStore = create<ApplyStore>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  setVerificationSent: (verificationSent) => set({ verificationSent }),
  setAddress: (address) => set({ address }),
  setArea: (area) => set({ area }),
  setBuildingType: (buildingType) => set({ buildingType }),
  reset: () => set(initialState),
}));
