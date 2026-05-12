import { createContext, useContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import { getOrders } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(res => setOrders(res.data)).catch(console.error);

    socket.on('new_order', (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on('order_status_changed', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off('new_order');
      socket.off('order_status_changed');
    };
  }, []);

  const fetchOrders = () => {
    getOrders().then(res => setOrders(res.data)).catch(console.error);
  };

  return (
    <OrderContext.Provider value={{ orders, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);