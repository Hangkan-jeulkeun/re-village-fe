import { create } from 'zustand';

interface ApplyFormState {
  name: string;
  phone: string;
  verificationSent: boolean;
  verificationCode: string;
  address: string;
  area: string;
  buildingType: string;
  photos: File[];
}

interface ApplyStore extends ApplyFormState {
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setVerificationSent: (sent: boolean) => void;
  setVerificationCode: (code: string) => void;
  setAddress: (address: string) => void;
  setArea: (area: string) => void;
  setBuildingType: (buildingType: string) => void;
  setPhotos: (photos: File[]) => void;
  reset: () => void;
}

const initialState: ApplyFormState = {
  name: '',
  phone: '',
  verificationSent: false,
  verificationCode: '',
  address: '',
  area: '',
  buildingType: '단독 주택',
  photos: [],
};

export const useApplyStore = create<ApplyStore>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setPhone: (phone) => set({ phone }),
  setVerificationSent: (verificationSent) => set({ verificationSent }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setAddress: (address) => set({ address }),
  setArea: (area) => set({ area }),
  setBuildingType: (buildingType) => set({ buildingType }),
  setPhotos: (photos) => set({ photos }),
  reset: () => set(initialState),
}));
