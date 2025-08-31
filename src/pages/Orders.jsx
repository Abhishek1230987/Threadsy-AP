import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App.jsx";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusHandler = async (event, orderId) => {
    console.log("Status Handler called with:", {
      orderId,
      newStatus: event.target.value,
      backendUrl,
      token: token ? "Token exists" : "No token",
    });

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      console.log("Backend response:", response.data);

      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Status update error:", error);
      console.log("Error response:", error.response?.data);
      toast.error(
        "Failed to update order status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <h3>Orders Page</h3>

      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            {/* 1st Column: Image */}
            <div>
              <img
                src={assets.parcel_icon}
                alt={`Order ${order._id}`}
                className="w-10 h-10"
              />
            </div>

            {/* 2nd Column: Description + Name + Address */}
            <div>
              {order.items.map((item, itemIndex) => {
                if (itemIndex === order.items.length - 1) {
                  return (
                    <p className="py-0.5" key={itemIndex}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                    </p>
                  );
                } else {
                  return (
                    <p className="py-0.5" key={itemIndex}>
                      {item.name} x {item.quantity} <span>{item.size}</span>,
                    </p>
                  );
                }
              })}
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName +
                  " " +
                  order.address.middleName +
                  " " +
                  order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city +
                  ", " +
                  order.address.state +
                  ", " +
                  order.address.country +
                  ", " +
                  order.address.zipCode}
              </p>
              <p>
                Phone: {order.address.phoneNo || order.address.phone || "N/A"}
              </p>
            </div>

            {/* 3rd Column: Items, Method, Payment, Date */}
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* 4th Column: Amount */}
            <div className="text-sm sm:text-[15px] font-bold">
              {currency}
              {order.amount}
            </div>

            {/* 5th Column: Select Option */}

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="font-semibold p-2 rounded"
              style={{
                backgroundColor: "#e7e1d8",
                color: "#374151",
                border: "2px solid #cfc4b0",
              }}
            >
              <option
                value="Order Placed"
                style={{ backgroundColor: "#e7e1d8", color: "#374151" }}
              >
                Order Placed
              </option>
              <option
                value="Packing"
                style={{ backgroundColor: "#e7e1d8", color: "#374151" }}
              >
                Packing
              </option>
              <option
                value="Shipped"
                style={{ backgroundColor: "#e7e1d8", color: "#374151" }}
              >
                Shipped
              </option>
              <option
                value="Out For Delivery"
                style={{ backgroundColor: "#e7e1d8", color: "#374151" }}
              >
                Out For Delivery
              </option>
              <option
                value="Delivered"
                style={{ backgroundColor: "#e7e1d8", color: "#374151" }}
              >
                Delivered
              </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
