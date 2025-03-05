import React from 'react';

import Placeholder from '../components/Placeholder';
import {CartNavigationProps} from '../navigation/types';
import useRemote from '../useRemote';

type Props = CartNavigationProps;

const LazyLoadedCartScreen = ({navigation}: Props) => {
  const CartScreen = useRemote({
    scope: 'MobileCart',
    module: 'CartScreen',
  });

  const handleCheckoutSuccess = () => {
    navigation.navigate('CheckoutSuccess');
  };

  return (
    <CartScreen
      fallback={<Placeholder />}
      onCheckoutSuccess={handleCheckoutSuccess}
    />
  );
};

export default LazyLoadedCartScreen;
