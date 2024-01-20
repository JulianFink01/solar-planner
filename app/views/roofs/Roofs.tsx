import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Divider, List} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';

function Roofs({navigation, changeTab}: StackScreenProps): React.JSX.Element {


  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const {t} = useTranslation();

  function addRoof(){
      navigation.navigate(ROUTES.ROOF.ADD_ROUTE);
  }

  return (
    <View style={GlobalStyles.pageWrapper}>
    <AppBar title={t('roofs:title')}>
      <Appbar.Action icon={'plus'} onPress={addRoof} />
    </AppBar>
    
    <View style={GlobalStyles.siteContainer}>
      <ScrollView
        style={{flex: 1}}
        bounces={false}
      >
          <List.Section>
            <List.Item style={{paddingRight: 0}} 
                       title="Dach 1" 
                       left={() => <List.Icon icon="home-roof" />} 
                       right={() => <ActionContainer deleteAction 
                                                     editAction 
                                                     editIcon='pencil'/>}/>
          <Divider />
                                         
          </List.Section>
        </ScrollView>
    </View>
  </View>
  );
}


export default Roofs;