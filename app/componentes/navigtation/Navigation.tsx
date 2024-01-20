import * as React from 'react';
import { BottomNavigation, Icon} from 'react-native-paper';
import Roofs from '../../views/roofs/Roofs';
import Users from '../../views/users/Users';
import Editor from '../../views/editor/Editor';
import Settings from '../../views/settings/Settings';
import { useTranslation } from 'react-i18next';
import { ROUTES } from './Routes';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Navigation = ({navigation}: StackScreenProps) => {

  const { t } = useTranslation();

  const routesDefinition = [
    { key: ROUTES.USER.HOME, title: t('users:title'), focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline', component: Users},
    { key: ROUTES.ROOF.HOME, title: t('roofs:title'), focusedIcon: 'home-roof', component:  Roofs },
    { key: ROUTES.EDITOR.HOME, title: t('editor:title'), focusedIcon: 'solar-panel-large', component: Editor},
    { key: ROUTES.SETTINGS.HOME, title: t('settings:title'), focusedIcon: 'dots-horizontal', component: Settings}
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
           
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          
          getLabelText={({ route }) => {
            return routesDefinition.filter(r => route.key.startsWith(r.key))[0].title;
          }}
        />
      )}
    >
      {routesDefinition.map(route => <Tab.Screen
        name={route.key}
        key={route.key}
        component={route.component}
        options={{
          tabBarLabel: route.title,
          tabBarIcon: ({ color, size }) => {
            return <Icon source={route.focusedIcon} size={size} color={color} />;
          },
        }}
      />)}
      
    </Tab.Navigator>
  );
};

export default Navigation;