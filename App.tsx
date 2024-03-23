/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeDark} from './app/themes/ThemeDark';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/componentes/navigtation/StackNavigator';
import {RealmProvider} from '@realm/react';
import {User} from './app/models/User';
import {Roof} from './app/models/Roof';
import {RoofImage} from './app/models/RoofImage';
import {RoofPoint} from './app/models/RoofPoint';
import {SolarPanel} from './app/models/SolarPanel';
import SplashScreen from 'react-native-splash-screen';
import {SolarPanelType} from './app/models/SolarPanelType';

export default function Main() {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <PaperProvider theme={ThemeDark}>
        <RealmProvider
          closeOnUnmount={false}
          schema={[
            User,
            Roof,
            RoofImage,
            RoofPoint,
            SolarPanel,
            SolarPanelType,
          ]}
          schemaVersion={49}>
          <NavigationContainer>
            <StatusBar hidden={false} />
            <StackNavigator />
          </NavigationContainer>
        </RealmProvider>
      </PaperProvider>
    </SafeAreaView>
  );
}

AppRegistry.registerComponent(appName, () => Main);
