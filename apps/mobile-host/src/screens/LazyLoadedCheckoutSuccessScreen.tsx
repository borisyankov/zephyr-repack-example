import React from 'react';

import {LoadingScreen, useAuthStore} from 'mobile-core';

import {CheckoutSuccessNavigationProps} from '../navigation/types';
import useRemote from '../useRemote';

type Props = CheckoutSuccessNavigationProps;

const LazyLoadedCheckoutSuccessScreen = ({navigation}: Props) => {
  const CheckoutSuccessScreen = useRemote({
    scope: 'MobileCheckout',
    module: 'CheckoutSuccessScreen',
  });

  const {user} = useAuthStore();
  const handleDismiss = () => {
    navigation.popToTop();

    if (user) {
      navigation.jumpTo('Orders');
    } else {
      navigation.jumpTo('Home');
    }
  };

  return (
    <CheckoutSuccessScreen
      fallback={<LoadingScreen />}
      onDismiss={handleDismiss}
    />
  );
};

export default LazyLoadedCheckoutSuccessScreen;
