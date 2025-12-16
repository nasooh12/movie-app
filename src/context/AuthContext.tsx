import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  currentUser: string | null;

  keepLogin: boolean;
  setKeepLogin: (v: boolean) => void;

  rememberedEmail: string;
  setRememberedEmail: (email: string) => void;

  tryRegister: (email: string, password: string) => boolean;
  tryLogin: (email: string, password: string, keepLogin?: boolean) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 회원 목록
  const [users, setUsers] = useLocalStorage<User[]>("users", []);

  // keep login 설정 (로컬 저장)
  const [keepLogin, setKeepLogin] = useLocalStorage<boolean>("keepLogin", false);

  // keep login일 때만 유지되는 로그인 유저 (로컬 저장)
  const [persistUser, setPersistUser] = useLocalStorage<string | null>(
    "currentUser",
    null
  );

  // keep login이 아닐 때는 새로고침하면 풀리도록 메모리에만 둠
  const [sessionUser, setSessionUser] = useState<string | null>(null);

  // remember me (이메일만 저장)
  const [rememberedEmail, setRememberedEmailLS] = useLocalStorage<string>(
    "rememberedEmail",
    ""
  );

  const currentUser = keepLogin ? persistUser : sessionUser;
  const isLoggedIn = currentUser !== null;

  const setRememberedEmail = (email: string) => {
    setRememberedEmailLS(email);
  };

  const tryRegister = (email: string, password: string) => {
    const exists = users.some((u) => u.email === email);
    if (exists) return false;

    setUsers([...users, { email, password }]);
    return true;
  };

  const tryLogin = (email: string, password: string, keep?: boolean) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return false;

    const useKeep = typeof keep === "boolean" ? keep : keepLogin;

    // 설정 저장
    setKeepLogin(useKeep);

    if (useKeep) {
      setPersistUser(email);
      setSessionUser(null);
    } else {
      setSessionUser(email);
      setPersistUser(null);
    }

    return true;
  };

  const logout = () => {
    setSessionUser(null);
    setPersistUser(null);
  };

  // ✅ React Compiler 경고 방지: useMemo 제거하고 value를 바로 생성
  const value: AuthContextType = {
    isLoggedIn,
    currentUser,

    keepLogin,
    setKeepLogin,

    rememberedEmail,
    setRememberedEmail,

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
