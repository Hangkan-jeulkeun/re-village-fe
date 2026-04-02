// 내 제출물 상태
export type MySubmissionState =
  | 'ALL'
  | 'DRAFT'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

// 신청 단계
export type ApplicationStep =
  | 'basic-info'
  | 'photo-upload'
  | 'site-info'
  | 'building-info'
  | 'review'
  | 'done';

// 내 제출물 인터페이스
export interface VacancyApplication {
  id: string;
  applicantName: string;
  phone: string;
  email?: string;
  buildingPhotoUrl?: string;
  buildingUse?: string;
  buildingArea?: number;
  landArea?: number;
  expectedConstructionDate?: string;
  buildingType?: string;
  floorCount?: number;
  surfaceMaterial?: string;
  reason?: string;
  status: MySubmissionState;
  submittedAt?: string;
  updatedAt?: string;
}
