import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Button, Chip, Dialog, Divider, List, Text} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { UserMinimal } from '../../models/UserMinimal';
import { useObject, useQuery, useRealm } from '@realm/react';
import { Roof } from '../../models/Roof';
import { RoofMinimal } from '../../models/RoofMinimal';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import { PAGE_EVENTS } from '../../constants/PageEvent';
import { Callback } from 'i18next';
import { User } from '../../models/User';

interface StackScreenProps {
  roof: RoofMinimal;
  onOpenDelete: Function;
  navigation: StackNavigationProp
}

function RoofListView({navigation, roof, onOpenDelete}: Props): React.JSX.Element {

  const user = useObject(User, new Realm.BSON.UUID(roof.userId));

  function editRoof(roof: RoofMinimal){
    if(user){
      navigation.navigate(ROUTES.ROOF.ADD_ROOF, {roof: roof, user: UserMinimal.map(user)})
    }
  }

  return (
    <List.Item style={{paddingRight: 0}} 
                                        title={user?.firstName + ' ' + user?.lastName + ' ' + roof.city} 
                                        left={() => <List.Icon icon="home-roof" />} 
                                        right={() => <ActionContainer deleteAction 
                                                                      editAction 
                                                                      onEdit={() => editRoof(roof)}
                                                                      onDelete={() => onOpenDelete(roof)}
                                                                      editIcon='pencil'/>}/>
  )
}


export default RoofListView;