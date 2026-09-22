import { useState } from "react";
import { BookOpen, Leaf } from "lucide-react";
import { api, ApiError } from "../api";
import ThemeMenu from "./ThemeMenu";
import ThemeDecorations from "./ThemeDecorations";
import AuthAtmosphere from "./AuthAtmosphere";

export default function AuthScreen({ theme, onThemeChange, onSignedIn }) {
  const [mode, setMode] = useState("sign-in");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignUp = mode === "sign-up";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (isSignUp && form.password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await (isSignUp ? api.signUp(form) : api.signIn(form));
      localStorage.setItem("boooks-token", result.token);
      onSignedIn(result.user);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "The library is taking a moment to wake up.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-sun" />
      <ThemeDecorations theme={theme} />
      <AuthAtmosphere theme={theme} />
      <ThemeMenu theme={theme} onChange={onThemeChange} />
      <section className="auth-card">
        <div className="brand-mark"><BookOpen size={21} strokeWidth={1.8} /></div>
        <p className="eyebrow">A quiet corner for your books</p>
        <h1>{isSignUp ? <>Make room<br /><em>for stories.</em></> : <>Welcome back<br /><em>to the garden.</em></>}</h1>
        <p className="auth-copy">{isSignUp ? "Create your personal library and give every story a place to land." : "Keep your collections close, wherever the afternoon takes you."}</p>
        <div className="auth-tabs" role="tablist" aria-label="Authentication">
          <button className={!isSignUp ? "active" : ""} onClick={() => switchMode("sign-in")} type="button">Sign in</button>
          <button className={isSignUp ? "active" : ""} onClick={() => switchMode("sign-up")} type="button">Create account</button>
        </div>
        <form onSubmit={submit}>
          {isSignUp && <label>Your name<input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} autoComplete="name" required /></label>}
          <label>Email<input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} minLength={isSignUp ? 8 : undefined} required /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary button-wide" disabled={busy}>{busy ? (isSignUp ? "Planting your shelf..." : "Opening the door...") : (isSignUp ? "Create my library" : "Enter the library")}<span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-note"><Leaf size={14} /> Made for slow cataloguing and good reading weather.</p>
      </section>
      <p className="auth-footer">BOOOKS / PERSONAL LIBRARY</p>
    </main>
  );
}
