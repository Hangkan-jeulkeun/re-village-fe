'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from '@vapor-ui/core';
import { useRequestCode, useVerifyCode } from '@/features/applications/queries';
import { useAuthStore } from '@/stores/useAuthStore';

type Step = 'login' | 'verify';

export default function AdminLoginPage() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const requestCode = useRequestCode();
  const verifyCode = useVerifyCode();

  const [step, setStep] = useState<Step>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await requestCode.mutateAsync({ name, phone });
      setStep('verify');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '인증 코드 요청 실패');
    }
  };

  const handleVerify = async () => {
    setError('');
    try {
      const tokens = await verifyCode.mutateAsync({
        name,
        phone,
        code: verificationCode,
      });
      setTokens(tokens);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '인증 실패');
    }
  };

  const isLoading = requestCode.isPending || verifyCode.isPending;

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background:
          'radial-gradient(circle at top right, rgb(49 116 220 / 0.12), transparent 24%), linear-gradient(180deg, #f5f8fc 0%, #eef2f7 100%)',
      }}
    >
      {/* 로고 */}
      <h1
        style={{
          fontSize: '42px',
          fontWeight: '700',
          color: '#2a2e54',
          marginBottom: '56px',
          margin: '0 0 56px 0',
          letterSpacing: '0.5px',
        }}
      >
        한 집 줄클 Admin
      </h1>

      {/* 폼 */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '48px',
          backgroundColor: '#ffffff',
          border: '1px solid #dce4ee',
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        }}
      >
        {step === 'login' ? (
          <>
            {/* 이름 입력 */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#2a2e54',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                이름
              </label>
              <TextInput
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 14px',
                  fontSize: '15px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #dce4ee',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  color: '#2a2e54',
                }}
              />
            </div>

            {/* 휴대폰 입력 */}
            <div style={{ marginBottom: '28px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#2a2e54',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                휴대폰 번호
              </label>
              <TextInput
                type="text"
                placeholder="01012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !isLoading && name && phone)
                    handleLogin();
                }}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 14px',
                  fontSize: '15px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #dce4ee',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  color: '#2a2e54',
                }}
              />
            </div>

            {/* 에러 */}
            {error && (
              <div
                style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '20px',
                  padding: '12px 14px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                }}
              >
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <Button
              color="primary"
              onClick={handleLogin}
              disabled={isLoading || !name || !phone}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              {isLoading ? '전송 중...' : '로그인'}
            </Button>
          </>
        ) : (
          <>
            {/* 검증 코드 입력 */}
            <div style={{ marginBottom: '28px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#2a2e54',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                인증 코드
              </label>
              <TextInput
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, '').slice(0, 6),
                  )
                }
                disabled={isLoading}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (
                    e.key === 'Enter' &&
                    !isLoading &&
                    verificationCode.length === 6
                  )
                    handleVerify();
                }}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 14px',
                  fontSize: '20px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #dce4ee',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontWeight: '600',
                  color: '#2a2e54',
                }}
              />
            </div>

            {/* 에러 */}
            {error && (
              <div
                style={{
                  color: '#dc2626',
                  fontSize: '13px',
                  marginBottom: '20px',
                  padding: '12px 14px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                }}
              >
                {error}
              </div>
            )}

            {/* 버튼 그룹 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('login');
                  setVerificationCode('');
                  setError('');
                }}
                disabled={isLoading}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                }}
              >
                이전
              </Button>
              <Button
                color="primary"
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length !== 6}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                }}
              >
                {isLoading ? '인증 중...' : '확인'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
