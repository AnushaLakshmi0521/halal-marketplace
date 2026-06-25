
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const API_WISHLIST =
    "https://halal-marketplace.onrender.com/products/wishlist/";

  const API_CART =
    "https://halal-marketplace.onrender.com/products/cart/";

  const token = localStorage.getItem("access");

  const loadWishlist = async () => {
    try {
      const res = await fetch(API_WISHLIST, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setWishlist([]);
        return;
      }

      const data = await res.json();

      setWishlist(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.log(err);
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeWishlist = async (id) => {
    try {
      await fetch(`${API_WISHLIST}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const moveToCart = async (productId, wishlistId) => {
    try {
      await fetch(API_CART, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: productId,
        }),
      });

      await removeWishlist(wishlistId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="wishlistPage">
      <h1 className="wishlistTitle">
        ❤️ My Wishlist ({wishlist.length})
      </h1>

      {wishlist.length === 0 ? (
        <div className="emptyWishlist">
          <h2>Your wishlist is empty</h2>

          <p>
            Save your favorite products here and
            shop later.
          </p>

          <button
            className="shopBtn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlistGrid">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="wishlistCard"
            >

              {item.product_detail?.discount_percent > 0 && (
  <div className="saleBadge">
    {item.product_detail.discount_percent}% OFF
  </div>
)}
              <img
                src={
                  item.product_detail?.image
                    ? `https://res.cloudinary.com/doihibg9v/${item.product_detail.image}`
                    : "https://via.placeholder.com/400"
                }
                alt={
                  item.product_detail?.name ||
                  "Product"
                }
                className="wishlistImage"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400?text=No+Image";
                }}
              />

              <div className="wishlistContent">
                <h3>
                  {item.product_detail?.name}
                </h3>

                <p className="wishlistDesc">
                  {item.product_detail?.description}
                </p>

                {item.product_detail?.discount_percent > 0 ? (
  <>
    <p className="wishlistOldPrice">
      ₹ {item.product_detail?.price}
    </p>

    <p className="wishlistPrice">
      ₹ {item.product_detail?.sale_price}
    </p>

    <p className="wishlistDiscount">
      {item.product_detail?.discount_percent}% OFF
    </p>
  </>
) : (
  <p className="wishlistPrice">
    ₹ {item.product_detail?.price}
  </p>
)}

                <div className="wishlistActions">
                  <button
                    className="cartBtn"
                    onClick={() =>
                      moveToCart(
                        item.product,
                        item.id
                      )
                    }
                  >
                    🛒 Add To Cart
                  </button>

                  <button
                    className="removeBtn"
                    onClick={() =>
                      removeWishlist(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
