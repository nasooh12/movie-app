// src/App.tsx
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./routes/ProtectedRoute";

import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import PopularPage from "./pages/PopularPage";
import SearchPage from "./pages/SearchPage";
import WishlistPage from "./pages/WishlistPage";
import MovieDetailPage from "./pages/MovieDetailPage";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/signin" element={<SignInPage />} />

        {/* 홈 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 인기 */}
        <Route
          path="/popular"
          element={
            <ProtectedRoute>
              <PopularPage />
            </ProtectedRoute>
          }
        />

        {/* 검색 */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        {/* 추천(위시리스트) */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        {/* 영화 상세 */}
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 나머지 잘못된 경로는 홈으로 */}
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
