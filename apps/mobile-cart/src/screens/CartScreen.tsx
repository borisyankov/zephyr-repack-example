import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {
  ActivityIndicator,
  colors,
  EmptyScreen,
  ModuleBoundary,
  useCartStore,
  useTranslation,
} from 'mobile-core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CartItem from '../components/CartItem';

type Props = {
  onCheckoutSuccess: () => void;
};

export default function CartScreen({onCheckoutSuccess}: Props) {
  const CheckoutSection = useRemote({
    scope: 'MobileCheckout',
    module: 'CheckoutSection',
  });

  const {t} = useTranslation('cart');
  const {top} = useSafeAreaInsets();
  const {items} = useCartStore();

  if (items.length === 0) {
    return (
      <EmptyScreen
        boundaryColor={colors.moduleBoundaries.cart}
        icon="cart-off"
        title={t('empty_order')}
      />
    );
  }

  return (
    <ModuleBoundary withTopRadius color={colors.moduleBoundaries.cart}>
      <View style={[styles.container]}>
        <FlatList
          style={styles.list}
          contentContainerStyle={[styles.listContainer, {paddingTop: top}]}
          data={items}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CartItem
              itemId={item.id}
              quantity={item.quantity}
              size={item.size}
              color={item.color}
            />
          )}
        />
        <View style={styles.checkoutContainer}>
          <CheckoutSection
            fallback={<ActivityIndicator />}
            onCheckoutSuccess={onCheckoutSuccess}
          />
        </View>
      </View>
    </ModuleBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  listContainer: {
    paddingBottom: 64,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
function useRemote(arg0: {scope: string; module: string}) {
  throw new Error('Function not implemented.');
}
