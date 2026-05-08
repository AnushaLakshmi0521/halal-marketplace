import { useState, useEffect } from "react";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  // ✅ APIs
  const API_CART = "http://127.0.0.1:8000/products/cart/";
  const API_PAYMENT = "http://127.0.0.1:8000/products/create-payment/";
  const API_VERIFY = "http://127.0.0.1:8000/products/verify-payment/";

  const getToken = () => localStorage.getItem("access");

  // ---------------- LOAD CART ----------------
  useEffect(() => {
    const loadCart = async () => {
      const token = getToken();

      if (!token) {
        setCart([]);
        return;
      }

      try {
        const res = await fetch(API_CART, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          console.log("Cart fetch failed");
          setCart([]);
          return;
        }

        const data = await res.json();
        setCart(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.log("Cart error:", err);
        setCart([]);
      }
    };

    loadCart();
  }, []);

  // ---------------- TOTAL ----------------
  const total = cart.reduce((sum, item) => {
    return sum + (item.product_detail?.price || 0) * item.quantity;
  }, 0);

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- CHECKOUT ----------------
  const placeOrder = async () => {
    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ CREATE RAZORPAY ORDER
      const res = await fetch(API_PAYMENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: total * 100
        })
      });

      const order = await res.json();

      if (!res.ok) {
        alert(order.error || "Payment init failed");
        setLoading(false);
        return;
      }

      // 2️⃣ RAZORPAY OPTIONS
      const options = {
        key: "rzp_test_SjDC6PR531fZZw",
        amount: order.amount,
        currency: order.currency,
        name: "Halal Marketplace",
        description: "Secure Payment",
        order_id: order.id,

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },

        // ✅ PAYMENT SUCCESS
        handler: async function (response) {
          try {
            const token = getToken();

            const verifyRes = await fetch(API_VERIFY, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                ...response,
                name: form.name,
                address: form.address,
                phone: form.phone
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              // ✅ CLEAR CART UI
              setCart([]);

              // ✅ REDIRECT
              window.location.href = "/order-success";
            } else {
              alert("❌ Payment verification failed");
              console.log(verifyData);
            }

          } catch (err) {
            console.log(err);
            alert("Verification failed");
          }
        },

        prefill: {
          name: form.name,
          contact: form.phone
        },

        theme: {
          color: "#16a34a"
        }
      };

      // ✅ CHECK SDK
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        setLoading(false);
        return;
      }

      // ✅ OPEN RAZORPAY
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT */}
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Delivery Details</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <button
          style={styles.orderBtn}
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay ₹ ${total}`}
        </button>
      </div>

      {/* RIGHT */}
      <div style={styles.summaryBox}>
        <h3 style={styles.heading}>Order Summary</h3>

        {cart.length === 0 ? (
          <p>No items</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} style={styles.item}>
                <span>{item.product_detail?.name}</span>

                <span>
                  {item.quantity} × ₹ {item.product_detail?.price}
                </span>
              </div>
            ))}

            <hr />

            <div style={styles.totalRow}>
              <h3>Total</h3>
              <h3>₹ {total}</h3>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    background: "#f3f4f6",
    minHeight: "100vh"
  },

  formBox: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px"
  },

  summaryBox: {
    width: "350px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px"
  },

  heading: {
    marginBottom: "15px",
    color: "#16a34a"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px"
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    height: "80px"
  },

  orderBtn: {
    width: "100%",
    padding: "14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between"
  }
};

export default Checkout;