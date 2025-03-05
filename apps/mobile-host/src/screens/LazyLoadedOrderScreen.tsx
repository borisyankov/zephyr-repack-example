import React from 'react';

import useRemote from '../useRemote';

const LazyLoadedOrderScreen = () => {
  const OrdersScreen = useRemote({
    scope: 'MobileOrders',
    module: 'OrdersScreen',
  });

  return <OrdersScreen />;
};

export default LazyLoadedOrderScreen;
