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
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { UserMinimal } from '../../mapper/UserMinimal';
import { useQuery, useRealm } from '@realm/react';
import { Roof } from '../../models/Roof';
import { RoofMinimal } from '../../mapper/RoofMinimal';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import { PAGE_EVENTS } from '../../constants/PageEvent';
import RoofListView from './RoofListView';
import { User } from '../../models/User';

function Roofs({navigation, route}: StackScreenProps): React.JSX.Element {

  const [user, setUser] = React.useState<UserMinimal | null>();
  const [deletePromptVisible, setDeletePromptVisible]= React.useState(false);
  const [roofToDelete, setRoofToDelete] = React.useState<Roof | null>(null);
  const [sortReverse, setSortReverse] = React.useState<boolean>(false);
  const [stateRefreshes, setStateRefreshes] = React.useState<number>(0); //updates everytime the roof state changes, to be able to change keys

  const {t} = useTranslation();
  const roofs = useQuery(Roof);
  const users = useQuery(User);
  const realm = useRealm();
  const snackbBar = React.useRef<any>(null);


  React.useEffect(() => {
    if(route?.params?.user){
      setUser(route.params.user);
      roofs.filter(roof => {});
    }
    if(route?.params?.prevEvent === PAGE_EVENTS.ROOF.ADD_ROOF_SUCCESS){
      snackbBar?.current?.present(t('roofs:add_roof_success'));
    }else if(route?.params?.prevEvent === PAGE_EVENTS.ROOF.EDIT_ROOF_SUCCESS){
      snackbBar?.current?.present(t('roofs:edit_roof_success'));
    }
  }, [route])

  React.useEffect(() => {
    setStateRefreshes(stateRefreshes+1)
  }, [roofs, users])


  function addRoof(){
      navigation.navigate(ROUTES.ROOF.ADD_ROOF, {user: user});
  }

  function FilterRow(){

    function clearUser(){
      setUser(null);
    }

    function changeSort(){
      setSortReverse(!sortReverse);
    }

    return(<View style={{alignSelf: 'flex-start', flexDirection: 'row', display: 'flex'}}>
              {user && <Chip 
                          icon='human-male'
                          style={styles.chip}
                          onClose={clearUser}
                        >{user.firstName} {user.lastName}</Chip>}
                    <Chip icon='sort'
                          style={styles.chip}
                          onPress={changeSort}                        
                        >{t('common:sort:change')}</Chip>          
           </View>);
  }


  function deleteRoof(){
    const affectedRoof = roofToDelete;
    setDeletePromptVisible(false);
    setRoofToDelete(null);
    if(affectedRoof != null){
      realm.write(() => {
        realm.delete(affectedRoof);
      });
    }
  }

  function openDeleteRoofPrompt(user: User){
    setRoofToDelete(user);
    setDeletePromptVisible(true);
  }

  function cancelDelete(){
    setDeletePromptVisible(false);
    setRoofToDelete(null);
  }

  function filterRoofs(value: Roof, index: number){

    let contain = true;

    if(user && contain === true){
    //  contain = value.userId.toString() === user._id;
    }
    return contain;
  }

  //const roofsFiltered = roofs.sorted("users", sortReverse).filter((value, index) => filterRoofs(value, index));
  return (
    <View style={GlobalStyles.pageWrapper}>
    <AppBar title={t('roofs:title')}>
      <Appbar.Action icon={'plus'} onPress={addRoof} />
    </AppBar>
    
    <View style={GlobalStyles.siteContainer}>
      <FilterRow />  
      {roofs.length === 0 && <NoDataPlaceholder icon="home-roof" onPress={addRoof} message={t('roofs:no_data')}/>}
      <ScrollView
        style={{flex: 1, width: '100%'}}
        bounces={false}
      >
          <List.Section>
            {roofs.map((roof, index) => {

              const dividerKey = 'divider-' + roof._id.toString() + stateRefreshes;
              const wrapperKey = 'wrapper-' + roof._id.toString();  + stateRefreshes;
              const roofKey = 'roof' + roof._id.toString() + stateRefreshes;
              
              return <View key={wrapperKey}>
                        <RoofListView
                            navigation={navigation}
                            key={roofKey}
                            onOpenDelete={openDeleteRoofPrompt}
                            roof={roof}
                        ></RoofListView>
                        {index < roofs.length - 1 && <Divider key={dividerKey} />}
                      </View>
            })}
                                         
          </List.Section>
        </ScrollView>

        <Dialog visible={deletePromptVisible} >
            <Dialog.Icon icon="alert" size={3 * CONTAINER_PADDING}/>
            <Dialog.Title style={{}}>{t('roofs:delete_roof_title')}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t('roofs:delete_roof_prompt')}</Text>
              <Divider style={{marginBottom: 20, marginTop: 20}}/>
              <View style={{width: '30%', alignSelf: 'center'}}>
                <Button onPress={cancelDelete}>{t('common:cancel')}</Button>
                <Button onPress={deleteRoof} 
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
  chip: {
    marginRight: 10
  }
});


export default Roofs;