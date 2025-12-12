// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import WishlistPage from "./pages/WishlistPage";
// 추후 PopularPage, SearchPage 등을 추가할 예정입니다.

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/signin" element={<SignInPage />} />

        {/* 메인 홈 페이지 - 로그인 필요 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 추천(Wishlist) 페이지 - 로그인 필요 */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        {/* 앞으로 추가될 예정: 인기영화, 검색 페이지 */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
