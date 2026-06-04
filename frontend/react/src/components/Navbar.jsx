import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/log.jpeg";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ use context
import { useWishlist} from "../context/WishlistContext"; 

function Navbar() {
  const { cartCount } = useCart();
  const { auth, logout } = useAuth(); // ✅ get auth from context
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const {wishlistCount} = useWishlist();
  return (
    <nav style={styles.nav}>
      
      {/* LEFT */}
      <NavLink to="/" style={styles.logo}>
        <img src={logo} alt="logo" style={styles.logoImg} />
        <span>Hal Tayyib</span>
      </NavLink>

      {/* ☰ */}
      <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* LINKS */}
      <ul
        style={{
          ...styles.links,
          ...(menuOpen ? styles.showMenu : {})
        }}
      >
        <li><NavLink to="/" style={navStyle}>Home</NavLink></li>
        <li><NavLink to="/products" style={navStyle}>Products</NavLink></li>
        <li><NavLink to="/about" style={navStyle}>About</NavLink></li>
        <li><NavLink to="/blog" style={navStyle}>Blog</NavLink></li>
        <li><NavLink to="/vendor" style={navStyle}>Vendor</NavLink></li>
        <li><NavLink to="/orders" style={navStyle}>My Orders</NavLink></li>
        <li><NavLink to="/wishlist" style={navStyle}>Wishlist</NavLink></li>
      </ul>

      {/* RIGHT */}
      <div style={styles.right}>

        {/*wishlist*/}
        <div
  style={styles.wishlistIconWrapper}
  onClick={() => navigate("/wishlist")}
>
  ❤️

  {wishlistCount > 0 && (
    <span style={styles.wishlistBadge}>
      {wishlistCount}
    </span>
  )}
</div>

        {/* CART */}
        <div
          style={styles.cartIconWrapper}
          onClick={() => navigate("/checkout")}
        >
          <span style={styles.icon}>🛍️</span>

          {cartCount > 0 && (
            <span style={styles.cartBadge}>{cartCount}</span>
          )}
        </div>

        {/* AUTH */}
        {auth.access ? (
          <div style={styles.userBox}>
            <span style={styles.username}>👤 {auth.user}</span>

            <button
              style={styles.logoutBtn}
              onClick={() => {
                logout(); // ✅ context logout
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={styles.authBtns}>
            <button
              style={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              style={styles.signupBtn}
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}

/* Active link */
const navStyle = ({ isActive }) =>
  isActive
    ? { ...styles.link, borderBottom: "2px solid #16a34a" }
    : styles.link;

/* STYLES (unchanged) */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#F5F0E8",
    flexWrap: "wrap",
    position: "relative"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    textDecoration: "none",
    fontSize: "25px",
    fontWeight: "bold",
    color: "#117837"
  },
  logoImg: {
    width: "60px",
    height: "60px",
    objectFit: "contain"
  },
  hamburger: {
    display: "none",
    fontSize: "24px",
    cursor: "pointer"
  },
  links: {
    display: "flex",
    listStyle: "none",
    gap: "20px"
  },
  showMenu: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10px",
    gap: "15px"
  },
  link: {
    textDecoration: "none",
    color: "#16a34a",
    fontWeight: "bold"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
    color: "#16a34a"
  },
  cartIconWrapper: {
    position: "relative",
    display: "inline-block",
    cursor: "pointer"
  },
  cartBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  username: {
    fontSize: "14px",
    color: "#166534",
    fontWeight: "600"
  },
  logoutBtn: {
    padding: "5px 8px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  authBtns: {
    display: "flex",
    gap: "6px"
  },
  loginBtn: {
    padding: "5px 10px",
    border: "1px solid #16a34a",
    background: "transparent",
    color: "#16a34a",
    borderRadius: "5px",
    cursor: "pointer"
  },
  signupBtn: {
    padding: "5px 10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  
wishlistIconWrapper: {
  position: "relative",
  cursor: "pointer",
  fontSize: "22px",
},

wishlistBadge: {
  position: "absolute",
  top: "-6px",
  right: "-8px",
  background: "red",
  color: "#fff",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  fontSize: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
};

export default Navbar;