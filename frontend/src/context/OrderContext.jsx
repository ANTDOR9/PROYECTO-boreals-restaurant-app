import { createContext, useContext, useEffect, useState } from 'react';
import socket from '../services/socket';
import { getOrders } from '../services/api';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();

    // Escuchar nuevos pedidos en tiempo real
    socket.on('new_order', (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    // Escuchar cambios de estado en tiempo real
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

  return (
    <OrderContext.Provider value={{ orders, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);