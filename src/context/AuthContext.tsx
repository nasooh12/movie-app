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
  tryRegister: (email: string, password: string) => boolean;
  tryLogin: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 모든 회원 목록
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  // 현재 로그인한 유저 이메일
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>(
    "currentUser",
    null
  );

  const tryRegister = (email: string, password: string) => {
    const exists = users.some((u) => u.email === email);
    if (exists) {
      // 이미 가입된 이메일
      return false;
    }

    setUsers([...users, { email, password }]);
    return true;
  };

  const tryLogin = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return false;
    }

    setCurrentUser(email);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // useMemo 없이 바로 value 객체 생성
  const value: AuthContextType = {
    isLoggedIn: currentUser !== null,
    currentUser,
    tryRegister,
    tryLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
