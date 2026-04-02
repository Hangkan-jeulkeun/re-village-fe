'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Text, TextInput } from '@vapor-ui/core';

import {
  useRequestLookupCode,
  useRequestSubmitCode,
  useVerifyAndLookup,
} from '@/features/applications/queries';

export function PhoneVerificationForm() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (expiryTimerRef.current !== null) clearTimeout(expiryTimerRef.current);
    };
  }, []);

  const router = useRouter();

  const { mutate: requestCode, isPending: isRequestingCode } =
    useRequestSubmitCode();

  const { mutate: verifyAndLookup, isPending: isVerifying } =
    useVerifyAndLookup();

  function handleRequestCode() {
    requestCode(
      { phone },
      {
        onSuccess: (data) => {
          setSentCode(data?.code ?? null);
          setIsExpired(false);
          if (expiryTimerRef.current !== null)
            clearTimeout(expiryTimerRef.current);
          expiryTimerRef.current = setTimeout(
            () => setIsExpired(true),
            (data?.expiresInSeconds ?? 0) * 1000,
          );
        },
      },
    );
  }

  function handleVerify() {
    verifyAndLookup(
      { phone, code },
      { onSuccess: () => router.push('/lookup/history') },
    );
  }

  const isCodeMatched = sentCode !== null && code === sentCode;
  const canVerify = isCodeMatched && !isExpired && !isVerifying;

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
            disabled={!phone || isRequestingCode}
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
