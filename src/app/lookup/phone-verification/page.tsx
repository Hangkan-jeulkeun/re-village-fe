import { Button, Text, TextInput } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";

export default function PhoneVerificationPage() {
  return (
    <AppLayout
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--page-padding-compact)",
        background: "linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%)",
      }}
    >
      <section style={{ width: "100%", padding: "var(--size-space-350) var(--size-space-275)", border: "1px solid #e3e8ef", borderRadius: "24px", background: "#ffffff" }}>
        <Text typography="heading3" style={{ fontWeight: 700 }}>
          휴대폰 인증번호로 조회
        </Text>
        <Text typography="body2" style={{ marginTop: "10px", color: "#667085", lineHeight: 1.6 }}>
          신청 시 입력한 휴대폰 번호와 인증번호를 입력하면 본인 신청 건을 조회할 수 있습니다.
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
          <TextInput placeholder="휴대폰 번호" style={{ height: "52px", borderRadius: "14px" }} />
          <TextInput placeholder="인증번호 6자리" style={{ height: "52px", borderRadius: "14px" }} />
        </div>
        <Button size="lg" color="primary" style={{ width: "100%", height: "54px", marginTop: "18px", borderRadius: "16px" }}>
          조회하기
        </Button>
      </section>
    </AppLayout>
  );
}
