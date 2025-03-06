import React from 'react';

import {ProductDetailsNavigationProps} from '../navigation/types';
import useRemote from '../useRemote';

type Props = ProductDetailsNavigationProps;

const LazyLoadedProductDetailsScreen = ({navigation, route}: Props) => {
  const ProductDetailsScreen = useRemote({
    scope: 'MobileInventory',
    module: 'ProductDetailsScreen',
  });

  const goBack = () => {
    navigation.goBack();
  };

  const goToCart = () => {
    // @ts-ignore
    navigation.navigate('CartNavigator');
  };

  const productId = route.params.productId;

  return (
    <ProductDetailsScreen
      goBack={goBack}
      goToCart={goToCart}
      productId={productId}
    />
  );
};

export default LazyLoadedProductDetailsScreen;
