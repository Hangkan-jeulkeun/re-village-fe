import Link from "next/link";
import { Button, Text, TextInput } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";

export default function LoginPage() {
  return (
    <AppLayout
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%)",
      }}
    >
      <div style={{ width: "100%", padding: "28px 22px", border: "1px solid #e3e8ef", borderRadius: "24px", background: "#ffffff", boxShadow: "0 20px 36px rgb(15 23 42 / 0.06)" }}>
        <Text typography="body3" style={{ color: "#2a6eb8", fontWeight: 700 }}>
          User Login
        </Text>
        <Text typography="heading3" style={{ marginTop: "10px", fontWeight: 700 }}>
          로그인
        </Text>
        <Text typography="body2" style={{ marginTop: "10px", color: "#667085", lineHeight: 1.6 }}>
          신청 이력 확인과 재접수를 위한 사용자 인증 화면입니다.
        </Text>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" }}>
          <TextInput placeholder="이메일 또는 휴대폰 번호" style={{ height: "52px", borderRadius: "14px" }} />
          <TextInput type="password" placeholder="비밀번호" style={{ height: "52px", borderRadius: "14px" }} />
        </div>

        <Button size="lg" color="primary" style={{ width: "100%", height: "54px", marginTop: "18px", borderRadius: "16px" }}>
          로그인
        </Button>

        <Link href="/apply/landing" style={{ display: "inline-flex", marginTop: "16px", color: "#5d6c83", fontSize: "14px", fontWeight: 600 }}>
          신청 랜딩으로 돌아가기
        </Link>
      </div>
    </AppLayout>
  );
}
