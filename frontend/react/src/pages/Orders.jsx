
import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_ORDERS =
    "https://halal-marketplace.onrender.com/products/orders/";

  const getImage = (img) => {
    if (!img) return "https://via.placeholder.com/100";
    if (img.startsWith("http")) return img;
    return `https://res.cloudinary.com/doihibg9v/${img}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch(API_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="ordersPage">

      <div className="ordersHeader">
        <h1>📦 Your Orders</h1>
        <p>Track, view and manage your purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="emptyOrders">
          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="ordersGrid">

          {orders.map((order) => {
            const isOpen = expandedOrder === order.id;

            return (
              <div key={order.id} className="orderCard">

                {/* TOP */}
                <div className="orderTop">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>
                      {order.created_at
                        ? new Date(order.created_at).toDateString()
                        : ""}
                    </p>
                  </div>

                  <span className={`status ${order.status || "processing"}`}>
                    {order.status || "Processing"}
                  </span>
                </div>

                <div className="divider"></div>

                {/* PRODUCT PREVIEW */}
                <div className="previewItems">
                  {(order.items || []).slice(0, 2).map((item, i) => (
                    <div key={i} className="previewItem">
                      <img src={getImage(item.image)} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* BUTTON */}
                <button
                  className="viewBtn"
                  onClick={() => toggleOrder(order.id)}
                >
                  {isOpen ? "Hide Details" : "View Order Details"}
                </button>

               {/* EXPANDED SECTION */}
{isOpen && (
  <div className="expandedSection">

    {/* TRACKING BAR */}
  <div className="trackingBar">

  <div
    className={`step 
    ${["Placed", "Shipped", "Delivered"].includes(order.status) ? "active" : ""}
    ${order.status === "Placed" ? "current" : ""}
    `}
  >
    Order Placed
  </div>

  <div
    className={`step 
    ${["Shipped", "Delivered"].includes(order.status) ? "active" : ""}
    ${order.status === "Shipped" ? "current" : ""}
    `}
  >
    Shipped
  </div>

  <div
    className={`step 
    ${order.status === "Delivered" ? "active deliveredDone current" : ""}
    `}
  >
    Delivered
  </div>

  <div className={`progressLine ${order.status?.toLowerCase()}`}></div>

</div>
    {/* ITEMS */}
    <div className="itemsSection">
      {(order.items || []).map((item, index) => (
        <div key={index} className="orderItem">
          <img src={getImage(item.image)} />
          <div>
            <h4>{item.name}</h4>
            <p>Qty: {item.quantity}</p>
          </div>
          <b>₹{item.price}</b>
        </div>
      ))}
    </div>

    {/* ADDRESS */}
    <div className="addressBox">
      <b>Delivery Address</b>
      <p>{order.address}</p>
    </div>

    {/* TOTAL */}
    <div className="totalBox">
      <h3>Total: ₹{order.total_amount}</h3>
    </div>

  </div>
)}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Orders;