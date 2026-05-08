import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>

        <h1 style={styles.heading}>
          Order Placed Successfully!
        </h1>

        <p style={styles.text}>
          Your payment was successful and your order has been placed.
        </p>

        <p style={styles.subText}>
          We will start processing your order soon.
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f3f4f6 100%)",
    padding: "20px",
  },

  card: {
    background: "#fff",
    padding: "45px 35px",
    borderRadius: "24px",
    textAlign: "center",
    width: "100%",
    maxWidth: "430px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08), 0 5px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    animation: "fadeIn 0.5s ease",
  },

  icon: {
    width: "90px",
    height: "90px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    boxShadow: "0 8px 20px rgba(34,197,94,0.2)",
  },

  heading: {
    color: "#166534",
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "15px",
    lineHeight: "1.3",
  },

  text: {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "1.7",
    marginBottom: "8px",
  },

  subText: {
    color: "#6b7280",
    fontSize: "15px",
    marginBottom: "28px",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  primaryButton: {
    padding: "14px",
    width: "100%",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s ease",
    boxShadow: "0 6px 18px rgba(34,197,94,0.25)",
  },

  secondaryButton: {
    padding: "14px",
    width: "100%",
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s ease",
  },
};

export default OrderSuccess;