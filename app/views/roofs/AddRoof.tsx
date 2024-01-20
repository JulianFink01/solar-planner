import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, List} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';

function AddRoof({navigation}: StackScreenProps): React.JSX.Element {

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const { t } = useTranslation();

  return (  

    <View style={{flex: 1}}>
      <AppBar title={t('roofs:add_roof')} left={<Appbar.Action icon={'arrow-left'} onPress={() => {navigation.goBack()}} />}>
      </AppBar>
      
      <View style={GlobalStyles.siteContainer}>
        <ScrollView
          style={{flex: 1}}
          bounces={false}
        >
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
});

export default AddRoof;
