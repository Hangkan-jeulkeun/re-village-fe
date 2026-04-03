'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Box, HStack, IconButton, Text, Toast, VStack } from '@vapor-ui/core';
import { WarningIcon, CloseOutlineIcon } from '@vapor-ui/icons';
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
            width: '100%',
          }}
        >
          <HStack
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--gap-md) var(--gap-sm)',
              position: 'relative',
            }}
          >
            <IconButton
              aria-label="닫기"
              variant="ghost"
              style={{
                position: 'absolute',
                left: 'var(--gap-sm)',
                color: 'var(--color-fg-subtle)',
              }}
              onClick={() => router.push('/apply/landing')}
            >
              <CloseOutlineIcon size={22} />
            </IconButton>
            <Text typography="body1" style={{ fontWeight: 700 }}>
              빈집 서비스 신청하기
            </Text>
          </HStack>

          <HStack
            aria-hidden="true"
            style={{ gap: 'var(--gap-xs)', padding: '0 var(--screen-margin)' }}
          >
            {[1, 2, 3, 4].map((seg) => (
              <Box
                key={seg}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background:
                    step === seg
                      ? 'var(--color-brand-interactive)'
                      : step > seg
                        ? 'color-mix(in srgb, var(--color-brand-interactive) 35%, var(--color-bg-canvas))'
                        : 'var(--color-border-normal)',
                  transition:
                    'background var(--duration-fast) var(--ease-default)',
                }}
              />
            ))}
          </HStack>

          <Text
            typography="body2"
            style={{
              display: 'block',
              padding: 'var(--gap-xs) var(--screen-margin) var(--gap-sm)',
              color: 'var(--color-fg-placeholder)',
              textAlign: 'center',
            }}
          >
            {stepLabel}
          </Text>
        </header>
      ) : null}

      {/* 스크롤 영역 */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: 'var(--gap-lg) var(--screen-margin) var(--gap-md)',
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
            width: '100%',
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
            <VStack style={{ gap: 0 }}>
              {createApplication.isError ? (
                <Text
                  typography="body2"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--gap-xs)',
                    color: 'var(--color-error)',
                    textAlign: 'center',
                  }}
                >
                  신청 중 오류가 발생했습니다. 다시 시도해주세요.
                </Text>
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
            </VStack>
          ) : null}
        </footer>
      ) : null}
    </AppLayout>
  );
}
