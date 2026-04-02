import { Button, Text } from "@vapor-ui/core";
import PCLayout from "@/components/layout/PCLayout";

const APPLICATIONS = [
  {
    id: "RV-1024",
    applicant: "홍길동",
    status: "서류 검토 중",
    updatedAt: "2026-04-02 10:30",
  },
  {
    id: "RV-1025",
    applicant: "김영희",
    status: "현장 확인 필요",
    updatedAt: "2026-04-02 09:10",
  },
  {
    id: "RV-1026",
    applicant: "박민수",
    status: "승인 완료",
    updatedAt: "2026-04-01 18:40",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <PCLayout
      style={{
        minHeight: "100dvh",
        padding: "40px 24px 56px",
        background:
          "radial-gradient(circle at top right, rgb(49 116 220 / 0.12), transparent 24%), linear-gradient(180deg, #f5f8fc 0%, #eef2f7 100%)",
      }}
    >
      <section style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "24px", padding: "28px", border: "1px solid #dce4ee", borderRadius: "28px", background: "#ffffff" }}>
        <div>
          <Text typography="body3" style={{ color: "#2a6eb8", fontWeight: 700 }}>
            Dashboard
          </Text>
          <Text typography="heading2" style={{ marginTop: "12px", fontWeight: 700 }}>
            신청 대시보드
          </Text>
          <Text typography="body2" style={{ marginTop: "12px", color: "#667085", lineHeight: 1.8 }}>
            신청 접수 현황을 보고, 상태를 변경하고, 대상자에게 알림을 발송할 수 있습니다.
          </Text>
        </div>
        <div style={{ display: "grid", gap: "14px" }}>
          <article style={{ padding: "18px 20px", borderRadius: "22px", background: "#f8fbff" }}>
            <strong>24</strong>
            <span>전체 신청</span>
          </article>
          <article style={{ padding: "18px 20px", borderRadius: "22px", background: "#f8fbff" }}>
            <strong>7</strong>
            <span>처리 대기</span>
          </article>
          <article style={{ padding: "18px 20px", borderRadius: "22px", background: "#f8fbff" }}>
            <strong>5</strong>
            <span>오늘 알림 발송</span>
          </article>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", marginTop: "24px" }}>
        <article style={{ padding: "24px", border: "1px solid #dce4ee", borderRadius: "28px", background: "#ffffff" }}>
          <Text typography="heading4" style={{ fontWeight: 700 }}>
            알림 발송 센터
          </Text>
          <Text typography="body2" style={{ marginTop: "10px", color: "#667085", lineHeight: 1.7 }}>
            선택한 신청자에게 처리 상태 변경 알림, 추가 서류 요청, 승인 안내를 발송합니다.
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "18px" }}>
            <Button size="md" style={{ borderRadius: "12px" }}>상태 변경 알림</Button>
            <Button size="md" style={{ borderRadius: "12px" }}>추가 서류 요청</Button>
            <Button size="md" style={{ borderRadius: "12px" }}>승인 안내 발송</Button>
          </div>
        </article>

        <article style={{ padding: "24px", border: "1px solid #dce4ee", borderRadius: "28px", background: "#ffffff" }}>
          <Text typography="heading4" style={{ fontWeight: 700 }}>
            최근 처리 이력
          </Text>
          <ul style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
            <li style={{ display: "grid", gap: "4px", padding: "14px 16px", borderRadius: "18px", background: "#f8fbff" }}>
              <strong>RV-1024</strong>
              <span>서류 검토 중으로 상태 변경</span>
            </li>
            <li style={{ display: "grid", gap: "4px", padding: "14px 16px", borderRadius: "18px", background: "#f8fbff" }}>
              <strong>RV-1025</strong>
              <span>현장 확인 요청 알림 발송</span>
            </li>
            <li style={{ display: "grid", gap: "4px", padding: "14px 16px", borderRadius: "18px", background: "#f8fbff" }}>
              <strong>RV-1026</strong>
              <span>승인 완료 및 안내 문자 발송</span>
            </li>
          </ul>
        </article>
      </section>

      <section style={{ marginTop: "24px", padding: "24px", border: "1px solid #dce4ee", borderRadius: "28px", background: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <Text typography="heading4" style={{ fontWeight: 700 }}>
            신청 관리
          </Text>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button size="md" style={{ borderRadius: "12px" }}>상태 변경</Button>
            <Button size="md" style={{ borderRadius: "12px" }}>알림 보내기</Button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
          {APPLICATIONS.map((application) => (
            <article key={application.id} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) auto", gap: "16px", padding: "18px 16px", border: "1px solid #e3e9f2", borderRadius: "18px", background: "#fbfcfe" }}>
              <div>
                <span style={{ display: "block", marginBottom: "6px", color: "#667085", fontSize: "13px" }}>신청번호</span>
                <strong>{application.id}</strong>
              </div>
              <div>
                <span style={{ display: "block", marginBottom: "6px", color: "#667085", fontSize: "13px" }}>신청자</span>
                <strong>{application.applicant}</strong>
              </div>
              <div>
                <span style={{ display: "block", marginBottom: "6px", color: "#667085", fontSize: "13px" }}>상태</span>
                <strong>{application.status}</strong>
              </div>
              <div>
                <span style={{ display: "block", marginBottom: "6px", color: "#667085", fontSize: "13px" }}>최종 업데이트</span>
                <strong>{application.updatedAt}</strong>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
                <Button size="sm" style={{ borderRadius: "12px" }}>상태 변경</Button>
                <Button size="sm" style={{ borderRadius: "12px" }}>알림 발송</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PCLayout>
  );
}
