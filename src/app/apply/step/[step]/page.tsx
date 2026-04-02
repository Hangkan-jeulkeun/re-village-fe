"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Button, Text, TextInput } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const TOTAL_STEPS = 5;

const STEP_CONTENT = [
  {
    title: "기본 정보를 입력해주세요",
    description: "신청자 확인을 위해 사용됩니다",
  },
  {
    title: "건물 사진을 올려주세요",
    description: "건물 외관 사진을 1장 이상 첨부해주세요",
  },
  {
    title: "관련 서류를 첨부해주세요",
    description: "주소와 면적, 건물 종류를 함께 입력해주세요",
  },
  {
    title: "신청 내용을 확인해주세요",
    description: "입력한 정보와 첨부 사진을 마지막으로 점검합니다",
  },
  {
    title: "신청이 완료되었어요",
    description: "접수 후 처리 상태는 신청 내역에서 계속 확인할 수 있습니다",
  },
] as const;

export default function ApplyStepPage() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const step = Number(params.step);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([
    "건물전경_01.jpg",
    "건물전경_02.jpg",
  ]);
  const [attachedDocuments, setAttachedDocuments] = useState<string[]>([]);
  const [governmentLinked, setGovernmentLinked] = useState(false);
  const [buildingType, setBuildingType] = useState("단독 주택");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) {
    notFound();
  }

  const progress = `${(step / TOTAL_STEPS) * 100}%`;
  const content = STEP_CONTENT[step - 1];
  const isComplete = step === TOTAL_STEPS;

  const nextHref = useMemo(() => {
    if (step === TOTAL_STEPS) {
      return "/";
    }

    return `/apply/step/${step + 1}`;
  }, [step]);

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) {
      return;
    }

    setUploadedPhotos((previous) => [
      ...previous,
      ...Array.from(files).map((file) => file.name),
    ]);
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (!files) {
      return;
    }

    setAttachedDocuments((previous) => [
      ...previous,
      ...Array.from(files).map((file) => file.name),
    ]);
  };

  const handleGovernment24Simulation = () => {
    window.open(
      "https://www.gov.kr",
      "gov24-simulation",
      "width=480,height=760,noopener,noreferrer",
    );

    window.setTimeout(() => {
      setGovernmentLinked(true);
      setAttachedDocuments([
        "정부24_건축물대장.pdf",
        "정부24_토지대장.pdf",
      ]);
      setBuildingType("단독 주택");
      setAddress("제주특별자치도 서귀포시 강정동 000번지");
      setArea("84㎡");
    }, 500);
  };

  return (
    <AppLayout
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#161616",
      }}
    >
      {!isComplete ? (
        <>
          <header style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px 18px" }}>
            <button
              type="button"
              style={{ position: "absolute", left: "20px", border: 0, background: "transparent", fontSize: "30px", cursor: "pointer" }}
              onClick={() => {
                if (step === 1) {
                  router.push("/apply/landing");
                  return;
                }

                router.push(`/apply/step/${step - 1}`);
              }}
              aria-label="이전 단계"
            >
              ←
            </button>
            <Text typography="heading4" style={{ fontWeight: 700 }}>
              신청자 정보
            </Text>
            <span style={{ position: "absolute", right: "20px", color: "#98a2b3", fontSize: "14px", fontWeight: 600 }}>
              {step} / {TOTAL_STEPS}
            </span>
          </header>

          <div style={{ width: "100%", height: "6px", background: "#ebeff5" }} aria-hidden="true">
            <div style={{ width: progress, height: "100%", background: "#2368b7" }} />
          </div>
        </>
      ) : null}

      <main style={{ flex: 1, padding: "36px 20px 24px" }}>
        <section style={{ marginBottom: "28px" }}>
          <Text typography="heading2" style={{ fontWeight: 700, lineHeight: 1.2 }}>
            {content.title}
          </Text>
          <Text typography="body2" style={{ marginTop: "10px", color: "#6b7280", lineHeight: 1.65 }}>
            {content.description}
          </Text>
        </section>

        {step === 1 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ fontSize: "15px", fontWeight: 700 }} htmlFor="name">
              이름 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <TextInput id="name" placeholder="예: 홍길동" style={{ height: "50px", borderRadius: "14px" }} />

            <label style={{ fontSize: "15px", fontWeight: 700 }} htmlFor="phone">
              전화번호 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <TextInput
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="예: 010-4473-3342"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(formatPhoneNumber(event.target.value));
              }}
              style={{ height: "50px", borderRadius: "14px" }}
            />
            <Text typography="body3" style={{ color: "#74829a", lineHeight: 1.5 }}>
              신청 결과 안내에 사용됩니다
            </Text>
          </section>
        ) : null}

        {step === 2 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              style={{ display: "none" }}
              onChange={(event) => {
                handlePhotoUpload(event.target.files);
              }}
            />
            <button
              type="button"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "154px", border: "1px dashed #d4dbe6", borderRadius: "20px", background: "#fafbfd", textAlign: "center", cursor: "pointer" }}
              onClick={() => {
                photoInputRef.current?.click();
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "999px", background: "#eef4ff", color: "#1d4e9d", fontSize: "22px" }}>⌁</span>
              <strong>사진 추가하기</strong>
              <p style={{ marginTop: "6px", color: "#98a2b3", fontSize: "13px" }}>JPG, PNG (최대 10MB)</p>
            </button>
            <Text typography="body3" style={{ color: "#344054", fontWeight: 700 }}>
              추가된 사진 ({uploadedPhotos.length})
            </Text>
            <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
              {uploadedPhotos.map((photo) => (
                <span key={photo} style={{ display: "flex", alignItems: "flex-end", width: "72px", height: "72px", padding: "8px", borderRadius: "14px", border: "1px solid #dce4ee", background: "#ffffff" }}>
                  <span style={{ display: "block", width: "100%", padding: "4px 6px", borderRadius: "8px", background: "rgb(255 255 255 / 0.88)", color: "#344054", fontSize: "10px", lineHeight: 1.35, textAlign: "center", wordBreak: "break-all" }}>{photo}</span>
                </span>
              ))}
              <button
                type="button"
                style={{ width: "72px", height: "72px", borderRadius: "14px", border: "1px solid #1d2a44", background: "#eef4ff", fontSize: "28px" }}
                onClick={() => {
                  photoInputRef.current?.click();
                }}
              >
                +
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              style={{ display: "none" }}
              onChange={(event) => {
                handleDocumentUpload(event.target.files);
              }}
            />
            <button
              type="button"
              style={{ height: "50px", border: "1px dashed #d3dce8", borderRadius: "14px", background: "#fbfcfe", fontSize: "16px", fontWeight: 700 }}
              onClick={() => {
                if (attachedDocuments.length === 0) {
                  handleGovernment24Simulation();
                  return;
                }

                documentInputRef.current?.click();
              }}
            >
              {attachedDocuments.length === 0
                ? "정부24 연계로 서류 불러오기"
                : "추가 서류 첨부하기"}
            </button>
            <Text typography="body3" style={{ color: "#74829a", lineHeight: 1.5 }}>
              {attachedDocuments.length === 0
                ? "민간 간편인증 연계 후 새 창에서 발급 시뮬레이션이 열립니다."
                : "PDF, JPG, PNG 파일을 추가로 첨부할 수 있습니다."}
            </Text>
            {governmentLinked ? (
              <div style={{ display: "grid", gap: "4px", padding: "14px 16px", border: "1px solid #cfe0ff", borderRadius: "16px", background: "#edf4ff" }}>
                <strong>정부24 연계 완료</strong>
                <span>건축물대장/토지대장 기준으로 건물 정보가 자동 입력되었습니다.</span>
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "16px", border: "1px solid #dde6f0", borderRadius: "18px", background: "#fbfcfe" }}>
              <div>
                <Text typography="body3" style={{ color: "#344054", fontWeight: 700 }}>
                  첨부 서류
                </Text>
                {attachedDocuments.length > 0 ? (
                  <ul style={{ display: "grid", gap: "8px", marginTop: "10px", paddingLeft: "16px", color: "#344054", fontSize: "14px" }}>
                    {attachedDocuments.map((document) => (
                      <li key={document}>{document}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ marginTop: "8px", color: "#98a2b3", fontSize: "14px" }}>아직 불러온 서류가 없습니다.</p>
                )}
              </div>
              <button
                type="button"
                style={{ minWidth: "78px", height: "36px", border: "1px solid #cbd5e1", borderRadius: "10px", background: "#ffffff", color: "#1d2a44", fontSize: "13px", fontWeight: 700 }}
                onClick={() => {
                  documentInputRef.current?.click();
                }}
              >
                직접 첨부
              </button>
            </div>
            <label style={{ fontSize: "15px", fontWeight: 700 }} htmlFor="buildingType">
              건물 종류
            </label>
            <select
              id="buildingType"
              style={{ width: "100%", height: "50px", padding: "0 16px", border: "1px solid #d9e1ea", borderRadius: "14px", background: "#ffffff", fontSize: "16px" }}
              value={buildingType}
              onChange={(event) => {
                setBuildingType(event.target.value);
              }}
            >
              <option>단독 주택</option>
              <option>다가구 주택</option>
              <option>근린 생활 시설</option>
            </select>
            <label style={{ fontSize: "15px", fontWeight: 700 }} htmlFor="address">
              주소
            </label>
            <TextInput
              id="address"
              placeholder="예: 제주시 ..."
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              style={{ height: "50px", borderRadius: "14px" }}
            />
            <label style={{ fontSize: "15px", fontWeight: 700 }} htmlFor="area">
              면적
            </label>
            <TextInput
              id="area"
              placeholder="예: 84㎡"
              value={area}
              onChange={(event) => {
                setArea(event.target.value);
              }}
              style={{ height: "50px", borderRadius: "14px" }}
            />
          </section>
        ) : null}

        {step === 4 ? (
          <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "18px 16px", border: "1px solid #d8e0ea", borderRadius: "20px", background: "#fbfcff" }}>
              <dl style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px" }}>
                  <dt>신청자</dt>
                  <dd>홍길동</dd>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px" }}>
                  <dt>전화번호</dt>
                  <dd>010-4473-3342</dd>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px" }}>
                  <dt>건물 종류</dt>
                  <dd>{buildingType}</dd>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px" }}>
                  <dt>주소</dt>
                  <dd>{address || "제주특별자치도 서귀포시 강정동 000번지"}</dd>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "12px" }}>
                  <dt>면적</dt>
                  <dd>{area || "84㎡"}</dd>
                </div>
              </dl>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
              {uploadedPhotos.slice(0, 3).map((photo) => (
                <span key={photo} style={{ display: "flex", alignItems: "flex-end", width: "72px", height: "72px", padding: "8px", borderRadius: "14px", border: "1px solid #dce4ee", background: "#ffffff" }}>
                  <span style={{ display: "block", width: "100%", padding: "4px 6px", borderRadius: "8px", background: "rgb(255 255 255 / 0.88)", color: "#344054", fontSize: "10px", lineHeight: 1.35, textAlign: "center", wordBreak: "break-all" }}>{photo}</span>
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {isComplete ? (
          <section style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div aria-hidden="true" style={{ width: "188px", height: "188px", borderRadius: "32px", background: "#f2f5fa" }} />
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "54px",
                marginTop: "24px",
                borderRadius: "16px",
                background: "#1f66b3",
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              메인으로 이동
            </Link>
            <Link
              href="/lookup/history"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "54px",
                marginTop: "12px",
                borderRadius: "16px",
                background: "#ffffff",
                color: "#1d2a44",
                border: "1px solid #d6deea",
                fontWeight: 700,
              }}
            >
              신청 내역 확인
            </Link>
          </section>
        ) : null}
      </main>

      {!isComplete ? (
        <footer style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "16px 20px 20px", borderTop: "1px solid #ebeff5", background: "rgb(255 255 255 / 0.96)" }}>
          <button
            type="button"
            style={{ height: "54px", borderRadius: "16px", border: 0, background: "#7d93b2", color: "#ffffff", fontSize: "18px", fontWeight: 700 }}
            onClick={() => {
              if (step === 1) {
                router.push("/apply/landing");
                return;
              }

              router.push(`/apply/step/${step - 1}`);
            }}
          >
            이전
          </button>
          <Link
            href={nextHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "54px",
              borderRadius: "16px",
              background: "#1d2240",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            {step === TOTAL_STEPS - 1 ? "접수 완료" : "다음"}
          </Link>
        </footer>
      ) : null}
    </AppLayout>
  );
}
