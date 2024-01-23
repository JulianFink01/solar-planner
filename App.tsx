/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {
  AppRegistry,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
 import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
 import { name as appName } from './app.json';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './app/componentes/navigtation/Navigation';
import AppBar from './app/componentes/appBar/AppBar';
import { ThemeDark } from './app/themes/ThemeDark';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './app/componentes/navigtation/StackNavigator';
import {RealmProvider} from '@realm/react';
import { User } from './app/models/User';
import { Roof } from './app/models/Roof';

 export default function Main() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaperProvider theme={ThemeDark}>
        <RealmProvider schema={[User, Roof]} schemaVersion={9}>
          <NavigationContainer>
            <StatusBar hidden={false}/>
            <StackNavigator></StackNavigator>
          </NavigationContainer>
         </RealmProvider>
      </PaperProvider>
    </SafeAreaView>
  );
}

AppRegistry.registerComponent(appName, () => Main);
