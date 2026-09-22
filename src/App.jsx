import { useEffect, useState } from "react";
import { api } from "./api";
import AppShell from "./components/AppShell";
import AuthScreen from "./components/AuthScreen";

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("boooks-theme") || "reading-park");
  const [bookView, setBookView] = useState(() => localStorage.getItem("boooks-book-view") || "covers");
  const [checking, setChecking] = useState(Boolean(localStorage.getItem("boooks-token")));

  useEffect(() => {
    if (!checking) return;
    api.me()
      .then((result) => setUser(result.user))
      .catch(() => localStorage.removeItem("boooks-token"))
      .finally(() => setChecking(false));
  }, [checking]);

  function signOut() {
    localStorage.removeItem("boooks-token");
    setUser(null);
  }

  function changeTheme(nextTheme) {
    setTheme(nextTheme);
    localStorage.setItem("boooks-theme", nextTheme);
  }

  function changeBookView(nextView) {
    setBookView(nextView);
    localStorage.setItem("boooks-book-view", nextView);
  }

  return <div data-theme={theme}>
    {checking && <div className="loading-screen">Preparing your reading room...</div>}
    {!checking && !user && <AuthScreen theme={theme} onThemeChange={changeTheme} onSignedIn={setUser} />}
    {!checking && user && <AppShell theme={theme} onThemeChange={changeTheme} bookView={bookView} onBookViewChange={changeBookView} user={user} onSignOut={signOut} />}
  </div>;
}
