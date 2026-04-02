'use client';

import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Text } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import {
  useCreateApplication,
  useRequestLookupCode,
} from '@/features/applications/queries';
import { useApplyStore } from '@/stores/useApplyStore';

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  '1단계 – 신청자 정보 입력',
  '2단계 – 건물 사진 촬영',
  '3단계 – 필요 서류 신청',
  '4단계 – 신청 정보 확인',
  '',
] as const;

interface StepLayoutProps {
  children: ReactNode;
}

export default function StepLayout({ children }: StepLayoutProps) {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const step = Number(params.step);
  const isComplete = step === TOTAL_STEPS;

  const {
    name,
    phone,
    address,
    area,
    buildingType,
    verificationSent,
    setVerificationSent,
    reset,
  } = useApplyStore();

  const createApplication = useCreateApplication();
  const requestLookupCode = useRequestLookupCode();

  const progress = `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`;
  const stepLabel = STEP_LABELS[step - 1] ?? '';

  const handleSendCode = () => {
    requestLookupCode.mutate(
      { phone },
      {
        onSuccess: () => setVerificationSent(true),
        onError: () => setVerificationSent(true),
      },
    );
  };

  const handleSubmit = () => {
    const areaSqm = parseFloat(area) || undefined;
    createApplication.mutate(
      {
        name,
        phone,
        address: address || undefined,
        areaSqm,
        notes: buildingType,
      },
      {
        onSuccess: () => {
          reset();
          router.push(`/apply/step/${TOTAL_STEPS}`);
        },
      },
    );
  };

  // 헤더: 타이틀행(52px) + 진행바(4px) + 단계라벨(32px) = 88px
  // 푸터: 버튼(54px) + 상하패딩(40px) = 94px
  const HEADER_H = isComplete ? 0 : 88;
  const FOOTER_H = isComplete ? 0 : 94;

  return (
    <AppLayout
      style={{
        overflow: 'hidden',
        background: '#ffffff',
        color: '#161616',
      }}
    >
      {/* 헤더 */}
      {!isComplete ? (
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: '#ffffff',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 20px 12px',
              position: 'relative',
            }}
          >
            <button
              type="button"
              aria-label="닫기"
              style={{
                position: 'absolute',
                left: '20px',
                border: 0,
                background: 'transparent',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#344054',
                lineHeight: 1,
              }}
              onClick={() => router.push('/apply/landing')}
            >
              ✕
            </button>
            <Text typography="body1" style={{ fontWeight: 700 }}>
              빈집 서비스 신청하기
            </Text>
          </div>

          <div
            style={{ width: '100%', height: '4px', background: '#ebeff5' }}
            aria-hidden="true"
          >
            <div
              style={{
                width: progress,
                height: '100%',
                background: '#2368b7',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <p
            style={{
              margin: 0,
              padding: '6px 20px 10px',
              fontSize: '12px',
              color: '#98a2b3',
            }}
          >
            {stepLabel}
          </p>
        </header>
      ) : null}

      {/* 스크롤 영역: 헤더/푸터 높이를 제외한 정확한 영역만 스크롤 */}
      <main
        style={{
          height: `calc(100dvh - ${HEADER_H}px - ${FOOTER_H}px)`,
          marginTop: HEADER_H,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: '28px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>

      {/* 푸터 */}
      {!isComplete ? (
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '12px 20px 28px',
            borderTop: '1px solid #ebeff5',
            background: 'rgb(255 255 255 / 0.96)',
            zIndex: 10,
          }}
        >
          {/* Step 1: 단일 버튼 */}
          {step === 1 ? (
            <button
              type="button"
              disabled={requestLookupCode.isPending}
              style={{
                width: '100%',
                height: '54px',
                borderRadius: '14px',
                border: 0,
                background: '#1f66b3',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: requestLookupCode.isPending ? 'not-allowed' : 'pointer',
                opacity: requestLookupCode.isPending ? 0.7 : 1,
              }}
              onClick={() => {
                if (!verificationSent) {
                  handleSendCode();
                } else {
                  router.push('/apply/step/2');
                }
              }}
            >
              {requestLookupCode.isPending
                ? '발송 중...'
                : verificationSent
                  ? '다음'
                  : '인증번호 받기'}
            </button>
          ) : null}

          {/* Step 2–3: 이전 | 다음 */}
          {step === 2 || step === 3 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <button
                type="button"
                style={{
                  height: '54px',
                  borderRadius: '14px',
                  border: '1px solid #d6deea',
                  background: '#ffffff',
                  color: '#344054',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/apply/step/${step - 1}`)}
              >
                이전
              </button>
              <button
                type="button"
                style={{
                  height: '54px',
                  borderRadius: '14px',
                  border: 0,
                  background: '#1d2240',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/apply/step/${step + 1}`)}
              >
                다음
              </button>
            </div>
          ) : null}

          {/* Step 4: 이전 | 다음(제출) */}
          {step === 4 ? (
            <>
              {createApplication.isError ? (
                <p
                  style={{
                    margin: '0 0 8px',
                    color: '#ef4444',
                    fontSize: '13px',
                    textAlign: 'center',
                  }}
                >
                  신청 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              ) : null}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  style={{
                    height: '54px',
                    borderRadius: '14px',
                    border: '1px solid #d6deea',
                    background: '#ffffff',
                    color: '#344054',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push('/apply/step/3')}
                >
                  이전
                </button>
                <button
                  type="button"
                  disabled={createApplication.isPending}
                  style={{
                    height: '54px',
                    borderRadius: '14px',
                    border: 0,
                    background: createApplication.isPending
                      ? '#7d93b2'
                      : '#1d2240',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: createApplication.isPending
                      ? 'not-allowed'
                      : 'pointer',
                  }}
                  onClick={handleSubmit}
                >
                  {createApplication.isPending ? '제출 중...' : '다음'}
                </button>
              </div>
            </>
          ) : null}
        </footer>
      ) : null}
    </AppLayout>
  );
}
