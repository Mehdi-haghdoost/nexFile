// محاسبه قدرت رمز عبور
export const calculatePasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, text: '', color: '' };
  
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { score: 0, text: '', color: '' },
    { score: 1, text: 'Very Weak', color: 'text-red-500' },
    { score: 2, text: 'Weak', color: 'text-orange-500' },
    { score: 3, text: 'Fair', color: 'text-yellow-500' },
    { score: 4, text: 'Good', color: 'text-blue-500' },
    { score: 5, text: 'Strong', color: 'text-green-500' }
  ];

  return levels[score];
};

// بررسی تطابق رمزهای عبور
export const checkPasswordsMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) return null;
  return password === confirmPassword;
};