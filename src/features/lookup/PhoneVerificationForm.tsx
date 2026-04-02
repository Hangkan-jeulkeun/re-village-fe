'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Text, TextInput } from '@vapor-ui/core';

import { useRequestCode, useVerifyCode } from '@/features/applications/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import type { TokenResponse } from '@/types/auth';

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
    <section
      style={{
        width: '100%',
        padding: 'var(--size-space-350) var(--size-space-275)',
        border: '1px solid #e3e8ef',
        borderRadius: '24px',
        background: '#ffffff',
      }}
    >
      <Text typography="heading3" style={{ fontWeight: 700 }}>
        휴대폰 인증번호로 조회
      </Text>
      <Text
        typography="body2"
        style={{ marginTop: '10px', color: '#667085', lineHeight: 1.6 }}
      >
        신청 시 입력한 휴대폰 번호와 인증번호를 입력하면 본인 신청 건을 조회할
        수 있습니다.
      </Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginTop: '14px',
        }}
      >
        <TextInput
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ height: '52px', borderRadius: '14px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <TextInput
            placeholder="휴대폰 번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1, height: '52px', borderRadius: '14px' }}
          />
          <Button
            size="md"
            color="primary"
            disabled={!name || !phone || isRequestingCode}
            onClick={handleRequestCode}
            style={{ height: '52px', borderRadius: '14px', flexShrink: 0 }}
          >
            인증번호 받기
          </Button>
        </div>
        <TextInput
          placeholder="인증번호 6자리"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ height: '52px', borderRadius: '14px' }}
        />
      </div>
      <Button
        size="lg"
        color="primary"
        disabled={!canVerify}
        onClick={handleVerify}
        style={{
          width: '100%',
          height: '54px',
          marginTop: '18px',
          borderRadius: '16px',
        }}
      >
        조회하기
      </Button>
    </section>
  );
}
