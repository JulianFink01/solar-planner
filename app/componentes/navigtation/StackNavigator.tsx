import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {ThemeDark} from '../../themes/ThemeDark';
import {ROUTES} from './Routes';
import AddRoof from '../../views/roofs/AddRoof';
import AddUser from '../../views/users/AddUser';
import Navigation from './Navigation';
import Editor from '../../views/editor/Editor';
import AddSolarPanelType from '../../views/solar-panels/AddSolarPanelType';
import GoogleMapsImagePicker from '../../views/roofs/GoogleMapsImagePicker';

const Stack = createStackNavigator();

function StackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ROUTES.NAVIGATOR.HOME}>
      <Stack.Screen
        options={{cardStyle: styles.cardStyle}}
        name={ROUTES.NAVIGATOR.HOME}
        component={Navigation}
      />
      <Stack.Screen
        options={{cardStyle: styles.cardStyle}}
        name={ROUTES.ROOF.ADD_ROOF}
        component={AddRoof}
      />
      <Stack.Screen
        options={{cardStyle: styles.cardStyle}}
        name={ROUTES.USER.ADD_USER}
        component={AddUser}
      />
      <Stack.Screen
        options={{cardStyle: styles.cardStyle}}
        name={ROUTES.EDITOR.HOME}
        component={Editor}
      />
      <Stack.Screen
        options={{cardStyle: styles.cardStyle}}
        name={ROUTES.SOLAR_PANELS.ADD_SOLAR_PANEL_TYPE}
        component={AddSolarPanelType}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  stackScreenStyle: {
    backgroundColor: 'transparent',
  },
  cardStyle: {
    backgroundColor: ThemeDark.colors.background,
  },
});

export default StackNavigator;
