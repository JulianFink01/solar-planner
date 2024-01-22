import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Chip, Divider, List} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { UserMinimal } from '../../models/UserMinimal';

function Roofs({navigation, route}: StackScreenProps): React.JSX.Element {

  const [user, setUser] = React.useState<UserMinimal | null>();

  React.useEffect(() => {
    setUser(route?.params?.user);
  }, [route]);

  const {t} = useTranslation();

  function addRoof(){
      navigation.navigate(ROUTES.ROOF.ADD_ROUTE);
  }

  function FilterRow(){

    if(!user){
      return <></>
    }

    function clearUser(){
      setUser(null);
    }

    return(<View style={{alignSelf: 'flex-start', display: 'flex'}}>
              <Chip 
                icon='human-male'
                onClose={clearUser}
               >{user.firstName} {user.lastName}</Chip>
           </View>);
  }

  return (
    <View style={GlobalStyles.pageWrapper}>
    <AppBar title={t('roofs:title')}>
      <Appbar.Action icon={'plus'} onPress={addRoof} />
    </AppBar>
    
    <View style={GlobalStyles.siteContainer}>
      <FilterRow />  
      <ScrollView
        style={{flex: 1, width: '100%'}}
        bounces={false}
      >
          <List.Section>
            <List.Item style={{paddingRight: 0}} 
                       title="Dach 1" 
                       left={() => <List.Icon icon="home-roof" />} 
                       right={() => <ActionContainer deleteAction 
                                                     editAction 
                                                     editIcon='pencil'/>}/>
          <Divider />
                                         
          </List.Section>
        </ScrollView>
    </View>
  </View>
  );
}


export default Roofs;