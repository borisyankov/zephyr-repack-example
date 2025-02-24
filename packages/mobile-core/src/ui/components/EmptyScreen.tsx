import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, Icon, Text} from 'react-native-paper';

import {useTheme} from '../hooks';
import {ModuleBoundary} from './ModuleBoundary';

import {init, registerRemotes} from '@module-federation/runtime';
import mfConfig from '../../../../../apps/mobile-host/module-federation.config.v1.mjs';

type Props = {
  icon: string;
  title: string;
  boundaryColor: string;
};

export function EmptyScreen({icon, title, boundaryColor}: Props) {
  const theme = useTheme();

  const switchRemotes = () => {
    registerRemotes(
      [
        {
          name: 'MobileInventory',
          entry:
            'MobileInventory@https://boris-yankov-jfrpliow5v-138-mobileinventory-zephy-521bff6e6-ze.zephyrcloud.app/MobileInventory.container.js.bundle',
        },
      ],
      {force: true},
    );
    //
    // init({...mfConfig, force: true});
  };

  return (
    <ModuleBoundary withTopRadius color={boundaryColor}>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Button onPress={switchRemotes}>Switch Remotes</Button>
        {/* <Icon source={icon} size={100} />
        <Text style={styles.title} variant="titleLarge">
          {title}
        </Text> */}
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
  title: {
    marginTop: 16,
  },
});
