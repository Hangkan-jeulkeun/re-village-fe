const DATE_PREFIX_PATTERN = /^(\d{4})-(\d{1,2})-(\d{1,2})/;

/// 날짜 문자열을 "YYYY년 MM월 DD일" 형식으로 변환하는 함수
export function formatDateToKorean(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const normalizedValue = value.split('T')[0]?.trim() ?? '';
  const match = normalizedValue.match(DATE_PREFIX_PATTERN);

  if (!match) {
    return '';
  }

  const [, year, month, day] = match;

  return `${year}년 ${month.padStart(2, '0')}월 ${day.padStart(2, '0')}일`;
}
