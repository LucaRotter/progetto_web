export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

export function checkAuthOrRedirect() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}