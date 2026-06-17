
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import Vendor from "./pages/Vendor.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />

          {/* Other Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/vendor" element={<Vendor />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetail />}
/>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;