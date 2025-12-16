import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function isValidEmail(email: string) {
  // 과제용으로 충분한 수준의 이메일 검증
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");

  // login 옵션
  const [rememberMe, setRememberMe] = useState(false);

  // register 옵션
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    tryLogin,
    tryRegister,
    keepLogin,
    setKeepLogin,
    rememberedEmail,
    setRememberedEmail,
  } = useAuth();

  const navigate = useNavigate();

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  // 초기값: rememberedEmail 있으면 채워주기
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [rememberedEmail]);

  // mode 바뀔 때 메시지/옵션 정리
  useEffect(() => {
    resetMessages();
    if (mode === "register") {
      setAgreeTerms(false);
    }
  }, [mode]);

  const toggleMode = (next: "login" | "register") => {
    setMode(next);
  };

  const canSubmit = useMemo(() => {
    if (!email || !password) return false;
    if (mode === "register") {
      if (!passwordConfirm) return false;
      if (!agreeTerms) return false;
    }
    return true;
  }, [email, password, passwordConfirm, agreeTerms, mode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (mode === "register") {
      if (password !== passwordConfirm) {
        setError("비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      if (!agreeTerms) {
        setError("약관에 동의해야 회원가입이 가능합니다.");
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
      // 회원가입 직후에는 keepLogin/rememberMe는 그대로 두는 편이 자연스러움
      return;
    }

    // login
    const ok = tryLogin(email, password, keepLogin);
    if (!ok) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // remember me 처리
    if (rememberMe) setRememberedEmail(email);
    else setRememberedEmail("");

    navigate("/");
  };

  return (
    <div className={`auth-page ${mode}`}>
      <div className="auth-card">
        <div className="auth-toggle" role="tablist" aria-label="로그인/회원가입">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => toggleMode("login")}
            role="tab"
            aria-selected={mode === "login"}
          >
            로그인
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => toggleMode("register")}
            role="tab"
            aria-selected={mode === "register"}
          >
            회원가입
          </button>
          <span className="auth-toggle-indicator" />
        </div>

        <div className="auth-panels">
          <form onSubmit={handleSubmit} className="auth-form" aria-label="인증 폼">
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

            {mode === "login" ? (
              <div className="auth-options">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me (이메일 저장)
                </label>

                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={keepLogin}
                    onChange={(e) => setKeepLogin(e.target.checked)}
                  />
                  Keep login (자동 로그인)
                </label>
              </div>
            ) : (
              <div className="auth-options">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  약관에 동의합니다 (필수)
                </label>
              </div>
            )}

            {error && <div className="auth-error">{error}</div>}
            {info && <div className="auth-info">{info}</div>}

            <button type="submit" className="auth-submit" disabled={!canSubmit}>
              {mode === "login" ? "로그인" : "회원가입"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
