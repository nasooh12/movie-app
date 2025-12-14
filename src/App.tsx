// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import WishlistPage from "./pages/WishlistPage";
import PopularPage from "./pages/PopularPage";
import SearchPage from "./pages/SearchPage";

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

        {/* 인기 영화 페이지 */}
        <Route
          path="/popular"
          element={
            <ProtectedRoute>
              <PopularPage />
            </ProtectedRoute>
          }
        />

        {/* 검색 페이지 */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        {/* 추천(Wishlist) 페이지 */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        {/* 잘못된 주소는 홈으로 */}
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
