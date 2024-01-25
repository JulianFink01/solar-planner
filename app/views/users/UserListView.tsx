import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Button, Dialog, Divider, List, Text} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';
import {PAGE_EVENTS} from '../../constants/PageEvent';
import {useQuery} from '@realm/react';
import { User } from '../../models/User';
import {useRealm} from '@realm/react';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import { UserMinimal } from '../../mapper/UserMinimal';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';


function UserListView({navigation, route, user, onOpenDelete}: StackNavigationProp): React.JSX.Element {

  

  function editUser(user: UserMinimal){
    navigation.navigate(ROUTES.USER.ADD_USER, {user: user})
  }

  function navigateToUserRoofs(user: UserMinimal){
    navigation.navigate(ROUTES.ROOF.HOME, {user: user})
  }

 
  const title = user.firstName + ' ' + user.lastName;

  return (  
        <List.Item key={user._id.toString()} 
                                    style={{paddingRight: 0}} 
                                    title={title} 
                                    onPress={() => {navigateToUserRoofs(UserMinimal.map(user))}}
                                    left={() => <List.Icon icon="account" />} 
                                    right={() => <ActionContainer deleteAction 
                                                                  editAction 
                                                                  editIcon='account-edit' 
                                                                  onDelete={() => onOpenDelete(user)}
                                                                  onEdit={() =>  editUser(UserMinimal.map(user))}/>}
                                                                  />
  );
}

const styles = StyleSheet.create({
 
});

export default UserListView;
