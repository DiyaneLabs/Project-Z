import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

const links = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
        <img src={logo} alt="MugumoNems Projects" />
      </Link>

       <nav className={open ? "nav-links active" : "nav-links"}>
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/contact"
        className="nav-cta"
        onClick={() => setOpen(false)}
      >
        Let's Talk <span>↗</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}