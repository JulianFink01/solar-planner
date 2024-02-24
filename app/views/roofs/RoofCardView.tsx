import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button, Card, IconButton} from 'react-native-paper';
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

function RoofCardView({
  navigation,
  roof,
  onOpenDelete,
}: Props): React.JSX.Element {
  const {t} = useTranslation();
  const user = roof.linkingObjects<User>('User', 'roofs')[0];

  function editRoof() {
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

  function randomIndex(length: number) {
    return ((Math.random() * 100) % length) - 1;
  }

  return (
    <Card>
      <Card.Cover
        source={{uri: roof.roofImages[randomIndex(roof.roofImages.length)].src}}
      />
      <View style={{flexDirection: 'row'}}>
        <Card.Content style={{marginBottom: 10, marginTop: 10, flex: 1}}>
          <RoofViewContent roof={roof} user={user} />
        </Card.Content>
        <Card.Actions>
          <IconButton onPress={() => onOpenDelete(roof)} icon={'delete'} />
          <IconButton onPress={editRoof} icon={'pencil'} />
          <Button onPress={selectRoof}>{t('common:select')}</Button>
        </Card.Actions>
      </View>
    </Card>
  );
}

export default RoofCardView;
