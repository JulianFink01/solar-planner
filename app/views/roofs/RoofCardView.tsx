import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Avatar, Button, Card, Chip, Dialog, Divider, Icon, IconButton, List, Text} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { UserMinimal } from '../../mapper/UserMinimal';
import { useObject, useQuery, useRealm } from '@realm/react';
import { Roof } from '../../models/Roof';
import { RoofMinimal } from '../../mapper/RoofMinimal';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import { PAGE_EVENTS } from '../../constants/PageEvent';
import { Callback } from 'i18next';
import { User } from '../../models/User';
import RoofViewContent from './RoofViewContent';

interface Props {
  roof: Roof;
  onOpenDelete: Function;
  navigation: StackNavigationProp
}

function RoofCardView({navigation, roof, onOpenDelete}: Props): React.JSX.Element {

  const {t} = useTranslation();
  const user = roof.linkingObjects<User>('User', 'roofs')[0]
  
  function editRoof(){
    if(user){
      navigation.navigate(ROUTES.ROOF.ADD_ROOF, {roof: RoofMinimal.map(roof), user: UserMinimal.map(user)})
    }
  }

  function selectRoof(){
    navigation.navigate(ROUTES.EDITOR.HOME, {roof: RoofMinimal.map(roof), user: UserMinimal.map(user)})
  }

  function randomIndex(length: number){
    return (Math.random() * 100 % length) -1;
  }

  return (
    
    <Card>    
          <Card.Cover source={{ uri: roof.roofImages[randomIndex(roof.roofImages.length)].src }} />
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
  )
}


export default RoofCardView;