'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useAdminSummary,
  useAdminKanban,
  useAdminList,
  useUpdateApplicationStatus,
} from '@/features/applications/queries';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import styles from './Dashboard.module.css';

// ── Helpers ──────────────────────────────────────────────

type ApplicationStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'REMODELING'
  | 'LEASING'
  | 'COMPLETED'
  | 'REJECTED';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  RECEIVED: '신청완료',
  REVIEWING: '검토중',
  REMODELING: '리모델링',
  LEASING: '임대',
  COMPLETED: '완료',
  REJECTED: '반려',
};

function formatPhone(phone: string) {
  const digits = phone.replace(/^\+82/, '0').replace(/\D/g, '');
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

function formatYearMonth(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`;
}

function calcDaysWaiting(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
}

function getMonthOptions() {
  const now = new Date();
  return [-2, -1, 0].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return {
      label: `${d.getMonth() + 1}월`,
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    };
  });
}

const MONTH_OPTIONS = getMonthOptions();
const DEFAULT_MONTH = MONTH_OPTIONS[MONTH_OPTIONS.length - 1].value;

// ── Page ─────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const { accessToken, clearTokens } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);

  useEffect(() => {
    if (!accessToken) router.push('/admin/login');
  }, [accessToken, router]);

  const { data: summary, isLoading: summaryLoading } =
    useAdminSummary(selectedMonth);
  const { data: kanban, isLoading: kanbanLoading } = useAdminKanban();
  const { data: list, isLoading: listLoading } = useAdminList({ limit: 10 });
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { addNotification } = useNotificationStore();

  if (!accessToken) {
    return <div className={styles.fullCenter}>인증 중...</div>;
  }

  if (summaryLoading || kanbanLoading || listLoading) {
    return <div className={styles.fullCenter}>로딩 중...</div>;
  }

  const [year, monthNum] = selectedMonth.split('-');
  const monthLabel = `${year}년 ${parseInt(monthNum)}월 기준`;

  const leasingItems =
    kanban?.columns.find((c) => c.status === 'LEASING')?.items ?? [];

  const urgentItems = (list?.items ?? [])
    .filter((item) => item.status === 'RECEIVED' || item.status === 'REVIEWING')
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const totalCount = list?.meta.total ?? 0;
  function handleLogout() {
    clearTokens();
    router.push('/admin/login');
  }

  return (
    <div className={styles.wrapper}>
      {/* GNB */}
      <header className={styles.gnb}>
        <div className={styles.gnbLeft}>
          <span className={styles.gnbBadge}>관리자</span>
        </div>
        <div className={styles.gnbRight}>
          <span>제주도청 빈집담당</span>
          <span className={styles.gnbDivider}>·</span>
          <button
            type="button"
            className={styles.gnbLogout}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBody}>
            <p className={styles.sidebarSection}>관리 메뉴</p>
            <nav className={styles.nav}>
              <Link href="/admin/dashboard" className={styles.navActive}>
                대시보드
              </Link>
              <span className={styles.navLink}>
                신청 목록
                {totalCount > 0 && (
                  <span className={styles.navBadge}>{totalCount}</span>
                )}
              </span>
            </nav>
          </div>
          <div className={styles.sidebarFooter}>
            <button type="button" className={styles.settingBtn}>
              ⚙ 설정
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {/* Page header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>대시보드</h1>
              <p className={styles.pageSubtitle}>{monthLabel}</p>
            </div>
            <div className={styles.monthSelector}>
              {MONTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={
                    selectedMonth === opt.value
                      ? styles.monthBtnActive
                      : styles.monthBtn
                  }
                  onClick={() => setSelectedMonth(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <span className={styles.statLabelSmall}>즉시 처리 필요</span>
                <span className={styles.urgentTag}>긴급</span>
              </div>
              <p className={`${styles.statValue} ${styles.statValueRed}`}>
                {summary?.overview.urgent.count ?? 0}건
              </p>
              <p className={styles.statDetail}>7일 이상 대기</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <span className={styles.statLabelSmall}>이번달 신규</span>
              </div>
              <p className={`${styles.statValue} ${styles.statValueBlue}`}>
                {summary?.overview.newThisMonth.count ?? 0}건
              </p>
              <p className={styles.statDetail}>
                전월 대비 +
                {summary?.overview.newThisMonth.changeFromPreviousMonth ?? 0}건
                ↑
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <span className={styles.statLabelSmall}>진행 중</span>
              </div>
              <p className={`${styles.statValue} ${styles.statValueGreen}`}>
                {summary?.overview.inProgress.count ?? 0}건
              </p>
              <p className={styles.statDetail}>
                리모델링 {summary?.overview.inProgress.remodelingCount ?? 0}건
                ·임대 {summary?.overview.inProgress.leasingCount ?? 0}건
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statCardTop}>
                <span className={styles.statLabelSmall}>
                  진행 중 평균 소요일
                </span>
              </div>
              <p className={styles.statValue}>
                {summary?.overview.processingDays.days ?? 0}일
              </p>
              <p className={styles.statDetail}>
                리모델링 {summary?.overview.processingDays.remodelingCount ?? 0}
                건·임대 {summary?.overview.processingDays.leasingCount ?? 0}건
              </p>
            </div>
          </div>

          {/* Middle: leasing table + urgent panel */}
          <div className={styles.midGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>임대 만료 임박</h2>
                <span className={styles.subtitleBadge}>3개월 내 반납 예정</span>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>건물주</th>
                      <th>주소</th>
                      <th>임대 시작</th>
                      <th>만료일</th>
                      <th>D-day</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leasingItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={styles.emptyCell}>
                          임박한 임대 만료 건이 없습니다
                        </td>
                      </tr>
                    ) : (
                      leasingItems.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td>{item.applicant.name}</td>
                            <td>{item.asset.address}</td>
                            <td>{formatYearMonth(item.desiredStartDate)}</td>
                            <td>-</td>
                            <td className={styles.ddayCell}>-</td>
                            <td>
                              <button
                                type="button"
                                className={styles.notifyBtn}
                              >
                                {'안내발송'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className={styles.urgentPanel}>
              <div className={styles.urgentPanelHeader}>
                <span className={styles.urgentPanelTitle}>즉시 처리 필요</span>
                <span className={styles.urgentCount}>
                  {summary?.overview.urgent.count ?? 0}건
                </span>
              </div>
              <div className={styles.urgentList}>
                {urgentItems.length === 0 ? (
                  <p className={styles.urgentEmpty}>긴급 처리 건이 없습니다</p>
                ) : (
                  urgentItems.map((item) => {
                    const days = calcDaysWaiting(item.createdAt);
                    return (
                      <div key={item.id} className={styles.urgentItem}>
                        <div className={styles.urgentItemTop}>
                          <div>
                            <p className={styles.urgentName}>
                              {item.applicant.name}
                            </p>
                            <p className={styles.urgentAddr}>
                              {item.asset.address}
                            </p>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span className={styles.urgentDays}>
                              {days}일 대기
                            </span>
                            <button
                              type="button"
                              className={styles.processBtn}
                              onClick={() => {
                                updateStatus(
                                  {
                                    id: item.id,
                                    status: 'REVIEWING',
                                  },
                                  {
                                    onSuccess: () => {
                                      addNotification(
                                        item.id,
                                        `${item.applicant.name}님의 ${item.asset.address}에 대해 관리자가 검토 중입니다.`,
                                      );
                                    },
                                  },
                                );
                              }}
                            >
                              처리하기
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>
          </div>

          {/* Recent list */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>최근 신청 목록</h2>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>신청자</th>
                    <th>전화번호</th>
                    <th>건물 종류</th>
                    <th>주소</th>
                    <th>면적</th>
                    <th>신청일</th>
                    <th>대기일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {!list?.items.length ? (
                    <tr>
                      <td colSpan={8} className={styles.emptyCell}>
                        신청 내역이 없습니다
                      </td>
                    </tr>
                  ) : (
                    list.items.map((item) => {
                      const days = calcDaysWaiting(item.createdAt);
                      const statusLabel =
                        STATUS_LABEL[item.status] ?? item.statusLabel;
                      return (
                        <tr key={item.id}>
                          <td>{item.applicant.name}</td>
                          <td>{formatPhone(item.applicant.phone)}</td>
                          <td>{item.businessIdea}</td>
                          <td>{item.asset.address}</td>
                          <td>{item.asset.areaSqm}m²</td>
                          <td>{formatMonthDay(item.createdAt)}</td>
                          <td
                            className={
                              days >= 7
                                ? styles.urgentDaysCell
                                : styles.normalDaysCell
                            }
                          >
                            {days}일
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${styles[`status_${item.status}`]}`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
