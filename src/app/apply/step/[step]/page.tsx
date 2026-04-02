'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Text, TextInput } from '@vapor-ui/core';
import { useApplyStore } from '@/stores/useApplyStore';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

const TOTAL_STEPS = 5;

const STEP_CONTENT = [
  {
    title: '기본 정보를 입력해주세요',
    description: '신청자 확인을 위해 사용됩니다',
  },
  {
    title: '건물 사진을 올려주세요',
    description: '외관 사진을 첨부해주세요',
  },
  {
    title: '관련 서류를 첨부해주세요',
    description: '자동으로 내용이 입력됩니다',
  },
  {
    title: '신청 내용을 확인해주세요',
    description: '자동으로 내용이 입력됩니다',
  },
  {
    title: '신청이 완료되었어요!',
    description: '검토 후 등록된 전화번호로\n안내 드리겠습니다',
  },
] as const;

export default function ApplyStepPage() {
  const params = useParams<{ step: string }>();
  const step = Number(params.step);

  const {
    name,
    phone,
    address,
    area,
    buildingType,
    verificationSent,
    setName,
    setPhone,
    setAddress,
    setArea,
    setBuildingType,
  } = useApplyStore();

  const [verificationCode, setVerificationCode] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([
    '건물전경_01.jpg',
    '건물전경_02.jpg',
  ]);
  const [attachedDocuments, setAttachedDocuments] = useState<string[]>([]);
  const [governmentLinked, setGovernmentLinked] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) {
    notFound();
  }

  const content = STEP_CONTENT[step - 1];
  const isComplete = step === TOTAL_STEPS;

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;
    setUploadedPhotos((prev) => [
      ...prev,
      ...Array.from(files).map((f) => f.name),
    ]);
  };

  const handleDeletePhoto = (target: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p !== target));
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) return;
    setAttachedDocuments((prev) => [
      ...prev,
      ...Array.from(files).map((f) => f.name),
    ]);
  };

  const handlePrivateCertSimulation = () => {
    window.setTimeout(() => {
      setGovernmentLinked(true);
      setAttachedDocuments(['건축물대장.pdf', '토지대장.pdf']);
      setBuildingType('단독 주택');
      setAddress('제주특별자치도 서귀포시 강정동 230번지');
      setArea('84.5');
    }, 500);
  };

  return (
    <>
      {/* 타이틀 & 설명 */}
      <section style={{ marginBottom: '28px' }}>
        <Text
          typography="heading2"
          style={{ fontWeight: 700, lineHeight: 1.3 }}
        >
          {content.title}
        </Text>
        <Text
          typography="body2"
          style={{
            marginTop: '8px',
            color: '#6b7280',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {content.description}
        </Text>
      </section>

      {/* Step 1 – 기본 정보 */}
      {step === 1 ? (
        <section
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <label
            style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
            htmlFor="name"
          >
            이름 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <TextInput
            id="name"
            placeholder="예: 우디"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ height: '50px', borderRadius: '12px' }}
          />

          <label
            style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
            htmlFor="phone"
          >
            전화번호 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <TextInput
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="예: 010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            style={{ height: '50px', borderRadius: '12px' }}
          />
          <Text typography="body3" style={{ color: '#74829a' }}>
            신청 결과 안내에 사용됩니다
          </Text>

          {verificationSent ? (
            <>
              <label
                style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
                htmlFor="code"
              >
                인증번호 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <TextInput
                id="code"
                inputMode="numeric"
                placeholder="여섯자리를 입력하세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{ height: '50px', borderRadius: '12px' }}
              />
            </>
          ) : null}
        </section>
      ) : null}

      {/* Step 2 – 건물 사진 */}
      {step === 2 ? (
        <section
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <input
            ref={photoInputRef}
            type="file"
            accept="image/png,image/jpeg"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoUpload(e.target.files)}
          />
          <button
            type="button"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '154px',
              border: '1.5px dashed #d4dbe6',
              borderRadius: '16px',
              background: '#fafbfd',
              cursor: 'pointer',
            }}
            onClick={() => photoInputRef.current?.click()}
          >
            <span style={{ fontSize: '28px' }}>📷</span>
            <strong style={{ fontSize: '15px' }}>사진 추가하기</strong>
            <p style={{ margin: 0, color: '#98a2b3', fontSize: '13px' }}>
              JPG, PNG (최대 10MB)
            </p>
          </button>

          <Text
            typography="body3"
            style={{ color: '#344054', fontWeight: 700 }}
          >
            추가된 사진 ({uploadedPhotos.length})
          </Text>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uploadedPhotos.map((photo) => (
              <div
                key={photo}
                style={{ position: 'relative', width: '72px', height: '72px' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    border: '1px solid #dce4ee',
                    background: '#f0f4f8',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '6px',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '9px',
                      color: '#344054',
                      wordBreak: 'break-all',
                      lineHeight: 1.3,
                      textAlign: 'center',
                    }}
                  >
                    {photo}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`${photo} 삭제`}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: 0,
                    background: '#344054',
                    color: '#ffffff',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleDeletePhoto(photo)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Step 3 – 관련 서류 */}
      {step === 3 ? (
        <section
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleDocumentUpload(e.target.files)}
          />

          <button
            type="button"
            style={{
              height: '52px',
              border: '1px solid #2368b7',
              borderRadius: '12px',
              background: '#ffffff',
              color: '#2368b7',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (!governmentLinked) {
                handlePrivateCertSimulation();
              } else {
                documentInputRef.current?.click();
              }
            }}
          >
            {governmentLinked
              ? '추가 서류 첨부하기'
              : '민간인증으로 서류 불러오기'}
          </button>

          {governmentLinked ? (
            <div
              style={{
                padding: '12px 16px',
                border: '1px solid #cfe0ff',
                borderRadius: '12px',
                background: '#edf4ff',
                fontSize: '13px',
                color: '#1d4e9d',
              }}
            >
              민간인증 연계 완료 — 건물 정보가 자동 입력되었습니다.
            </div>
          ) : null}

          {attachedDocuments.length > 0 ? (
            <ul
              style={{
                display: 'grid',
                gap: '6px',
                paddingLeft: '16px',
                color: '#344054',
                fontSize: '14px',
              }}
            >
              {attachedDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          ) : null}

          <label
            style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
            htmlFor="buildingType"
          >
            건물 종류
          </label>
          <select
            id="buildingType"
            style={{
              width: '100%',
              height: '50px',
              padding: '0 16px',
              border: '1px solid #d9e1ea',
              borderRadius: '12px',
              background: '#ffffff',
              fontSize: '15px',
              color: buildingType ? '#161616' : '#98a2b3',
            }}
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
          >
            <option value="" disabled>
              Placeholder
            </option>
            <option value="단독 주택">단독 주택</option>
            <option value="다가구 주택">다가구 주택</option>
            <option value="근린 생활 시설">근린 생활 시설</option>
          </select>

          <label
            style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
            htmlFor="address"
          >
            주소
          </label>
          <TextInput
            id="address"
            placeholder="예: 제주특별자치도 서귀포시..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ height: '50px', borderRadius: '12px' }}
          />

          <label
            style={{ fontSize: '14px', fontWeight: 700, color: '#344054' }}
            htmlFor="area"
          >
            면적 (m²)
          </label>
          <TextInput
            id="area"
            inputMode="decimal"
            placeholder="예: 84.5"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{ height: '50px', borderRadius: '12px' }}
          />
        </section>
      ) : null}

      {/* Step 4 – 신청 내용 확인 */}
      {step === 4 ? (
        <section
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div
            style={{
              padding: '20px 16px',
              border: '1px solid #d8e0ea',
              borderRadius: '16px',
              background: '#fbfcff',
            }}
          >
            <dl
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                margin: 0,
              }}
            >
              {[
                { dt: '신청자', dd: name || '—' },
                { dt: '전화번호', dd: phone || '—' },
                { dt: '건물 종류', dd: buildingType || '—' },
                { dt: '주소', dd: address || '—' },
                { dt: '면적', dd: area ? `${area} m²` : '—' },
                { dt: '건물 사진', dd: `${uploadedPhotos.length}장 첨부` },
              ].map(({ dt, dd }) => (
                <div
                  key={dt}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                >
                  <dt style={{ color: '#74829a' }}>{dt}</dt>
                  <dd style={{ margin: 0, color: '#161616', fontWeight: 500 }}>
                    {dd}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#98a2b3',
              textAlign: 'center',
            }}
          >
            제출 후에는 신청완료 상태일 때만 취소할 수 있습니다
          </p>
        </section>
      ) : null}

      {/* Step 5 – 완료 */}
      {isComplete ? (
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '24px',
              background: '#f0f4f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              marginBottom: '32px',
            }}
          >
            🏡
          </div>

          <Text
            typography="heading1"
            style={{
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            {content.title}
          </Text>
          <Text
            typography="body2"
            style={{
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              marginBottom: '8px',
            }}
          >
            {content.description}
          </Text>
          <Text
            typography="body3"
            style={{
              color: '#98a2b3',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            신청 처리까지 영업일 기준 3-5일 소요될 수 있습니다
          </Text>

          <Link
            href="/my-applications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '54px',
              borderRadius: '14px',
              background: '#1f66b3',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            신청 내역 보기
          </Link>
        </section>
      ) : null}
    </>
  );
}
