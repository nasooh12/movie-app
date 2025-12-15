import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const LS_KEEP_LOGIN = "auth_keep_login"; // "1" | "0"
const LS_REMEMBER_EMAIL = "auth_remember_email"; // string
const LS_REMEMBER_PW = "auth_remember_password"; // string (과제 요구사항 때문에 저장)
const LS_TERMS_VERSION = "auth_terms_version"; // string
const TERMS_VERSION = "v1";

function isValidEmail(email: string) {
  // 너무 빡세지 않게, 과제용으로 충분한 수준
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // login 요구사항
  const [rememberMe, setRememberMe] = useState(false);

  // register 요구사항
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // 전환 애니메이션 재실행용 (mode 바뀔 때 form remount)
  const [formKey, setFormKey] = useState(0);

  const { tryLogin, tryRegister } = useAuth();
  const navigate = useNavigate();

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false;
    if (!isValidEmail(email)) return false;

    if (mode === "register") {
      if (!passwordConfirm) return false;
      if (password !== passwordConfirm) return false;
      if (!agreeTerms) return false;
    }
    return true;
  }, [agreeTerms, email, mode, password, passwordConfirm]);

  // Remember me / keep login 초기 복원 + 자동 로그인
  useEffect(() => {
    const keep = localStorage.getItem(LS_KEEP_LOGIN) === "1";
    const savedEmail = localStorage.getItem(LS_REMEMBER_EMAIL) ?? "";
    const savedPw = localStorage.getItem(LS_REMEMBER_PW) ?? "";

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    // 약관 동의(이전 동의 여부) - 회원가입 탭 갔을 때 체크 기본값
    const agreedVersion = localStorage.getItem(LS_TERMS_VERSION);
    if (agreedVersion === TERMS_VERSION) setAgreeTerms(true);

    // keep login이 켜져 있고, 저장된 계정이 있으면 자동 로그인 시도
    // (과제 요구사항: LocalStorage에 id/pw 저장 + keep login)
    if (keep && savedEmail && savedPw) {
      const ok = tryLogin(savedEmail, savedPw);
      if (ok) navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchMode = (next: "login" | "register") => {
    if (next === mode) return;

    resetMessages();
    setMode(next);
    setFormKey((k) => k + 1);

    // 탭 전환 시 입력 UX
    setPassword("");
    if (next === "login") {
      setPasswordConfirm("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetMessages();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
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

      const ok = tryRegister(trimmedEmail, password);
      if (!ok) {
        setError("이미 존재하는 이메일입니다.");
        return;
      }

      // 회원가입 성공 메시지 + 로그인 탭으로 전환
      localStorage.setItem(LS_TERMS_VERSION, TERMS_VERSION);
      setInfo("회원가입이 완료되었습니다. 이제 로그인 해주세요.");
      setMode("login");
      setFormKey((k) => k + 1);
      setPassword("");
      setPasswordConfirm("");
      return;
    }

    // mode === "login"
    const ok = tryLogin(trimmedEmail, password);
    if (!ok) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // Remember me / keep login 저장
    if (rememberMe) {
      localStorage.setItem(LS_REMEMBER_EMAIL, trimmedEmail);
      localStorage.setItem(LS_REMEMBER_PW, password); // 과제 요구사항 때문에 저장
      localStorage.setItem(LS_KEEP_LOGIN, "1");
    } else {
      localStorage.removeItem(LS_REMEMBER_EMAIL);
      localStorage.removeItem(LS_REMEMBER_PW);
      localStorage.setItem(LS_KEEP_LOGIN, "0");
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
            onClick={() => switchMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            회원가입
          </button>
        </div>

        <form key={`${mode}-${formKey}`} onSubmit={handleSubmit} className="auth-form">
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
            <>
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

              <label className="auth-checkline">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  (필수) 약관에 동의합니다
                  <span className="auth-checkline-sub"> — 과제용 간단 약관</span>
                </span>
              </label>
            </>
          )}

          {mode === "login" && (
            <label className="auth-checkline">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me (아이디 저장/자동 로그인)</span>
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
