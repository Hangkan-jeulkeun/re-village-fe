'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, HStack, Text, VStack } from '@vapor-ui/core';

import Button from '@/components/common/base/Button';
import Input from '@/components/common/inputs/Input';
import { useRequestCode, useVerifyCode } from '@/features/applications/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import type { TokenResponse } from '@/types/auth';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import styles from './PhoneVerificationForm.module.css';

function extractTokens(payload: unknown): TokenResponse | null {
  if (!payload || typeof payload !== 'object') return null;

  if ('accessToken' in payload && 'refreshToken' in payload) {
    const accessToken = payload.accessToken;
    const refreshToken = payload.refreshToken;

    if (typeof accessToken === 'string' && typeof refreshToken === 'string') {
      return { accessToken, refreshToken };
    }
  }

  if ('data' in payload) {
    return extractTokens(payload.data);
  }

  return null;
}

export function PhoneVerificationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const redirectTo = searchParams.get('redirect') || '/lookup/history';

  const { mutate: requestCode, isPending: isRequestingCode } = useRequestCode();

  const { mutate: verifyCode, isPending: isVerifying } = useVerifyCode();

  function handleRequestCode() {
    requestCode({ name, phone }, { onSuccess: () => setCodeSent(true) });
  }

  function handleVerify() {
    verifyCode(
      { name, phone, code },
      {
        onSuccess: (payload) => {
          const tokens = extractTokens(payload);

          if (tokens) {
            setTokens(tokens);
          }

          router.push(redirectTo);
        },
      },
    );
  }

  const canVerify = codeSent && code.trim().length > 0 && !isVerifying;

  return (
    <Box
      style={{
        width: '100%',
        maxWidth: '36rem',
        padding: 'var(--size-space-350) var(--size-space-275)',
        border: '1px solid var(--color-border-normal)',
        borderRadius: 'calc(var(--size-space-250) + var(--size-050))',
        background: 'var(--color-bg-canvas)',
        boxShadow: '0 18px 42px rgb(15 23 42 / 0.08)',
      }}
    >
      <VStack style={{ gap: 'var(--size-space-300)' }}>
        <VStack style={{ gap: 'var(--size-space-100)' }}>
          <Text
            typography="heading5"
            style={{
              color: 'var(--color-fg-primary)',
            }}
          >
            유저 인증 만료
          </Text>
          <Text
            typography="heading3"
            style={{
              color: 'var(--color-fg-normal)',
            }}
          >
            휴대폰 번호 인증
          </Text>
          <Text
            typography="body2"
            style={{
              color: 'var(--color-fg-subtle)',
              lineHeight: 1.6,
              wordBreak: 'keep-all',
            }}
          >
            신청 시 입력한 휴대폰 번호와 인증번호를 입력하면 본인 신청 건을
            조회할 수 있습니다.
          </Text>
        </VStack>

        <VStack style={{ gap: 'var(--size-space-100)' }}>
          <Input
            name="name"
            label="이름"
            placeholder="이름 입력"
            inputClassName={styles.placeholderInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <HStack
            style={{
              width: '100%',
              alignItems: 'stretch',
              gap: 'var(--size-space-100)',
            }}
          >
            <Box style={{ flex: '1 1 0', minWidth: 0 }}>
              <Input
                name="phone"
                label="휴대폰 번호"
                placeholder="휴대폰 번호 입력"
                inputClassName={styles.placeholderInput}
                value={phone}
                inputMode="tel"
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              />
            </Box>
            <Box
              style={{
                width:
                  'calc(var(--size-space-600) * 2 + var(--size-space-050))',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: 'var(--size-space-150)',
              }}
            >
              <Button
                type="button"
                size="md"
                disabled={!name || !phone || isRequestingCode}
                onClick={handleRequestCode}
                style={{
                  minHeight: 'var(--size-senior-input)',
                  borderRadius: 'var(--size-senior-radius)',
                  padding: '0 var(--size-space-150)',
                }}
              >
                <Text
                  typography="body1"
                  style={{ color: 'var(--color-white)' }}
                >
                  인증번호 받기
                </Text>
              </Button>
            </Box>
          </HStack>

          <Input
            name="code"
            label="인증번호"
            placeholder="인증번호 6자리 입력"
            inputClassName={styles.placeholderInput}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </VStack>

        <Button
          type="button"
          disabled={!canVerify}
          onClick={handleVerify}
          style={{
            marginTop: 'var(--size-space-050)',
          }}
        >
          조회하기
        </Button>
      </VStack>
    </Box>
  );
}
