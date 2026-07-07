export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return "Email tidak boleh kosong";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Format email tidak valid";
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.length === 0) {
    return "Password tidak boleh kosong";
  }
  if (password.length < 6) {
    return "Password minimal 6 karakter";
  }
  return null;
}

export function validateUsername(username) {
  if (!username || username.trim().length === 0) {
    return "Username tidak boleh kosong";
  }
  if (username.trim().length < 3) {
    return "Username minimal 3 karakter";
  }
  return null;
}