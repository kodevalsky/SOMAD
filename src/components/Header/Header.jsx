// src/components/Header/Header.jsx
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={Logo} alt="Somad Logo" className="header__logo-img" />
      </div>

      <nav className="header__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "header__link" + (isActive ? " header__link--active" : "")
          }
        >
          home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            "header__link" + (isActive ? " header__link--active" : "")
          }
        >
          about us
        </NavLink>

        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            "header__link" + (isActive ? " header__link--active" : "")
          }
        >
          contacts
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
