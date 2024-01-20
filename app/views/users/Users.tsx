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
import { StackNavigationProp } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';

function Users({navigation}: StackNavigationProp): React.JSX.Element {

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const { t } = useTranslation();

  function addUser(){
    navigation.navigate(ROUTES.USER.ADD_USER);
  }

  return (  

    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('users:title')}>
        <Appbar.Action icon={'account-plus'} onPress={addUser} />
      </AppBar>
      
      <View style={GlobalStyles.siteContainer}>
        <ScrollView
          style={{flex: 1}}
          bounces={false}
        >
            <List.Section>
              <List.Item style={{paddingRight: 0}} title="User 1" left={() => <List.Icon icon="account" />} right={() => <ActionContainer deleteAction editAction editIcon='account-edit' onEdit={() =>  navigation.navigate(ROUTES.USER.ADD_USER, {firstName: 'JOHN', lastName: 'CENA'})}/>}/>
              <Divider />
              <List.Item style={{paddingRight: 0}} title="User 2" left={() => <List.Icon icon="account" />} right={() => <ActionContainer deleteAction editAction editIcon='account-edit' onEdit={() =>  navigation.navigate(ROUTES.USER.ADD_USER, {firstName: 'Peter', lastName: 'weis'})}/>}/>
            </List.Section>
          </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Users;
