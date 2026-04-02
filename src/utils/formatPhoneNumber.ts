// 전화번호 포맷 (예: 010-1234-5678, 02-123-4567)으로 변환하는 함수
function formatSeoulPhoneNumber(digits: string): string {
  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  }

  return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
}

// 전화번호 포맷 (예: 031-123-4567, 032-1234-5678)으로 변환하는 함수
function formatThreeDigitAreaPhoneNumber(digits: string): string {
  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// 전화번호를 포맷하는 메인 함수
export function formatPhoneNumber(value: string | null | undefined): string {
  const digits = (value ?? '').replace(/\D/g, '').slice(0, 11);

  if (!digits) {
    return '';
  }

  if (digits.startsWith('02')) {
    return formatSeoulPhoneNumber(digits);
  }

  return formatThreeDigitAreaPhoneNumber(digits);
}
