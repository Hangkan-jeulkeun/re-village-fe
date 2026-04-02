'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useRef, useState } from 'react';
// verificationCode·codeError는 useApplyStore에서 관리
import type { ComponentType, SVGProps } from 'react';
import { Text } from '@vapor-ui/core';
import {
  EditOutlineIcon,
  CameraOutlineIcon,
  DocumentViewerOutlineIcon,
  SearchOutlineIcon,
} from '@vapor-ui/icons';
import Input from '@/components/common/inputs/Input';
import { useApplyStore } from '@/stores/useApplyStore';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

type StepIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const TOTAL_STEPS = 5;

const STEP_CONTENT = [
  {
    title: '기본 정보를\n입력해주세요',
    description: '신청자 확인을 위해 사용됩니다',
  },
  {
    title: '건물 사진을\n올려주세요',
    description: '외관 사진을 첨부해주세요',
  },
  {
    title: '관련 서류를\n첨부해주세요',
    description: '자동으로 내용이 입력됩니다',
  },
  {
    title: '신청 내용을\n확인해주세요',
    description: '자동으로 내용이 입력됩니다',
  },
  {
    title: '신청이 완료되었어요!',
    description: '검토 후 등록된 전화번호로\n안내 드리겠습니다',
  },
] as const;

const STEP_ICONS: Array<StepIconComponent | null> = [
  EditOutlineIcon,
  CameraOutlineIcon,
  DocumentViewerOutlineIcon,
  SearchOutlineIcon,
  null,
];

/* 토큰 없는 주황 accent는 그대로, 파란 accent는 brand-interactive 참조 */
const STEP_ICON_COLORS = [
  '#e07020',
  'var(--color-brand-interactive)',
  '#e07020',
  'var(--color-brand-interactive)',
  null,
];

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
    verificationCode,
    codeError,
    setName,
    setPhone,
    setAddress,
    setArea,
    setBuildingType,
    setVerificationCode,
  } = useApplyStore();
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
  const StepIcon = STEP_ICONS[step - 1] ?? null;
  const stepIconColor = STEP_ICON_COLORS[step - 1] ?? undefined;

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
      {!isComplete ? (
        <section
          style={{
            marginBottom: 'var(--gap-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--gap-md)',
            borderRadius: '16px',
            background: 'var(--color-bg-canvas-sub)',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Text
              typography="heading2"
              style={{
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: 'pre-line',
                color: 'var(--color-fg-normal)',
              }}
            >
              {content.title}
            </Text>
            <Text
              typography="body2"
              style={{
                marginTop: 'var(--gap-xs)',
                color: 'var(--color-fg-subtle)',
                lineHeight: 1.6,
              }}
            >
              {content.description}
            </Text>
          </div>
          {StepIcon ? (
            <StepIcon
              aria-hidden="true"
              style={{
                width: '64px',
                height: '64px',
                color: stepIconColor,
                flexShrink: 0,
                marginLeft: 'var(--gap-sm)',
              }}
            />
          ) : null}
        </section>
      ) : null}

      {/* Step 1 – 기본 정보 */}
      {step === 1 ? (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gap-md)',
          }}
        >
          <Input
            id="name"
            label="이름"
            required
            placeholder="예: 우디"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            label="전화번호"
            required
            placeholder="예: 010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            description="신청 결과 안내에 사용됩니다"
          />
          {verificationSent ? (
            <Input
              id="code"
              inputMode="numeric"
              label="인증번호"
              required
              placeholder="여섯자리를 입력하세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              error={codeError || undefined}
            />
          ) : null}
        </section>
      ) : null}

      {/* Step 2 – 건물 사진 */}
      {step === 2 ? (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gap-md)',
          }}
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
              gap: 'var(--gap-xs)',
              height: '154px',
              border: '1.5px dashed var(--color-border-normal)',
              borderRadius: '16px',
              background: 'var(--color-bg-canvas-sub)',
              cursor: 'pointer',
            }}
            onClick={() => photoInputRef.current?.click()}
          >
            <span style={{ fontSize: '28px' }}>📷</span>
            <strong style={{ fontSize: 'var(--size-senior-label)' }}>
              사진 추가하기
            </strong>
            <p
              style={{
                margin: 0,
                color: 'var(--color-fg-placeholder)',
                fontSize: '14px',
              }}
            >
              JPG, PNG (최대 10MB)
            </p>
          </button>

          <Text
            typography="body2"
            style={{ color: 'var(--color-fg-normal)', fontWeight: 700 }}
          >
            추가된 사진 ({uploadedPhotos.length})
          </Text>

          <div
            style={{ display: 'flex', gap: 'var(--gap-sm)', flexWrap: 'wrap' }}
          >
            {uploadedPhotos.map((photo) => (
              <div
                key={photo}
                style={{ position: 'relative', width: '72px', height: '72px' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'var(--size-senior-radius)',
                    border: '1px solid var(--color-border-normal)',
                    background: 'var(--color-bg-canvas-sub)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 'var(--gap-xs)',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      fontSize: '9px',
                      color: 'var(--color-fg-subtle)',
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
                    background: 'var(--color-fg-normal)',
                    color: 'var(--color-fg-inverse)',
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gap-md)',
          }}
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
              height: 'var(--size-senior-btn)',
              border:
                'var(--size-senior-border) solid var(--color-border-primary)',
              borderRadius: 'var(--size-senior-radius)',
              background: 'var(--color-bg-canvas)',
              color: 'var(--color-fg-primary)',
              fontSize: 'var(--size-senior-font)',
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
                padding: 'var(--gap-sm) var(--gap-md)',
                border: '1px solid var(--color-brand-light)',
                borderRadius: 'var(--size-senior-radius)',
                background: 'var(--color-bg-primary-100)',
                fontSize: '14px',
                color: 'var(--color-fg-primary)',
              }}
            >
              민간인증 연계 완료 — 건물 정보가 자동 입력되었습니다.
            </div>
          ) : null}

          {attachedDocuments.length > 0 ? (
            <ul
              style={{
                display: 'grid',
                gap: 'var(--gap-xs)',
                paddingLeft: 'var(--gap-md)',
                color: 'var(--color-fg-subtle)',
                fontSize: 'var(--size-senior-label)',
              }}
            >
              {attachedDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          ) : null}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--gap-xs)',
            }}
          >
            <label
              style={{
                fontSize: 'var(--size-senior-label)',
                fontWeight: 700,
                color: 'var(--color-fg-normal)',
              }}
              htmlFor="buildingType"
            >
              건물 종류
            </label>
            <select
              id="buildingType"
              style={{
                width: '100%',
                height: 'var(--size-senior-input)',
                padding: '0 var(--gap-md)',
                border:
                  'var(--size-senior-border) solid var(--color-border-normal)',
                borderRadius: 'var(--size-senior-radius)',
                background: 'var(--color-bg-canvas)',
                fontSize: 'var(--size-senior-font)',
                color: buildingType
                  ? 'var(--color-fg-normal)'
                  : 'var(--color-fg-placeholder)',
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
          </div>

          <Input
            id="address"
            label="주소"
            placeholder="예: 제주특별자치도 서귀포시..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input
            id="area"
            label="면적 (m²)"
            inputMode="decimal"
            placeholder="예: 84.5"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </section>
      ) : null}

      {/* Step 4 – 신청 내용 확인 */}
      {step === 4 ? (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gap-md)',
          }}
        >
          <div
            style={{
              padding: 'var(--gap-md)',
              border: '1px solid var(--color-border-normal)',
              borderRadius: '16px',
              background: 'var(--color-bg-canvas-sub)',
            }}
          >
            <dl
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--gap-md)',
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
                    gap: 'var(--gap-xs)',
                    fontSize: 'var(--size-senior-label)',
                  }}
                >
                  <dt style={{ color: 'var(--color-fg-placeholder)' }}>{dt}</dt>
                  <dd
                    style={{
                      margin: 0,
                      color: 'var(--color-fg-normal)',
                      fontWeight: 500,
                    }}
                  >
                    {dd}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: 'var(--color-fg-placeholder)',
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
            padding: '0 var(--gap-xs)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'var(--color-bg-canvas-sub)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              marginBottom: 'var(--gap-xl)',
            }}
          >
            🏡
          </div>

          <Text
            typography="heading2"
            style={{
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--color-fg-normal)',
              marginBottom: 'var(--gap-sm)',
            }}
          >
            {content.title}
          </Text>
          <Text
            typography="body2"
            style={{
              color: 'var(--color-fg-subtle)',
              textAlign: 'center',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              marginBottom: 'var(--gap-sm)',
            }}
          >
            {content.description}
          </Text>
          <div
            style={{
              padding: 'var(--gap-xs) var(--gap-md)',
              borderRadius: 'var(--size-senior-radius)',
              background: 'var(--color-bg-canvas-sub)',
              marginBottom: 'var(--gap-2xl)',
            }}
          >
            <Text
              typography="body3"
              style={{
                color: 'var(--color-fg-placeholder)',
                textAlign: 'center',
              }}
            >
              신청 처리까지 영업일 기준 3-5일 소요될 수 있습니다
            </Text>
          </div>

          <Link
            href="/lookup/history"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 'var(--size-senior-btn)',
              borderRadius: 'var(--size-senior-radius)',
              background: 'var(--color-brand-interactive)',
              color: 'var(--color-fg-inverse)',
              fontWeight: 700,
              fontSize: 'var(--size-senior-font)',
            }}
          >
            신청 내역 보기
          </Link>
        </section>
      ) : null}
    </>
  );
}
