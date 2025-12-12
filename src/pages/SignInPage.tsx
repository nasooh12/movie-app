import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function SignInPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const { tryLogin, tryRegister } = useAuth();
  const navigate = useNavigate();

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

    // 이메일 형식 간단 체크 (아주 간단한 버전)
    if (!email.includes("@")) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (mode === "register") {
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
      return;
    }

    // mode === "login"
    const ok = tryLogin(email, password);
    if (!ok) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // 로그인 성공 → 홈으로 이동
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
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
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
              />
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
