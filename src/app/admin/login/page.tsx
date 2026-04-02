"use client";

import { useRouter } from "next/navigation";
import { Button, Text, TextInput } from "@vapor-ui/core";
import PCLayout from "@/components/layout/PCLayout";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <PCLayout
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgb(49 116 220 / 0.14), transparent 22%), linear-gradient(180deg, #f5f8fc 0%, #eef2f7 100%)",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          width: "min(100%, 1080px)",
          overflow: "hidden",
          border: "1px solid #dde5ef",
          borderRadius: "32px",
          backgroundColor: "#ffffff",
          boxShadow: "0 30px 70px rgb(15 23 42 / 0.08)",
        }}
      >
        <div
          style={{
            padding: "var(--size-space-700)",
            background: "linear-gradient(180deg, #152033 0%, #1b3156 100%)",
            color: "#ffffff",
          }}
        >
          <Text
            typography="body3"
            style={{ color: "#9ec0ff", fontWeight: 700 }}
          >
            Admin Access
          </Text>
          <Text typography="heading2" style={{ marginTop: "4px", fontWeight: 700 }}>
            관리자 로그인
          </Text>
          <Text
            typography="body2"
            style={{ color: "rgb(255 255 255 / 0.74)", lineHeight: 1.8, marginTop: "14px" }}
          >
            신청 현황 대시보드, 상태 변경, 알림 발송 기능은 관리자 인증 후 접근합니다.
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "24px",
            padding: "var(--size-space-700)",
          }}
        >
          <div>
            <Text typography="heading3" style={{ fontWeight: 700 }}>
              운영자 인증
            </Text>
            <Text
              typography="body2"
              style={{ marginTop: "10px", color: "#667085", lineHeight: 1.6 }}
            >
              권한별 접근 제어와 이력 추적이 가능한 내부용 로그인 화면입니다.
            </Text>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <TextInput
              type="email"
              placeholder="관리자 이메일"
              style={{ height: "56px", borderRadius: "16px" }}
            />
            <TextInput
              type="password"
              placeholder="비밀번호"
              style={{ height: "56px", borderRadius: "16px" }}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#475467",
              fontSize: "14px",
            }}
          >
            <input type="checkbox" defaultChecked />
            <span>이 기기에서 12시간 동안 로그인 유지</span>
          </label>

          <Button
            size="lg"
            color="primary"
            onClick={() => {
              router.push("/admin/dashboard");
            }}
            style={{ width: "100%", height: "56px", borderRadius: "16px" }}
          >
            대시보드 접속
          </Button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#667085",
              fontSize: "13px",
            }}
          >
            <Text typography="body3">최근 로그인: 2026-04-02 09:10</Text>
            <Text typography="body3">2단계 인증: 활성화</Text>
          </div>
        </div>
      </section>
    </PCLayout>
  );
}
