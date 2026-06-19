
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);

  const getToken = () => localStorage.getItem("access");

  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;
    return `https://res.cloudinary.com/doihibg9v/${img}`;
  };

  /* ================= PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://halal-marketplace.onrender.com/products/products/${id}/`
        );

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= REVIEWS ================= */
  const loadReviews = async () => {
    try {
      const res = await fetch(
        `https://halal-marketplace.onrender.com/products/products/${id}/reviews/`
      );

      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  /* ================= WISHLIST SYNC ================= */
  useEffect(() => {
    if (!product) return;

    const checkWishlist = async () => {
      const token = getToken();
      if (!token) return;

      const res = await fetch(
        "https://halal-marketplace.onrender.com/products/wishlist/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const exists = data.some((item) => item.product === product.id);
      setIsWishlisted(exists);
    };

    checkWishlist();
  }, [product]);

  /* ================= AVERAGE RATING ================= */
  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  /* ================= ADD TO CART ================= */
  const addToCart = async () => {
    const token = getToken();

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      "https://halal-marketplace.onrender.com/products/cart/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
        }),
      }
    );

    

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add to cart");
    } else {
      alert("Added to cart");
    }
  };

  const submitReview = async () => {
  const token = getToken();

  if (!token) {
    alert("Please login first");
    return;
  }

  if (!rating || !comment) {
    alert("Please add rating and comment");
    return;
  }

  const res = await fetch(
    `https://halal-marketplace.onrender.com/products/products/${id}/reviews/add/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed to add review");
    return;
  }

  setRating(0);
  setComment("");
  loadReviews();
};

  /* ================= BUY NOW ================= */
  const buyNow = () => {
  const token = getToken();

  if (!token) {
    alert("Please login first");
    return;
  }

  navigate("/checkout", {
    state: {
      buyNowItem: {
        product_detail: product,
        quantity: 1,
      },
    },
  });
};

  /* ================= WISHLIST TOGGLE ================= */
  const toggleWishlist = async () => {
    const token = getToken();

    if (!token) {
      alert("Login required");
      return;
    }

    const res = await fetch(
      "https://halal-marketplace.onrender.com/products/wishlist/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
        }),
      }
    );

    if (res.ok) {
      setIsWishlisted(!isWishlisted);
    } else {
      const data = await res.json();
      alert(data.message || "Failed");
    }
  };

  /* ================= LOADING ================= */
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!product) return <h2>No Product</h2>;

  return (
    <div className="pdContainer">

      {/* LEFT */}
      <div className="pdLeft">
        <img src={getImage(product.image)} alt={product.name} />
      </div>

      {/* RIGHT */}
      <div className="pdRight">

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1>{product.name}</h1>

          <span
            className={`wishlistIcon ${isWishlisted ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            ♥
          </span>
        </div>

        <h2 className="price">₹ {product.price}</h2>

        <h3>⭐ {avg} ({reviews.length})</h3>

        <p>{product.description}</p>

        <div className="actionButtons">

          <button className="cartBtn" onClick={addToCart}>
            Add to Cart
          </button>

          <button className="buyBtn" onClick={buyNow}>
            Buy Now
          </button>

        </div>

        {/* REVIEWS */}
        <div className="reviewBox">

          <h2>Reviews</h2>

          <div className="stars">
            {[1,2,3,4,5].map(n => (
              <span
                key={n}
                onClick={() => setRating(n)}
                className={n <= rating ? "activeStar" : ""}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write review..."
          />

          <button onClick={submitReview}>Submit</button>

          {/* LIST */}
          <div className="reviewList">
            {reviews.map((r) => (
              <div key={r.id} className="reviewCard">

                <strong>{r.username || "Anonymous"}</strong>

                <div className="starsRead">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>

                <p>{r.comment}</p>
                

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetail;