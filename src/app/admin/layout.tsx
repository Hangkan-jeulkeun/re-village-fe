import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: '한집줄클 | 관리자',
    template: '%s | 한집줄클 관리자',
  },
  description: '한집줄클 관리자 대시보드',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
