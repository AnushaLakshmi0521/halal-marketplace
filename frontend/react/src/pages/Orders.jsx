import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const API_ORDERS = /*http://127.0.0.1:8000*/"https://halal-marketplace.onrender.com/products/orders/";

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch(API_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log("Orders fetch failed");
          setOrders([]);
          return;
        }

        const data = await res.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="ordersPage">

      {/* HEADER */}
      <div className="ordersHeader">
        <h1>📦 My Orders</h1>
        <p>Track and manage your recent purchases</p>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="emptyOrders">
          <h2>No Orders Yet</h2>

          <p>
            Your purchased items will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="ordersGrid">

          {orders.map((order) => (
            <div key={order.id} className="orderCard">

              {/* TOP */}
              <div className="orderTop">

                <div>
                  <h3>Order #{order.id}</h3>

                  <p className="date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span className="status">
                  ✔ Paid
                </span>

              </div>

              <div className="divider"></div>

              {/* ITEMS */}
              <div className="itemsSection">

                {order.items?.map((item, index) => (
                  <div key={index} className="orderItem">

                    <div className="itemLeft">

                      <img
  src={
    item.image
      ? item.image.startsWith("http")
        ? item.image
        : `https://res.cloudinary.com/doihibg9v${item.image}`
      : "https://via.placeholder.com/100"
  }
  alt={item.name}
  className="itemImage"
/>

<div>
  <h4>{item.name}</h4>

  <p>
    Quantity: {item.quantity}
  </p>
</div>

                    </div>

                    <h3 className="itemPrice">
                      ₹ {item.price}
                    </h3>

                  </div>
                ))}

              </div>

              <div className="divider"></div>

              {/* ADDRESS */}
              <div className="addressBox">

                <div className="addressTitle">
                  🚚 Delivery Address
                </div>

                <p>
                  {order.address || "Address not available"}
                </p>

              </div>

              {/* TIMELINE */}
              <div className="timeline">

                <div className="timelineStep">
                  ✔ Order Placed
                </div>

                <div className="timelineStep">
                  ✔ Payment Confirmed
                </div>

                <div className="timelineStep">
                  🚚 Processing
                </div>

              </div>

              <div className="divider"></div>

              {/* TOTAL */}
              <div className="orderBottom">

                <h3>Total</h3>

                <h2>
                  ₹ {order.total_amount}
                </h2>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;