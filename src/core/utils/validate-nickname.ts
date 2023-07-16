export function validateNickname(nickname: string): boolean {
  if (nickname.length < 5) return false;
  if (!/[a-z]/.test(nickname)) return false;
  if (/[!@#$%^&*]/.test(nickname)) return false;

  return true;
}
