
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch(/*http://127.0.0.1:8000*/"https://unwound-dimple-esquire.ngrok-free.dev/accounts/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful, please login");
      navigate("/login");
    } else {
      alert(data.error || "Signup failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us to start shopping</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleSignup}>
          Signup
        </button>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#14532d" // 🌿 dark green background
  },

  card: {
    width: "340px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)", // ✨ stronger shadow
    textAlign: "center"
  },

  title: {
    color: "#16a34a",
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  },

  bottomText: {
    marginTop: "15px",
    fontSize: "14px"
  },

  link: {
    color: "#16a34a",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default Signup;