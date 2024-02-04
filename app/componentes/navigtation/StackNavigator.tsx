import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DevSettings,
  StyleSheet,
} from 'react-native';
import { ThemeDark } from '../../themes/ThemeDark';
import { ROUTES } from './Routes';
import AddRoof from '../../views/roofs/AddRoof';
import AddUser from '../../views/users/AddUser';
import Navigation from './Navigation';
import { useRealm } from '@realm/react';
import Editor from '../../views/editor/Editor';

const Stack = createStackNavigator();

function StackNavigator(): React.JSX.Element {

  const { t } = useTranslation();

  return (  

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ROUTES.NAVIGATOR.HOME}
    >
      <Stack.Screen options={{cardStyle: styles.cardStyle}} name={ROUTES.NAVIGATOR.HOME} component={Navigation} />
      <Stack.Screen options={{cardStyle: styles.cardStyle}} name={ROUTES.ROOF.ADD_ROOF} component={AddRoof} />
      <Stack.Screen options={{cardStyle: styles.cardStyle, }} name={ROUTES.USER.ADD_USER} component={AddUser} />
      <Stack.Screen options={{cardStyle: styles.cardStyle, }} name={ROUTES.EDITOR.HOME} component={Editor} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  stackScreenStyle: {
    backgroundColor: 'transparent'
  },
  cardStyle: {
    backgroundColor: ThemeDark.colors.background
  }
});

export default StackNavigator;
