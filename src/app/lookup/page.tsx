import Link from "next/link";
import { Text } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";

export default function LookupPage() {
  return (
    <AppLayout
      style={{
        minHeight: "100%",
        padding: "var(--page-padding-mobile)",
        background: "linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%)",
      }}
    >
      <Text typography="heading2" style={{ fontWeight: 700 }}>
        신청 조회
      </Text>
      <Text typography="body2" style={{ marginTop: "12px", color: "#667085", lineHeight: 1.7 }}>
        인증번호로 조회하거나 접수된 신청 내역 페이지에서 상태를 직접 확인할 수 있습니다.
      </Text>

      <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
        <Link href="/lookup/phone-verification" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "var(--size-space-275) var(--size-space-225)", border: "1px solid #e0e7f0", borderRadius: "22px", background: "#ffffff" }}>
          <strong>휴대폰 인증번호로 조회</strong>
          <span>SMS 인증번호로 본인 신청 건을 확인합니다.</span>
        </Link>

        <Link href="/lookup/history" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "var(--size-space-275) var(--size-space-225)", border: "1px solid #e0e7f0", borderRadius: "22px", background: "#ffffff" }}>
          <strong>신청 내역 조회 페이지</strong>
          <span>처리 상태, 담당자 업데이트, 첨부 자료를 확인합니다.</span>
        </Link>
      </div>
    </AppLayout>
  );
}
