import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

export default function Header() {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/signin");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="logo" onClick={handleLogoClick}>
          Movie Demo
        </button>

        {isLoggedIn && (
          <nav className="nav">
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Link>
            <Link
              to="/popular"
              className={location.pathname === "/popular" ? "active" : ""}
            >
              Popular
            </Link>
            <Link
              to="/search"
              className={location.pathname === "/search" ? "active" : ""}
            >
              Search
            </Link>
            <Link
              to="/wishlist"
              className={location.pathname === "/wishlist" ? "active" : ""}
            >
              Wishlist
            </Link>
          </nav>
        )}
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span className="user-email">{currentUser}</span>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/signin"
            className={location.pathname === "/signin" ? "active" : ""}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
