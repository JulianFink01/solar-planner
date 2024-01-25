/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {
  AppRegistry,
  DevSettings,
  StatusBar,
} from 'react-native';
 import { PaperProvider } from 'react-native-paper';
 import { name as appName } from './app.json';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeDark } from './app/themes/ThemeDark';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './app/componentes/navigtation/StackNavigator';
import {RealmProvider, useRealm} from '@realm/react';
import { User } from './app/models/User';
import { Roof } from './app/models/Roof';

 export default function Main() {


  return (
    <SafeAreaView style={{flex: 1}}>
      <PaperProvider theme={ThemeDark}>
        <RealmProvider  /*onMigration={(oldRealm, newRealm) => {
            newRealm.write(() => {
              newRealm.deleteAll();
            newRealm.close();

            });
        }} */ schema={[User, Roof]} schemaVersion={26} >
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
