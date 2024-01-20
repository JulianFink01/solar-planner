import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { GlobalStyles } from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import { Appbar } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';

function AddUser({navigation}: StackScreenProps): React.JSX.Element {


  const { t } = useTranslation();

  return (  
    <View style={{flex: 1}}>
      <AppBar title={t('users:add_user')} left={<Appbar.Action icon={'arrow-left'} onPress={() => {navigation.goBack()}} />}>
        
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

export default AddUser;
