import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Products.css";

function Products() {
  const { loadCart: refreshCart } = useCart();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { category } = useParams();

  const sidebarRefs = useRef({});

  const API_PRODUCTS =/*http://127.0.0.1:8000*/"https://halal-marketplace.onrender.com/products/products/";
  const API_CART = /*http://127.0.0.1:8000*/"https://halal-marketplace.onrender.com/products/cart/"; // ✅ FIXED

  const getToken = () => localStorage.getItem("access");

  const normalize = (str) =>
    str?.toLowerCase().trim().replace(/\s+/g, "-");

  /* FETCH PRODUCTS */
  useEffect(() => {
    fetch(API_PRODUCTS)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.log);
  }, []);

  /* LOAD CART */
  const loadCart = async () => {
    try {
      const token = getToken();

      const res = await fetch(API_CART, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("Cart fetch failed:", res.status);
        setCart([]);
        return;
      }

      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Cart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  /* CATEGORY SYNC */
  const categories = [
    { name: "All Products", icon: "🛒" },
    { name: "Ethical Meats", icon: "🥩" },
    { name: "Fresh Organics", icon: "🥬" },
    { name: "Pantry Essentials", icon: "🍚" },
    { name: "Healthy Snacks", icon: "🍪" },
    { name: "Baby Foods", icon: "🍼" },
    { name: "Beverages", icon: "🥤" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Fruits", icon: "🍎" },
    { name: "Dairy", icon: "🧀" },
    { name: "Seafood", icon: "🐟" },
  ];

  useEffect(() => {
    if (category) {
      const matched = categories.find(
        (c) => normalize(c.name) === category
      );

      if (matched) {
        setSelectedCategory(matched.name);
      }
    } else {
      setSelectedCategory("All Products");
    }
  }, [category]);

  /* FILTER */
  const filteredProducts = products.filter((item) => {
    const itemCategory = item.category?.toLowerCase().trim();
    const selected = selectedCategory?.toLowerCase().trim();

    const matchCategory =
      selected === "all products" || itemCategory === selected;

    const matchSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  /* ADD TO CART */
  const addToCart = async (product) => {
    const token = getToken();

    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const res = await fetch(API_CART, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product: product.id }),
    });

    if (!res.ok) {
      console.log("Add to cart failed");
    }

    await loadCart();
    await refreshCart();
  };

  return (
    <div className="wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Categories</h3>

        <input
          className="input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {categories.map((cat) => (
          <div
            key={cat.name}
            ref={(el) => (sidebarRefs.current[cat.name] = el)}
            className={`categoryItem ${
              normalize(selectedCategory) === normalize(cat.name)
                ? "activeCategory"
                : ""
            }`}
            onClick={() =>
              navigate(`/products/${normalize(cat.name)}`)
            }
          >
            {cat.icon} {cat.name}
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="container">
        <h2 className="title">Our Products</h2>

        <div className="grid">
          {filteredProducts.map((item) => (
            <div key={item.id} className="card">

              <img
                src={
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `https://res.cloudinary.com/doihibg9v${item.image}`
                    : "https://via.placeholder.com/200"
                }
                alt={item.name}
                className="image"
              />

              <div className="content">
                <h3>{item.name}</h3>
                <p className="desc">{item.description}</p>
                <p className="price">₹ {item.price}</p>

                <button
                  className="button"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* CART */}
        <div className="cartBox">
          <h3>🛒 Cart</h3>

          {cart.length === 0 ? (
            <p>No items</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cartItem">

                  <div>
                    <p className="cartName">
                      {item.product_detail?.name}
                    </p>
                    <p className="cartPrice">
                      ₹ {item.product_detail?.price}
                    </p>
                  </div>

                  <div className="qtyBox">

                    <button
                      className="qtyBtn"
                      onClick={async () => {
                        const token = getToken();

                        if (item.quantity <= 1) {
                          await fetch(`${API_CART}${item.id}/`, {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                        } else {
                          await fetch(`${API_CART}${item.id}/`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              quantity: item.quantity - 1,
                            }),
                          });
                        }

                        await loadCart();
                        await refreshCart();
                      }}
                    >
                      −
                    </button>

                    <span className="qtyText">{item.quantity}</span>

                    <button
                      className="qtyBtn"
                      onClick={async () => {
                        const token = getToken();

                        await fetch(`${API_CART}${item.id}/`, {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            quantity: item.quantity + 1,
                          }),
                        });

                        await loadCart();
                        await refreshCart();
                      }}
                    >
                      +
                    </button>

                  </div>

                </div>
              ))}

              <h3>
                Total: ₹{" "}
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    (item.product_detail?.price || 0) *
                      item.quantity,
                  0
                )}
              </h3>

              <button
                className="payBtn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Payment
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Products;