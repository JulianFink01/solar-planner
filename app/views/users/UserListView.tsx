import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import ActionContainer from '../../componentes/ActionContainer';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {UserMinimal} from '../../mapper/UserMinimal';

function UserListView({
  navigation,
  route,
  user,
  onOpenDelete,
}: StackNavigationProp<any>): React.JSX.Element {
  function editUser(user: UserMinimal) {
    navigation.navigate(ROUTES.USER.ADD_USER, {user: user});
  }

  function navigateToUserRoofs(user: UserMinimal) {
    navigation.navigate(ROUTES.ROOF.HOME, {user: user});
  }

  const title = user.firstName + ' ' + user.lastName;

  return (
    <List.Item
      key={user._id.toString()}
      style={{paddingRight: 0}}
      title={title}
      onPress={() => {
        const selectedUser = UserMinimal.map(user);
        if (selectedUser != null) {
          navigateToUserRoofs(selectedUser);
        }
      }}
      left={() => <List.Icon icon="account" />}
      right={() => (
        <ActionContainer
          deleteAction
          editAction
          editIcon="account-edit"
          onDelete={() => onOpenDelete(user)}
          onEdit={() => editUser(UserMinimal.map(user))}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({});

export default UserListView;
