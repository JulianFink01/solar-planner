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
import { StackNavigationProp } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';

function Users({navigation}: StackNavigationProp): React.JSX.Element {

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const { t } = useTranslation();

  function addUser(){
    navigation.navigate(ROUTES.ROOF.HOME);
  }

  return (  

    <View style={{flex: 1}}>
      <AppBar title={t('users:title')}>
        <Appbar.Action icon={'account-plus'} onPress={addUser} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </AppBar>
      
      <View style={GlobalStyles.siteContainer}>
        <ScrollView
          style={{flex: 1}}
          bounces={false}
        >
            <List.Section>
              <List.Item style={{paddingRight: 0}} title="User 1" left={() => <List.Icon icon="account" />} right={() => <ActionContainer deleteAction editAction editIcon='account-edit'/>}/>
            </List.Section>
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Users;
