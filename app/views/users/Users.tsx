import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Chip,
  Dialog,
  Divider,
  List,
  Text,
} from 'react-native-paper';
import {GlobalStyles} from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {PAGE_EVENTS} from '../../constants/PageEvent';
import {useQuery} from '@realm/react';
import {User} from '../../models/User';
import {useRealm} from '@realm/react';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import {UserMinimal} from '../../mapper/UserMinimal';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {ThemeDark} from '../../themes/ThemeDark';
import UserListView from './UserListView';

function Users({
  navigation,
  route,
}: StackNavigationProp<any>): React.JSX.Element {
  const [deletePromptVisible, setDeletePromptVisible] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [sortReverse, setSortReverse] = React.useState<boolean>(false);

  const {t} = useTranslation();
  const realm = useRealm();
  const snackbBar = React.useRef<any>(null);
  const users = useQuery(User);

  React.useEffect(() => {
    if (route?.params?.prevEvent === PAGE_EVENTS.USER.ADD_USER_SUCCESS) {
      snackbBar?.current?.present(t('users:add_user_success'));
    } else if (
      route?.params?.prevEvent === PAGE_EVENTS.USER.EDIT_USER_SUCCESS
    ) {
      snackbBar?.current?.present(t('users:edit_user_success'));
    }
  }, [route]);

  function addUser() {
    navigation.navigate(ROUTES.USER.ADD_USER);
  }

  function deleteUser() {
    const affectedUser = userToDelete;
    setDeletePromptVisible(false);
    setUserToDelete(null);
    if (affectedUser != null) {
      realm.write(() => {
        realm.delete(affectedUser);
      });
    }
  }

  function editUser(user: UserMinimal) {
    navigation.navigate(ROUTES.USER.ADD_USER, {user: user});
  }

  function openDeleteUserPrompt(user: User) {
    setUserToDelete(user);
    setDeletePromptVisible(true);
  }

  function cancelDelete() {
    setDeletePromptVisible(false);
    setUserToDelete(null);
  }

  function FilterRow() {
    function changeSort() {
      setSortReverse(!sortReverse);
    }

    if (users.length < 1) {
      return <></>;
    }

    return (
      <View style={{alignSelf: 'flex-start', display: 'flex'}}>
        <Chip
          icon={
            sortReverse
              ? 'sort-alphabetical-ascending'
              : 'sort-alphabetical-descending'
          }
          onPress={changeSort}>
          {t('common:sort:change')}
        </Chip>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('users:title')}>
        <Appbar.Action icon={'account-plus'} onPress={addUser} />
      </AppBar>

      <View style={GlobalStyles.siteContainer}>
        {users.length === 0 && (
          <NoDataPlaceholder
            icon="account-plus"
            onPress={addUser}
            message={t('users:no_data')}
          />
        )}

        <FilterRow />
        <ScrollView style={{flex: 1, width: '100%'}} bounces={false}>
          <List.Section>
            {users.sorted('firstName', sortReverse).map((user, index) => {
              const dividerKey = 'divider-' + user._id.toString();
              const wrapperKey = 'wrapper-' + user._id.toString();
              const userKey = 'user-' + user._id.toString();

              return (
                <View key={wrapperKey}>
                  <UserListView
                    navigation={navigation}
                    onOpenDelete={openDeleteUserPrompt}
                    user={user}
                    key={userKey}
                  />
                  {index < users.length - 1 && <Divider key={dividerKey} />}
                </View>
              );
            })}
          </List.Section>
        </ScrollView>

        <Dialog
          visible={deletePromptVisible}
          onDismiss={cancelDelete}
          style={{width: '50%', alignSelf: 'center'}}>
          <Dialog.Icon icon="alert" size={3 * CONTAINER_PADDING} />
          <Dialog.Title style={{}}>{t('users:delete_user_title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('users:delete_user_prompt', {
                user: userToDelete?.firstName + ' ' + userToDelete?.lastName,
              })}
            </Text>
            <Divider style={{marginBottom: 20, marginTop: 20}} />
            <View style={{width: '30%', alignSelf: 'center'}}>
              <Button onPress={cancelDelete}>{t('common:cancel')}</Button>
              <Button
                onPress={deleteUser}
                textColor={ThemeDark.colors.background}
                style={{backgroundColor: ThemeDark.colors.error}}>
                {t('common:submit')}
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>

        <SuccessSnackbar ref={snackbBar} key={'snackbar-success'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default Users;
