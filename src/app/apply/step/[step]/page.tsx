'use client';

import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HStack, Text, Toast } from '@vapor-ui/core';
import { AttachFileOutlineIcon, CameraIcon } from '@vapor-ui/icons';
import Input from '@/components/common/inputs/Input';
import { HouseLoader } from '@/components/common/HouseLoader';
import { useExtractDocuments } from '@/features/applications/queries';
import { useApplyStore } from '@/stores/useApplyStore';
import { compressImageToMaxSize } from '@/utils/compressImageToMaxSize';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

const TOTAL_STEPS = 5;
const ANALYSIS_LABEL_STYLE = {
  color: 'var(--color-fg-subtle)',
  fontWeight: 600,
} as const;

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

const STEP_ICONS = [
  <Image
    key="step1"
    width={62}
    height={62}
    src="/icons/apply-step1-write.svg"
    alt="기본 정보 입력 아이콘"
  />,
  <Image
    key="step2"
    width={62}
    height={62}
    src="/icons/apply-step2-camera.svg"
    alt="건물 사진 업로드 아이콘"
  />,
  <Image
    key="step3"
    width={62}
    height={62}
    src="/icons/apply-step3-file.svg"
    alt="관련 서류 첨부 아이콘"
  />,
  <Image
    key="step4"
    width={62}
    height={62}
    src="/icons/apply-step4-check.svg"
    alt="신청 내용 확인 아이콘"
  />,
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
    photos,
    setName,
    setPhone,
    setAddress,
    setArea,
    setBuildingType,
    setVerificationCode,
    setPhotos,
  } = useApplyStore();
  const toastManager = Toast.useToastManager();
  const { mutate: extractDocuments, isPending: isExtracting } =
    useExtractDocuments();
  const previewUrls = useMemo(
    () => photos.map((file) => URL.createObjectURL(file)),
    [photos],
  );
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const justDroppedRef = useRef(false);

  useEffect(() => {
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) {
    notFound();
  }

  const content = STEP_CONTENT[step - 1];
  const isComplete = step === TOTAL_STEPS;
  const StepIcon = STEP_ICONS[step - 1] ?? null;

  const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
  const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;

    const valid: File[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        toastManager.add({
          title: '지원하지 않는 형식',
          description: `JPG, PNG 파일만 업로드할 수 있습니다 (${file.name})`,
          colorPalette: 'danger',
        });
        continue;
      }

      try {
        const normalizedFile = await compressImageToMaxSize(
          file,
          MAX_PHOTO_SIZE_BYTES,
        );

        if (normalizedFile.size > MAX_PHOTO_SIZE_BYTES) {
          toastManager.add({
            title: '파일 크기 초과',
            description: `파일 크기는 10MB 이하여야 합니다 (${file.name})`,
            colorPalette: 'danger',
          });
          continue;
        }

        if (normalizedFile !== file) {
          toastManager.add({
            title: '사진 용량을 자동으로 조절했어요',
            description: `${file.name} 파일을 업로드 가능한 크기로 줄였습니다.`,
            colorPalette: 'info',
          });
        }

        valid.push(normalizedFile);
      } catch {
        toastManager.add({
          title: '파일 크기 초과',
          description: `10MB 이하 사진만 업로드할 수 있습니다 (${file.name})`,
          colorPalette: 'danger',
        });
      }
    }

    if (valid.length > 0) {
      setPhotos([...photos, ...valid]);
    }
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleDeleteDocument = (index: number) => {
    setAttachedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setAttachedDocuments((prev) => [...prev, ...newFiles]);
    extractDocuments(newFiles, {
      onSuccess: (data) => {
        if (data.buildingType) setBuildingType(data.buildingType);
        if (data.address) setAddress(data.address);
        if (data.areaSqm !== undefined) setArea(String(data.areaSqm));
      },
      onError: () => {
        toastManager.add({
          title: '서류 분석에 실패했어요',
          colorPalette: 'danger',
          close: true,
        });
      },
    });
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
              typography="subtitle1"
              style={{
                marginTop: 'var(--gap-xs)',
                color: 'var(--color-fg-subtle)',
              }}
            >
              {content.description}
            </Text>
          </div>
          <div
            style={{
              alignSelf: 'end',
            }}
          >
            {StepIcon}
          </div>
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
            onChange={async (e) => {
              const input = e.currentTarget;
              await handlePhotoUpload(input.files);
              input.value = '';
            }}
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
              border: '1.5px dashed var(--color-border-primary)',
              borderRadius: '16px',
              background: 'var(--color-bg-canvas-sub)',
              cursor: 'pointer',
            }}
            onClick={() => photoInputRef.current?.click()}
          >
            <CameraIcon
              aria-hidden="true"
              style={{
                width: '28px',
                height: '28px',
                color: 'var(--color-brand-interactive)',
              }}
            />
            <strong
              style={{
                fontSize: 'var(--size-senior-label)',
                color: 'var(--color-brand-interactive)',
              }}
            >
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
            추가된 사진 ({photos.length})
          </Text>

          <div
            style={{ display: 'flex', gap: 'var(--gap-sm)', flexWrap: 'wrap' }}
          >
            {photos.map((photo, index) => (
              <div
                key={`${photo.name}-${index}`}
                style={{ position: 'relative', width: '72px', height: '72px' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrls[index]}
                  alt={photo.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'var(--size-senior-radius)',
                    border: '1px solid var(--color-border-normal)',
                    objectFit: 'cover',
                  }}
                />
                <button
                  type="button"
                  aria-label={`${photo.name} 삭제`}
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
                  onClick={() => handleDeletePhoto(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {isExtracting ? <HouseLoader label="서류 분석 중..." /> : null}

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

          <HStack style={{ gap: 'var(--gap-sm)', alignItems: 'stretch' }}>
            <button
              type="button"
              aria-label="첨부파일 추가"
              onClick={() => documentInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                flexShrink: 0,
                width: '72px',
                height: '64px',
                border: '2px solid var(--color-border-normal)',
                borderRadius: '16px',
                background: 'var(--color-bg-canvas)',
                cursor: 'pointer',
              }}
            >
              <AttachFileOutlineIcon
                aria-hidden="true"
                style={{ color: 'var(--color-fg-subtle)' }}
              />
              <Text
                typography="body3"
                style={{ color: 'var(--color-fg-subtle)' }}
              >
                첨부파일
              </Text>
            </button>

            <div
              role="button"
              tabIndex={0}
              aria-label="민간인증으로 서류 불러오기"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                justDroppedRef.current = true;
                handleDocumentUpload(e.dataTransfer.files);
              }}
              onClick={() => {
                if (justDroppedRef.current) {
                  justDroppedRef.current = false;
                  return;
                }
                const w = 480;
                const h = 720;
                const left = window.screenX + window.outerWidth - w - 20;
                const top = window.screenY + 60;
                window.open(
                  'https://plus.gov.kr/',
                  '_blank',
                  `noopener,width=${w},height=${h},left=${left},top=${top}`,
                );
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const w = 480;
                  const h = 720;
                  const left = window.screenX + window.outerWidth - w - 20;
                  const top = window.screenY + 60;
                  window.open(
                    'https://plus.gov.kr/',
                    '_blank',
                    `noopener,width=${w},height=${h},left=${left},top=${top}`,
                  );
                }
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '64px',
                border: `2px solid ${isDragOver ? 'var(--color-brand-interactive)' : 'var(--color-border-primary)'}`,
                borderRadius: '16px',
                background: isDragOver
                  ? 'var(--color-bg-canvas-sub)'
                  : 'var(--color-bg-canvas)',
                cursor: 'pointer',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--size-senior-font)',
                  fontWeight: 700,
                  color: 'var(--color-brand-interactive)',
                }}
              >
                민간인증으로 서류 불러오기
              </span>
            </div>
          </HStack>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--gap-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--size-space-050)',
              }}
            >
              <Text
                typography="body1"
                style={{ color: 'var(--color-error)', fontWeight: 700 }}
              >
                *
              </Text>
              <Text
                typography="body1"
                style={{ color: 'var(--color-fg-normal)', fontWeight: 700 }}
              >
                필수서류 (건축물대장)
              </Text>
            </div>

            {attachedDocuments.length === 0 ? (
              <Text
                typography="body2"
                style={{ color: 'var(--color-fg-placeholder)' }}
              >
                첨부된 파일이 없습니다
              </Text>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--gap-xs)',
                }}
              >
                {attachedDocuments.map((doc, index) => (
                  <div
                    key={`${doc.name}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--gap-sm)',
                      padding: '0 var(--gap-sm)',
                      minHeight: 'var(--size-senior-input)',
                      borderRadius: 'var(--size-senior-radius)',
                      border: '1px solid var(--color-border-normal)',
                      background: 'var(--color-bg-canvas-sub)',
                    }}
                  >
                    <Text
                      typography="body2"
                      style={{
                        color: 'var(--color-fg-subtle)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {doc.name}
                    </Text>
                    <button
                      type="button"
                      aria-label={`${doc.name} 삭제`}
                      onClick={() => handleDeleteDocument(index)}
                      style={{
                        flexShrink: 0,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: 0,
                        background: 'var(--color-fg-subtle)',
                        color: 'var(--color-fg-inverse)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--gap-md)',
              marginTop: 'var(--gap-xl)',
              paddingTop: 'var(--gap-lg)',
              borderTop: '1px solid var(--color-border-normal)',
            }}
          >
            <Text
              typography="body1"
              style={{
                color: 'var(--color-fg-subtle)',
                fontWeight: 700,
              }}
            >
              서류 분석 결과
            </Text>

            <Input
              id="buildingType"
              label="건물 종류"
              labelTextStyle={ANALYSIS_LABEL_STYLE}
              placeholder={
                isExtracting ? '분석 중...' : '서류 첨부 후 자동 입력'
              }
              value={buildingType}
              readOnly
              onChange={(e) => setBuildingType(e.target.value)}
            />

            <Input
              id="address"
              label="주소"
              labelTextStyle={ANALYSIS_LABEL_STYLE}
              placeholder={
                isExtracting ? '분석 중...' : '서류 첨부 후 자동 입력'
              }
              value={address}
              readOnly
              onChange={(e) => setAddress(e.target.value)}
            />

            <Input
              id="area"
              label="면적 (m²)"
              labelTextStyle={ANALYSIS_LABEL_STYLE}
              inputMode="decimal"
              placeholder={
                isExtracting ? '분석 중...' : '서류 첨부 후 자동 입력'
              }
              value={area}
              readOnly
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
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

              {/* 건물 사진 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: 'var(--gap-xs)',
                  fontSize: 'var(--size-senior-label)',
                }}
              >
                <dt style={{ color: 'var(--color-fg-placeholder)' }}>
                  건물 사진
                </dt>
                <dd
                  style={{
                    margin: 0,
                    color: 'var(--color-fg-normal)',
                    fontWeight: 500,
                  }}
                >
                  {photos.length === 0 ? '—' : `${photos.length}장 첨부`}
                </dd>
              </div>
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
          <Image
            style={{ width: '160px', height: '160px', paddingBottom: '24px' }}
            src="/images/home-type1-damBat.png"
            alt="신청 완료 일러스트"
            width={160}
            height={160}
          />
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
