
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

useEffect(() => {
  fetchOrders();
}, []);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };
  const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("access");

    const res = await fetch(
      `https://halal-marketplace.onrender.com/products/cancel-order/${orderId}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Order cancelled successfully");

    fetchOrders();

  } catch (err) {
    console.log(err);
  }
};

  const steps = [
    "Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const getStepIndex = (status) => {
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const getProgress = (index) => {
    if (index === 0) return "20%";
    if (index === 1) return "40%";
    if (index === 2) return "60%";
    if (index === 3) return "80%";
    return "100%";
  };

  return (
    <div className="ordersPage">

      <div className="ordersHeader">
        <h1>📦 Your Orders</h1>
        <p>Track your orders in real time</p>
      </div>

      {orders.length === 0 ? (
        <div className="emptyOrders">
          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="ordersGrid">

          {orders.map((order) => {
            console.log("ORDER DATA:", order);
            const isOpen = expandedOrder === order.id;

            const stepIndex = getStepIndex(order.status);

            return (
              <div key={order.id} className="orderCard">

                {/* TOP */}

                <div className="orderTop">

                  <div>
                    <h3>Order #{order.id}</h3>

                    <p className="date">
                      {order.created_at
                        ? new Date(order.created_at).toDateString()
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`status ${(
                      order.status || "Placed"
                    )
                      .toLowerCase()
                      .replace(/ /g, "")}`}
                  >
                    {order.status || "Placed"}
                  </span>

                </div>

                <div className="divider"></div>

                {/* PREVIEW */}

                <div className="previewItems">

                  {(order.items || []).slice(0, 2).map((item, i) => (
                    <div key={i} className="previewItem">

                      <img
                        src={getImage(item.image)}
                        alt={item.name}
                      />

                      <span>{item.name}</span>

                    </div>
                  ))}

                </div>

                <button
                  className="viewBtn"
                  onClick={() => toggleOrder(order.id)}
                >
                  {isOpen ? "Hide Details" : "View Order Details"}
                </button>

                {/* EXPANDED */}

                {isOpen && (
                  <div className="expandedSection">

                    {/* TRACKING */}

                    <div className="trackingBar">

                      {/* PROGRESS TEXT */}

                      <div className="progressText">
                        {getProgress(stepIndex)}
                      </div>

                      {/* ROAD */}

                      <div className="road"></div>

                      {/* GREEN LINE */}

                      <div
                        className={`progressLine ${steps[stepIndex]
                          .toLowerCase()
                          .replace(/ /g, "")}`}
                      />

                      {/* TRUCK */}

                      <div className="truckWrapper">

                        <div
                          className={`truck ${steps[stepIndex]
                            .toLowerCase()
                            .replace(/ /g, "")}`}
                        >
                          🚚
                        </div>

                      </div>

                      {/* STEPS */}

                      {steps.map((step, i) => (
                        <div
                          key={i}
                          className={`step ${
                            stepIndex >= i ? "active" : ""
                          }`}
                        >
                          {step}
                        </div>
                      ))}

                    </div>

                    {/* DELIVERY INFO */}

                    <div className="deliveryInfo">

                      <p>
                        <strong>Estimated Delivery:</strong>{" "}
                        {order.estimated_delivery
                          ? new Date(
                              order.estimated_delivery
                            ).toDateString()
                          : "Not Available"}
                      </p>

                      {order.packed_at && (
                        <p>
                          📦 Packed:{" "}
                          {new Date(
                            order.packed_at
                          ).toLocaleString()}
                        </p>
                      )}

                      {order.shipped_at && (
                        <p>
                          🚚 Shipped:{" "}
                          {new Date(
                            order.shipped_at
                          ).toLocaleString()}
                        </p>
                      )}

                      {order.out_for_delivery_at && (
                        <p>
                          🛵 Out for Delivery:{" "}
                          {new Date(
                            order.out_for_delivery_at
                          ).toLocaleString()}
                        </p>
                      )}

                      {order.delivered_at && (
                        <p>
                          ✅ Delivered:{" "}
                          {new Date(
                            order.delivered_at
                          ).toLocaleString()}
                        </p>
                      )}

                    </div>

                    {/* ITEMS */}

                    <div className="itemsSection">

                      {(order.items || []).map((item, index) => (
                        <div key={index} className="orderItem">

                          <div className="itemLeft">

                            <img
                              src={getImage(item.image)}
                              alt={item.name}
                            />

                            <div>
                              <h4>{item.name}</h4>
                              <p>Qty: {item.quantity}</p>
                            </div>

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
  
{order.can_cancel && (
  <button
    className="cancelBtn"
    onClick={() => cancelOrder(order.id)}
  >
    Cancel Order
  </button>
)}
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