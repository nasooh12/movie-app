import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Movie Demo</Link>
      </div>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/popular">Popular</Link>
        <Link to="/search">Search</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
    </header>
  );
}
