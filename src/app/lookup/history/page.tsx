import { Text } from "@vapor-ui/core";
import AppLayout from "@/components/layout/AppLayout";

export default function LookupHistoryPage() {
  return (
    <AppLayout
      style={{
        minHeight: "100%",
        padding: "28px 20px 36px",
        background: "linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%)",
      }}
    >
      <Text typography="heading2" style={{ fontWeight: 700 }}>
        신청 내역 조회
      </Text>
      <div style={{ display: "grid", gap: "16px", marginTop: "24px", padding: "22px 18px", border: "1px solid #e0e7f0", borderRadius: "22px", background: "#ffffff" }}>
        <div style={{ display: "grid", gap: "6px" }}>
          <span>신청자</span>
          <strong>홍길동</strong>
        </div>
        <div style={{ display: "grid", gap: "6px" }}>
          <span>신청 상태</span>
          <strong style={{ color: "#1f66b3" }}>검토 중</strong>
        </div>
        <div style={{ display: "grid", gap: "6px" }}>
          <span>최근 업데이트</span>
          <strong>서류 확인 완료</strong>
        </div>
        <div style={{ display: "grid", gap: "6px" }}>
          <span>다음 안내</span>
          <strong>관리자 확인 후 문자 발송 예정</strong>
        </div>
      </div>
    </AppLayout>
  );
}
