import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    tryLogin,
    tryRegister,
    rememberedEmail,
    keepLogin,
    setRememberedEmail,
    setKeepLogin,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // 기억된 이메일이 있으면 입력칸 자동 채움
    if (rememberedEmail) setEmail(rememberedEmail);
    // keepLogin 켜져 있으면 체크 상태도 맞춰줌
    setRememberMe(keepLogin);
  }, [rememberedEmail, keepLogin]);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 이메일 형식 체크(간단 버전)
    if (!email.includes("@")) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (mode === "register") {
      if (!acceptTerms) {
        setError("약관에 동의해야 회원가입이 가능합니다.");
        return;
      }

      if (password !== passwordConfirm) {
        setError("비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      const ok = tryRegister(email, password);
      if (!ok) {
        setError("이미 존재하는 이메일입니다.");
        return;
      }

      setInfo("회원가입이 완료되었습니다. 이제 로그인 해주세요.");
      setMode("login");
      setPassword("");
      setPasswordConfirm("");
      setAcceptTerms(false);
      return;
    }

    // mode === login
    const ok = tryLogin(email, password);
    if (!ok) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // Remember me: 아이디 저장 + 자동로그인
    if (rememberMe) {
      setRememberedEmail(email);
      setKeepLogin(true);
    } else {
      setRememberedEmail("");
      setKeepLogin(false);
    }

    navigate("/");
  };

  return (
    <div className={`auth-page ${mode}`}>
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
          >
            로그인
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              resetMessages();
              setMode("register");
            }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            이메일
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {mode === "register" && (
            <label>
              비밀번호 확인
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 확인"
                autoComplete="new-password"
              />
            </label>
          )}

          {/* ✅ 로그인: Remember me */}
          {mode === "login" && (
            <label className="auth-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me (아이디 저장 + 자동 로그인)
            </label>
          )}

          {/* ✅ 회원가입: 약관 동의 */}
          {mode === "register" && (
            <label className="auth-check">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              약관에 동의합니다 (필수)
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="auth-submit">
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
