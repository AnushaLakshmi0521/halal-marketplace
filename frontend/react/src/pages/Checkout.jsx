import { useState, useEffect } from "react";

function Checkout() {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const API_CART =
    "https://halal-marketplace.onrender.com/products/cart/";

  const API_PAYMENT =
    "https://halal-marketplace.onrender.com/products/create-payment/";

  const API_VERIFY =
    "https://halal-marketplace.onrender.com/products/verify-payment/";

  const API_ADDRESS =
    "https://halal-marketplace.onrender.com/products/addresses/";

  const getToken = () => localStorage.getItem("access");

  useEffect(() => {

    loadCart();

    loadAddresses();

  }, []);

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

      const data = await res.json();

      setCart(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (err) {

      console.log(err);

      setCart([]);
    }
  };

  const loadAddresses = async () => {

    const token = getToken();

    if (!token) return;

    try {

      const res = await fetch(API_ADDRESS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!Array.isArray(data)) return;

      setAddresses(data);

      const defaultAddress =
        data.find((a) => a.is_default);

      if (defaultAddress) {

        setSelectedAddress(defaultAddress);

        setForm({
          name: defaultAddress.full_name,

          address:
            `${defaultAddress.address_line}, ` +
            `${defaultAddress.city}, ` +
            `${defaultAddress.state} - ` +
            `${defaultAddress.pincode}`,

          phone: defaultAddress.phone
        });
      }

    } catch (err) {

      console.log(err);
    }
  };

  const handleAddressChange = (e) => {

    const { name, value, type, checked } =
      e.target;

    setAddressForm({
      ...addressForm,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });
  };

  const saveAddress = async () => {

    const token = getToken();

    try {

      const url = editingAddressId
        ? `${API_ADDRESS}${editingAddressId}/`
        : API_ADDRESS;

      const method =
        editingAddressId ? "PUT" : "POST";

      const res = await fetch(url, {

        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(addressForm)
      });

      if (!res.ok) {

        alert("Failed to save address");

        return;
      }

      alert(
        editingAddressId
          ? "Address updated"
          : "Address added"
      );

      setShowAddressForm(false);

      setEditingAddressId(null);

      setAddressForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false
      });

      loadAddresses();

    } catch (err) {

      console.log(err);

      alert("Address save failed");
    }
  };

  const deleteAddress = async (id) => {

    const token = getToken();

    if (!window.confirm(
      "Delete this address?"
    )) return;

    try {

      const res = await fetch(
        `${API_ADDRESS}${id}/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {

        alert("Delete failed");

        return;
      }

      alert("Address deleted");

      loadAddresses();

    } catch (err) {

      console.log(err);
    }
  };

  const editAddress = (addr) => {

    setEditingAddressId(addr.id);

    setAddressForm({
      full_name: addr.full_name,
      phone: addr.phone,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default
    });

    setShowAddressForm(true);
  };

  const total = cart.reduce((sum, item) => {

    return (
      sum +
      (item.product_detail?.price || 0) *
      item.quantity
    );

  }, 0);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const placeOrder = async () => {

    if (
      !form.name ||
      !form.address ||
      !form.phone
    ) {

      alert("Please fill all fields");

      return;
    }

    setLoading(true);

    try {

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

        alert(order.error);

        setLoading(false);

        return;
      }

      const options = {

        key: "rzp_test_SjDC6PR531fZZw",

        amount: order.amount,

        currency: order.currency,

        name: "Halal Marketplace",

        description: "Secure Payment",

        order_id: order.id,

        handler: async function (response) {

          const token = getToken();

          const verifyRes = await fetch(
            API_VERIFY,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({

                ...response,

                name: form.name,

                address: form.address,

                phone: form.phone
              })
            }
          );

          if (verifyRes.ok) {

            setCart([]);

            window.location.href =
              "/order-success";

          } else {

            alert(
              "Payment verification failed"
            );
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

      const rzp =
        new window.Razorpay(options);

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

        <h2 style={styles.heading}>
          Delivery Details
        </h2>

        {addresses.length > 0 && (

          <div style={{ marginBottom: "24px" }}>

            <h3 style={styles.subHeading}>
              Saved Addresses
            </h3>

            {addresses.map((addr) => (

              <div
                key={addr.id}

                onClick={() => {

                  setSelectedAddress(addr);

                  setForm({

                    name: addr.full_name,

                    address:
                      `${addr.address_line}, ` +
                      `${addr.city}, ` +
                      `${addr.state} - ` +
                      `${addr.pincode}`,

                    phone: addr.phone
                  });
                }}

                style={
                  selectedAddress?.id === addr.id
                    ? styles.selectedAddressCard
                    : styles.addressCard
                }
              >

                <div style={styles.addressNameRow}>

                  <strong>
                    {addr.full_name}
                  </strong>

                  {addr.is_default && (

                    <span style={styles.defaultBadge}>
                      Default
                    </span>
                  )}
                </div>

                <p style={styles.addressText}>
                  {addr.address_line}
                </p>

                <p style={styles.addressText}>
                  {addr.city}, {addr.state}
                  {" - "}
                  {addr.pincode}
                </p>

                <p style={styles.addressText}>
                  {addr.phone}
                </p>

                <div style={styles.addressActions}>

                  <button
                    style={styles.editBtn}

                    onClick={(e) => {

                      e.stopPropagation();

                      editAddress(addr);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    style={styles.deleteBtn}

                    onClick={(e) => {

                      e.stopPropagation();

                      deleteAddress(addr.id);
                    }}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {

            setShowAddressForm(
              !showAddressForm
            );

            setEditingAddressId(null);
          }}

          style={styles.addAddressBtn}
        >
          + Add New Address
        </button>

        {showAddressForm && (

          <div style={styles.addressFormBox}>

            <h3 style={styles.subHeading}>
              {editingAddressId
                ? "Edit Address"
                : "Add New Address"}
            </h3>

            <input
              name="full_name"
              placeholder="Full Name"
              value={addressForm.full_name}
              onChange={handleAddressChange}
              style={styles.input}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={addressForm.phone}
              onChange={handleAddressChange}
              style={styles.input}
            />

            <textarea
              name="address_line"
              placeholder="Address"
              value={addressForm.address_line}
              onChange={handleAddressChange}
              style={styles.textarea}
            />

            <input
              name="city"
              placeholder="City"
              value={addressForm.city}
              onChange={handleAddressChange}
              style={styles.input}
            />

            <input
              name="state"
              placeholder="State"
              value={addressForm.state}
              onChange={handleAddressChange}
              style={styles.input}
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={addressForm.pincode}
              onChange={handleAddressChange}
              style={styles.input}
            />

            <label>

              <input
                type="checkbox"
                name="is_default"
                checked={addressForm.is_default}
                onChange={handleAddressChange}
              />

              {" "}Set as default

            </label>

            <button
              onClick={saveAddress}
              style={styles.orderBtn}
            >
              Save Address
            </button>

          </div>
        )}

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

          {loading
            ? "Processing..."
            : `Pay ₹ ${total}`}

        </button>
      </div>

      {/* RIGHT */}
      <div style={styles.summaryBox}>

        <h3 style={styles.heading}>
          Order Summary
        </h3>

        {cart.length === 0 ? (

          <p>No items</p>

        ) : (

          <>
            {cart.map((item) => (

              <div
                key={item.id}
                style={styles.item}
              >

                <span>
                  {item.product_detail?.name}
                </span>

                <span>
                  {item.quantity}
                  {" × ₹ "}
                  {item.product_detail?.price}
                </span>

              </div>
            ))}

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

const styles = {

  wrapper: {
    display: "grid",
    gridTemplateColumns: "1.7fr 1fr",
    gap: "30px",
    padding: "40px",
    background:
      "linear-gradient(to bottom right, #f0fdf4, #f8fafc)",
    minHeight: "100vh"
  },

  formBox: {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "28px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)"
  },

  summaryBox: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "28px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "20px",
    height: "fit-content"
  },

  heading: {
    marginBottom: "28px",
    color: "#15803d",
    fontSize: "32px",
    fontWeight: "800"
  },

  subHeading: {
    marginBottom: "16px",
    fontSize: "20px",
    fontWeight: "700"
  },

  input: {
    width: "100%",
    padding: "16px",
    marginBottom: "18px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },

  textarea: {
    width: "100%",
    padding: "16px",
    marginBottom: "18px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    minHeight: "100px",
    resize: "vertical",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },

  orderBtn: {
    width: "100%",
    padding: "18px",
    background:
      "linear-gradient(135deg,#16a34a,#15803d)",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "12px",
    boxShadow:
      "0 10px 24px rgba(22,163,74,0.25)"
  },

  addressCard: {
    border: "1px solid #e5e7eb",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "18px",
    cursor: "pointer",
    background: "#fff",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.05)"
  },

  selectedAddressCard: {
    border: "2px solid #16a34a",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "18px",
    cursor: "pointer",
    background: "#f0fdf4",
    boxShadow:
      "0 10px 24px rgba(22,163,74,0.15)"
  },

  addressNameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px"
  },

  defaultBadge: {
    background: "#16a34a",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700"
  },

  addressText: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.7"
  },

  addressActions: {
    display: "flex",
    gap: "12px",
    marginTop: "16px"
  },

  editBtn: {
    background:
      "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },

  deleteBtn: {
    background:
      "linear-gradient(135deg,#fef2f2,#fee2e2)",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "10px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700"
  },

  addAddressBtn: {
    marginBottom: "24px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg,#16a34a,#15803d)",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 10px 24px rgba(68, 193, 109, 0.25)"
  },

  addressFormBox: {
    border: "1px solid #e5e7eb",
    padding: "24px",
    borderRadius: "22px",
    marginBottom: "26px",
    background: "#fafafa"
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "18px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9"
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "28px",
    paddingTop: "24px",
    borderTop: "2px dashed #d1d5db",
    fontSize: "24px",
    fontWeight: "800"
  }
};

export default Checkout;