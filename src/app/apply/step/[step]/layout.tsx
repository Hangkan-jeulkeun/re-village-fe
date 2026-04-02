'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Text, Toast } from '@vapor-ui/core';
import { WarningIcon } from '@vapor-ui/icons';
import AppLayout from '@/components/layout/AppLayout';
import Button, { ButtonPair } from '@/components/common/base/Button';
import {
  useCreateApplicationMultipart,
  useRequestCode,
  useVerifyCode,
} from '@/features/applications/queries';
import { useApplyStore } from '@/stores/useApplyStore';
import { useAuthStore } from '@/stores/useAuthStore';

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
    photos,
    verificationSent,
    verificationCode,
    maxReachedStep,
    setVerificationSent,
    setMaxReachedStep,
    reset,
  } = useApplyStore();

  const { setTokens } = useAuthStore();

  const toastManager = Toast.useToastManager();
  const createApplication = useCreateApplicationMultipart();
  const requestSubmitCode = useRequestCode();
  const verifySubmitCode = useVerifyCode();

  /* 전화번호: 숫자 기준 10자리 이상 (010-0000-0000) */
  const isPhoneValid = phone.replace(/\D/g, '').length >= 10;
  const canSendCode = name.trim().length > 0 && isPhoneValid;
  const canNext = verificationCode.trim().length === 6;

  const stepLabel = STEP_LABELS[step - 1] ?? '';

  /* 순차 진입 가드 */
  const needsRedirect = step > maxReachedStep;
  useEffect(() => {
    if (needsRedirect) router.replace('/apply/step/1');
  }, [needsRedirect, router]);
  if (needsRedirect) return null;

  const handleSendCode = () => {
    requestSubmitCode.mutate(
      { name, phone },
      {
        onSuccess: () => setVerificationSent(true),
        onError: () => setVerificationSent(true),
      },
    );
  };

  const handleVerifyCode = () => {
    verifySubmitCode.mutate(
      { name, phone, code: verificationCode },
      {
        onSuccess: (tokens) => {
          setTokens(tokens);
          setMaxReachedStep(2);
          router.push('/apply/step/2');
        },
        onError: () =>
          toastManager.add({
            title: '인증번호가 일치하지 않아요!',
            colorPalette: 'danger',
            icon: <WarningIcon />,
            close: true,
          }),
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
        photos,
      },
      {
        onSuccess: () => {
          reset();
          setMaxReachedStep(TOTAL_STEPS);
          router.push(`/apply/step/${TOTAL_STEPS}`);
        },
      },
    );
  };

  return (
    <AppLayout
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-canvas)',
        color: 'var(--color-fg-normal)',
      }}
    >
      {/* 헤더 */}
      {!isComplete ? (
        <header
          style={{
            flexShrink: 0,
            background: 'var(--color-bg-canvas)',
            display: 'fixed',
            width: '100%',
            top: 0,
            left: 0,
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
                color: 'var(--color-fg-subtle)',
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
            aria-hidden="true"
            style={{ display: 'flex', gap: '6px', padding: '0 20px' }}
          >
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background:
                    step >= seg
                      ? 'var(--color-brand-interactive)'
                      : 'var(--color-border-normal)',
                  transition: 'background 0.2s ease',
                }}
              />
            ))}
          </div>

          <p
            style={{
              margin: 0,
              padding: 'var(--gap-xs) var(--screen-margin) var(--gap-sm)',
              fontSize: '12px',
              color: 'var(--color-fg-placeholder)',
            }}
          >
            {stepLabel}
          </p>
        </header>
      ) : null}

      {/* 스크롤 영역 */}
      <main
        style={{
          flex: 1,
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
            display: 'fixed',
            width: '100%',
            bottom: 0,
            left: 0,
            flexShrink: 0,
            padding: 'var(--gap-sm) var(--screen-margin) var(--gap-lg)',
            borderTop: '1px solid var(--color-border-normal)',
            background: 'var(--color-bg-canvas)',
          }}
        >
          {/* Step 1: 단일 버튼 */}
          {step === 1 ? (
            <Button
              disabled={
                verificationSent
                  ? !canNext || verifySubmitCode.isPending
                  : !canSendCode || requestSubmitCode.isPending
              }
              onClick={() => {
                if (!verificationSent) {
                  handleSendCode();
                } else {
                  handleVerifyCode();
                }
              }}
            >
              {requestSubmitCode.isPending
                ? '발송 중...'
                : verifySubmitCode.isPending
                  ? '확인 중...'
                  : verificationSent
                    ? '다음'
                    : '인증번호 받기'}
            </Button>
          ) : null}

          {/* Step 2–3: 이전 | 다음 */}
          {step === 2 || step === 3 ? (
            <ButtonPair
              leftButton={{
                children: '이전',
                onClick: () => router.push(`/apply/step/${step - 1}`),
              }}
              rightButton={{
                children: '다음',
                disabled:
                  step === 2
                    ? photos.length === 0
                    : !buildingType.trim() || !address.trim() || !area.trim(),
                onClick: () => {
                  setMaxReachedStep(step + 1);
                  router.push(`/apply/step/${step + 1}`);
                },
              }}
            />
          ) : null}

          {/* Step 4: 이전 | 다음(제출) */}
          {step === 4 ? (
            <>
              {createApplication.isError ? (
                <p
                  style={{
                    margin: '0 0 var(--gap-xs)',
                    color: 'var(--color-error)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                >
                  신청 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              ) : null}
              <ButtonPair
                leftButton={{
                  children: '이전',
                  onClick: () => router.push('/apply/step/3'),
                }}
                rightButton={{
                  children: createApplication.isPending ? '제출 중...' : '다음',
                  disabled: createApplication.isPending,
                  onClick: handleSubmit,
                }}
              />
            </>
          ) : null}
        </footer>
      ) : null}
    </AppLayout>
  );
}
