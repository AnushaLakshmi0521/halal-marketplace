import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext";
import OrderSuccess from "./pages/OrderSuccess";

import { Routes, Route } from "react-router-dom";
import Orders from "./pages/Orders";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import Vendor from "./pages/Vendor.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


function App() {
  return (
    <CartProvider>
      <div className="app">

        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* ✅ UPDATED ROUTES */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<Products />} />

            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </CartProvider>
  );
}

export default App;