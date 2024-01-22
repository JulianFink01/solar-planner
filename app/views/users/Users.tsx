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
import { UserMapper } from '../../mapper/UserMapper';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import ErrorSnackbar from '../../componentes/ErrorSnackbar';
import { UserMinimal } from '../../models/UserMinimal';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';

function Users({navigation, route}: StackNavigationProp): React.JSX.Element {

  const snackbBar = React.useRef<any>(null);

  const { t } = useTranslation();
  const realm = useRealm();

  const users = useQuery(User);

  const [deletePromptVisible, setDeletePromptVisible]= React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  React.useEffect(() => {
    if(route?.params?.prevEvent === PAGE_EVENTS.USER.ADD_USER_SUCCESS){
      snackbBar?.current?.present(t('users:add_user_success'));
    }else if(route?.params?.prevEvent === PAGE_EVENTS.USER.EDIT_USER_SUCCESS){
      snackbBar?.current?.present(t('users:edit_user_success'));
    }
  }, [route])

  function addUser(){
    navigation.navigate(ROUTES.USER.ADD_USER);
  }

  function deleteUser(){
    const affectedUser = userToDelete;
    setDeletePromptVisible(false);
    setUserToDelete(null);
    if(affectedUser != null){
      realm.write(() => {
        realm.delete(affectedUser);
      });
    }
  }

  function editUser(user: UserMinimal){
    navigation.navigate(ROUTES.USER.ADD_USER, {user: user})
  }

  function navigateToUserRoofs(user: UserMinimal){
    navigation.navigate(ROUTES.ROOF.HOME, {user: user})
  }

  function openDeleteUserPrompt(user: User){
    setUserToDelete(user);
    setDeletePromptVisible(true);
  }

  function cancelDelete(){
    setDeletePromptVisible(false);
    setUserToDelete(null);
  }

  return (  

    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('users:title')}>
        <Appbar.Action icon={'account-plus'} onPress={addUser} />
      </AppBar>
      
      <View style={GlobalStyles.siteContainer}>
      
      {users.length === 0 && <NoDataPlaceholder icon="account-plus" onPress={addUser} />}
        <ScrollView
          style={{flex: 1, width: '100%'}}
          bounces={false}
        >
            <List.Section>
              {users.map((user, index) => {

                const title = user.firstName + ' ' + user.lastName;
                const dividerKey = 'divider-' + user._id.toString();
                const wrapperKey = 'wrapper-' + user._id.toString();

                return <View key={wrapperKey}>
                          <List.Item key={user._id.toString()} 
                                    style={{paddingRight: 0}} 
                                    title={title} 
                                    onPress={() => {navigateToUserRoofs(UserMinimal.map(user))}}
                                    left={() => <List.Icon icon="account" />} 
                                    right={() => <ActionContainer deleteAction 
                                                                  editAction 
                                                                  editIcon='account-edit' 
                                                                  onDelete={() => openDeleteUserPrompt(user)}
                                                                  onEdit={() =>  editUser(UserMinimal.map(user))}/>}
                                                                  />
                          {index < users.length - 1 && <Divider key={dividerKey} />}
                        </View>
              })}
            </List.Section>
          </ScrollView>
          
          <Dialog visible={deletePromptVisible} >
            <Dialog.Icon icon="alert" size={3 * CONTAINER_PADDING}/>
            <Dialog.Title style={{}}>{t('users:delete_user_title')}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t('users:delete_user_prompt',{user: userToDelete?.firstName + ' ' + userToDelete?.lastName} )}</Text>
              <Divider style={{marginBottom: 20, marginTop: 20}}/>
              <View style={{width: '30%', alignSelf: 'center'}}>
                <Button onPress={cancelDelete}>{t('common:cancel')}</Button>
                <Button onPress={deleteUser} 
                        textColor={ThemeDark.colors.background} 
                        style={{backgroundColor: ThemeDark.colors.error}}>{t('common:submit')}</Button>
              </View>

            </Dialog.Content>
          </Dialog>


          <SuccessSnackbar ref={snackbBar}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Users;
