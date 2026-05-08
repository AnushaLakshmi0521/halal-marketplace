import React from "react";
import { FaInstagram, FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "../assets/log.jpeg";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* LEFT: Logo + Brand */}
        <div style={styles.brand}>
          <img src={logo} alt="logo" style={styles.logoImg} />
          <div>
            <h3 style={styles.logoText}>Hal Tayyib</h3>
            <p style={styles.text}>Quality you can trust.</p>
          </div>
        </div>

        {/* CENTER: Contact */}
        <div>
          <h4 style={styles.heading}>Contact</h4>

          <p style={styles.text}>
            <FaEnvelope />
            <a href="mailto:anug26446@gmail.com" style={styles.link}>
              anug26446@gmail.com
            </a>
          </p>

          <p style={styles.text}>
            <FaPhone />
            <a href="tel:7989209525" style={styles.link}>
              7989209525
            </a>
          </p>
        </div>

        {/* RIGHT: Social */}
        <div>
          <h4 style={styles.heading}>Follow Us</h4>

          <div style={styles.socials}>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              <FaInstagram /> Instagram
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              <FaFacebook /> Facebook
            </a>
          </div>
        </div>

      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Hal Tayyib. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
 footer: {
  background: "#113908",
  color: "#f0fdf4",
  padding: "40px 30px 15px"
},
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "30px",
    alignItems: "flex-start"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "220px"
  },

  logoImg: {
    width: "45px",
    height: "45px",
    objectFit: "contain"
  },

  logoText: {
    color: "#22c55e",
    marginBottom: "4px",
    fontSize: "18px"
  },

  heading: {
    marginBottom: "12px",
    color: "#bbf7d0",
    fontSize: "16px"
  },

  text: {
    fontSize: "14px",
    color: "#d1fae5",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  socials: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  link: {
    color: "#d1fae5",
    textDecoration: "none",
    marginLeft: "6px"
  },

  bottom: {
    textAlign: "center",
    marginTop: "25px",
    borderTop: "1px solid #166534",
    paddingTop: "12px",
    fontSize: "13px",
    color: "#a7f3d0"
  }
};

export default Footer;