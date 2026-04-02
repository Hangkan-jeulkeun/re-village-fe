import Link from "next/link";
import { Button, Text } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";

export default function ApplyLandingPage() {
  return (
    <AppLayout
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        padding: "28px 20px 36px",
        background:
          "radial-gradient(circle at top right, rgb(49 116 220 / 0.14), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%)",
      }}
    >
      <section style={{ paddingTop: "16px" }}>
        <Text typography="body3" style={{ display: "inline-flex", padding: "8px 12px", borderRadius: "999px", background: "#edf4ff", color: "#2e6dcb", fontWeight: 700 }}>
          빈집 활용 신청
        </Text>
        <Text typography="heading2" style={{ marginTop: "18px", fontWeight: 700, lineHeight: 1.16 }}>
          비어있는 공간을 신청하고 진행 상태를 바로 확인하세요
        </Text>
        <Text typography="body2" style={{ marginTop: "14px", color: "#667085", lineHeight: 1.7 }}>
          신청은 5단계로 진행되며, 접수 이후에는 신청 내역 확인 화면에서 상태를 계속 조회할 수 있습니다.
        </Text>
      </section>

      <section style={{ display: "grid", gap: "16px" }}>
        <div style={{ padding: "24px 20px", border: "1px solid #e5ebf4", borderRadius: "24px", background: "rgb(255 255 255 / 0.92)", boxShadow: "0 16px 36px rgb(15 23 42 / 0.06)" }}>
          <Text typography="heading4" style={{ fontWeight: 700 }}>
            신청하기
          </Text>
          <Text typography="body2" style={{ marginTop: "10px", color: "#667085", lineHeight: 1.65 }}>
            건물 정보와 첨부 자료를 입력해 빈집 활용 신청을 시작합니다.
          </Text>
          <Link
            href="/apply/step/1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "56px",
              marginTop: "18px",
              borderRadius: "18px",
              background: "#1f66b3",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            신청 시작
          </Link>
        </div>

        <div style={{ padding: "24px 20px", border: "1px solid #e5ebf4", borderRadius: "24px", background: "rgb(255 255 255 / 0.92)", boxShadow: "0 16px 36px rgb(15 23 42 / 0.06)" }}>
          <Text typography="heading4" style={{ fontWeight: 700 }}>
            신청 내역 확인
          </Text>
          <Text typography="body2" style={{ marginTop: "10px", color: "#667085", lineHeight: 1.65 }}>
            접수된 신청 건의 상태, 최근 처리 단계, 안내 메시지를 확인합니다.
          </Text>
          <Link
            href="/lookup/history"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "56px",
              marginTop: "18px",
              borderRadius: "18px",
              background: "#ffffff",
              color: "#152033",
              border: "1px solid #ccd8ea",
              fontWeight: 700,
            }}
          >
            신청내역확인
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
