import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import green from "../assets/green1.jpg";   // ✅ NEW IMAGE
import "./Home.css";

/* IMAGES */
import all from "../assets/categories/all.jpg";
import meat from "../assets/categories/meat.jpg";
import organic from "../assets/categories/organic.jpg";
import pantry from "../assets/categories/pantry.jpg";
import snacks from "../assets/categories/snacks.jpg";
import baby from "../assets/categories/baby.jpg";
import drinks from "../assets/categories/drinks.jpg";
import vegetables from "../assets/categories/vegetables.jpg";
import fruits from "../assets/categories/fruits.jpg";
import dairy from "../assets/categories/dairy.jpg";
import seafood from "../assets/categories/seafood.jpg";

function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef();
  const itemRefs = useRef([]);

  const categories = [
    { name: "All Products", image: all },
    { name: "Ethical Meats", image: meat },
    { name: "Fresh Organics", image: organic },
    { name: "Pantry Essentials", image: pantry },
    { name: "Healthy Snacks", image: snacks },
    { name: "Baby Foods", image: baby },
    { name: "Beverages", image: drinks },
    { name: "Vegetables", image: vegetables },
    { name: "Fruits", image: fruits },
    { name: "Dairy", image: dairy },
    { name: "Seafood", image: seafood },
  ];

  const scrollLeft = () => {
    const current = scrollRef.current.scrollLeft;
    const width = itemRefs.current[0]?.offsetWidth || 150;

    scrollRef.current.scrollTo({
      left: current - width,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const current = scrollRef.current.scrollLeft;
    const width = itemRefs.current[0]?.offsetWidth || 150;

    scrollRef.current.scrollTo({
      left: current + width,
      behavior: "smooth",
    });
  };

  return (
    <div className="home">

      {/* ================= HERO (UPDATED) ================= */}
      <div className="hero">

        {/* BACKGROUND IMAGE */}
        <img src={green} alt="hero-bg" className="hero-bg" />

        {/* OVERLAY CONTENT */}
        <div className="hero-content">
          <h1>Pure Halal. Truly Tayyib.</h1>
          <p>Trusted marketplace for ethical and halal products</p>

          <button onClick={() => navigate("/products")}>
            Explore Our Collection
          </button>
        </div>

      </div>

      {/* CATEGORY CAROUSEL */}
      <div className="carousel-section">
        <h2>Shop by Category</h2>

        <div className="carousel-wrapper">

          <button className="nav-btn left" onClick={scrollLeft}>
            ◀
          </button>

          <div className="carousel" ref={scrollRef}>
            {categories.map((cat, i) => (
              <div
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}
                className="circle"
                onClick={() => {
                  const route = cat.name.toLowerCase().replace(/\s+/g, "-");
                  navigate(`/products/${route}`);
                }}
              >
                <img src={cat.image} alt={cat.name} />
                <p>{cat.name}</p>
              </div>
            ))}
          </div>

          <button className="nav-btn right" onClick={scrollRight}>
            ▶
          </button>

        </div>
      </div>

    </div>
  );
}

export default Home;