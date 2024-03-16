import * as React from 'react';
import {View} from 'react-native';
import {List} from 'react-native-paper';
import ActionContainer from '../../componentes/ActionContainer';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {UserMinimal} from '../../mapper/UserMinimal';
import {Roof} from '../../models/Roof';
import {RoofMinimal} from '../../mapper/RoofMinimal';
import {User} from '../../models/User';
import RoofViewContent from './RoofViewContent';

interface Props {
  roof: Roof;
  onOpenDelete: Function;
  navigation: StackNavigationProp<any>;
}

function RoofListView({
  navigation,
  roof,
  onOpenDelete,
}: Props): React.JSX.Element {
  const user = roof.linkingObjects<User>('User', 'roofs')[0];

  function editRoof(roof: Roof) {
    if (user) {
      navigation.navigate(ROUTES.ROOF.ADD_ROOF, {
        roof: RoofMinimal.map(roof),
        user: UserMinimal.map(user),
      });
    }
  }
  function selectRoof() {
    navigation.navigate(ROUTES.EDITOR.HOME, {
      roof: RoofMinimal.map(roof),
      user: UserMinimal.map(user),
    });
  }

  return (
    <List.Item
      style={{paddingRight: 0}}
      title={
        <View>
          <RoofViewContent roof={roof} user={user} />
        </View>
      }
      left={() => <List.Icon icon="home-roof" />}
      right={() => (
        <ActionContainer
          deleteAction
          editAction
          viewAction
          onView={() => {
            selectRoof();
          }}
          onEdit={() => editRoof(roof)}
          onDelete={() => onOpenDelete(roof)}
          editIcon="pencil"
        />
      )}
    />
  );
}

export default RoofListView;
