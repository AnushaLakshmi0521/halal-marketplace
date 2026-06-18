
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

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

  /* ================= AVERAGE RATING ================= */
  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  /* ================= ADD REVIEW ================= */
  const submitReview = async () => {
    const token = getToken();
    if (!token) return alert("Login required");

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

    if (!res.ok) return alert(data.error || "Failed");

    setRating(0);
    setComment("");
    loadReviews();
  };

  /* ================= DELETE ================= */
  const deleteReview = async (reviewId) => {
    const token = getToken();

    await fetch(
 `https://halal-marketplace.onrender.com/products/reviews/${reviewId}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  /* ================= EDIT ================= */
  const startEdit = (r) => {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  };

  const updateReview = async (reviewId) => {
    const token = getToken();

    const res = await fetch(
 `https://halal-marketplace.onrender.com/products/reviews/${reviewId}/update/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment,
        }),
      }
    );

    const data = await res.json();

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? data : r))
    );

    setEditingId(null);
  };

  /* ================= LOADING ================= */
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!product) return <h2>No Product</h2>;

  return (
    <div className="pdContainer">

      {/* LEFT IMAGE */}
      <div className="pdLeft">
        <img src={getImage(product.image)} alt={product.name} />
      </div>

      {/* RIGHT INFO */}
      <div className="pdRight">

        <h1>{product.name}</h1>

        <h2 className="price">₹ {product.price}</h2>

        <h3>⭐ {avg} ({reviews.length})</h3>

        <p>{product.description}</p>

        <button className="cartBtn">Add to Cart</button>

        {/* ================= REVIEW FORM ================= */}
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

          {/* ================= REVIEWS LIST ================= */}
          <div className="reviewList">

            {reviews.map((r) => (
              <div key={r.id} className="reviewCard">

                {editingId === r.id ? (
                  <>
                    <div className="stars">
                      {[1,2,3,4,5].map(n => (
                        <span
                          key={n}
                          onClick={() => setEditRating(n)}
                          className={n <= editRating ? "activeStar" : ""}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                    />

                    <button onClick={() => updateReview(r.id)}>
                      Save
                    </button>

                    <button onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="reviewHeader">
  <div>
    <strong>{r.username || "Anonymous User"}</strong>
  </div>

  {r.is_verified_buyer && (
    <span className="verifiedBadge">
      ✓ Verified Buyer
    </span>
  )}
</div>

<div className="starsRead">
  {"★".repeat(r.rating)}
  {"☆".repeat(5 - r.rating)}
</div>

<p>{r.comment}</p>

{r.image && (
  <img
    src={r.image}
    alt="Review"
    className="reviewImage"
  />
)}

                 

                   {String(r.user_id) === localStorage.getItem("user_id") && (
  <div className="actions">
    <button onClick={() => startEdit(r)}>
      Edit
    </button>

    <button onClick={() => deleteReview(r.id)}>
      Delete
    </button>
  </div>
)}
                  </>
                )}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;