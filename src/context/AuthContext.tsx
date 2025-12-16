import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  currentUser: string | null;

  rememberedEmail: string;
  keepLogin: boolean;
  setRememberedEmail: (email: string) => void;
  setKeepLogin: (v: boolean) => void;

  tryRegister: (email: string, password: string) => boolean;
  tryLogin: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 회원 목록
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  // 로그인 유지용 (로그인 성공 시 저장됨)
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>(
    "currentUser",
    null
  );

  // Remember me: 이메일 기억
  const [rememberedEmail, setRememberedEmail] = useLocalStorage<string>(
    "rememberedEmail",
    ""
  );
  // Remember me: 자동 로그인(로그인 유지)
  const [keepLogin, setKeepLogin] = useLocalStorage<boolean>("keepLogin", false);

  const isLoggedIn = currentUser !== null;

  const tryRegister = (email: string, password: string) => {
    const exists = users.some((u) => u.email === email);
    if (exists) return false;

    setUsers([...users, { email, password }]);
    return true;
  };

  const tryLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return false;

    setCurrentUser(email);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    // keepLogin은 “사용자 체크 상태”로 남겨두는 게 자연스럽지만,
    // 원하면 여기서 setKeepLogin(false)로 같이 끌 수도 있어.
  };

  const value: AuthContextType = {
    isLoggedIn,
    currentUser,

    rememberedEmail,
    keepLogin,
    setRememberedEmail,
    setKeepLogin,

    tryRegister,
    tryLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
