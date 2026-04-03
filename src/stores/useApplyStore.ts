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
  maxReachedStep: number;
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
  setMaxReachedStep: (step: number) => void;
  clearVerificationState: () => void;
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
  maxReachedStep: 1,
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
  setMaxReachedStep: (maxReachedStep) => set({ maxReachedStep }),
  clearVerificationState: () =>
    set({
      verificationSent: false,
      verificationCode: '',
      maxReachedStep: 1,
    }),
  reset: () => set(initialState),
}));
