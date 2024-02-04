import * as React from 'react';
import 'react-native-get-random-values';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GlobalStyles } from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import { Appbar, Button, Chip, Snackbar, Text, TextInput } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';
import {useObject, useQuery, useRealm} from '@realm/react';
import { User } from '../../models/User';
import Realm from 'realm';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { PAGE_EVENTS } from '../../constants/PageEvent';
import ErrorSnackbar from '../../componentes/ErrorSnackbar';
import { Roof } from '../../models/Roof';
import { UserMinimal } from '../../mapper/UserMinimal';
import { RoofMinimal } from '../../mapper/RoofMinimal';


function AddRoof({navigation, route}: StackScreenProps): React.JSX.Element {
  
  const errorSnackBar = React.useRef<any>(null);

  const roofId = route?.params?.roof?._id;
  const userId = route.params?.user?._id;

  const roof = roofId ? useObject(Roof, new Realm.BSON.UUID(roofId)): null;
  const initialUser = userId ? useObject(User, new Realm.BSON.UUID(userId)): null;

  const realm = useRealm();
  const { t } = useTranslation();

  const [width, setWidth] = React.useState<string>(getOrElse(roof?.width, ''));
  const [height, setHeight] = React.useState<string>(getOrElse(roof?.height, ''));
  const [user, setUser] = React.useState<UserMinimal | null>(UserMinimal.map(initialUser));
  const [zipCode, setZipCode] = React.useState(getOrElse(roof?.zipCode, '')); 
  const [street, setStreet] = React.useState(getOrElse(roof?.street, ''));
  const [streetNumber, setStreetNumber] = React.useState(getOrElse(roof?.streetNumber, ''));
  const [city, setCity] = React.useState(getOrElse(roof?.city, ''));
  const [notes, setNotes] = React.useState(getOrElse(roof?.notes, ''));

  const [appTitle, setAppTitle] = React.useState(t('roofs:add_roof'));
  const [editMode, setEditMode] = React.useState(false);

  const [roofInitialState, setRoofInitialState] = React.useState<Roof>();
  const labelSize = 'labelMedium';

  React.useEffect(() => {
    if(roof){
      setAppTitle(t('roofs:edit_roof'));
      setRoofInitialState(roof);
      setEditMode(true);
    }
  }, [roof]);

  function getOrElse(value: any, otherwise: any){
      if(value != null && value != otherwise){
        return value + '';
      }
      return otherwise;
  }

  function reset(){
    
    if(editMode){
      if(roofInitialState != null){
        setRoofInitialState(roofInitialState);
      }
    } else {
      setWidth('');
      setHeight('');
      setUser(null);
      setZipCode('');
      setStreet('');
      setStreetNumber('');
      setCity('');
      setNotes('');
    }
  }

  function valid(): boolean{

    const valid = parseFloat(width) > 0 && 
                  parseFloat(height) > 0 &&
                  //user != null && 
                  //user?._id != null && 
                  zipCode?.length > 0 && 
                  street?.length > 0 && 
                  city?.length > 0 &&
                  streetNumber?.length > 0;

    if(!valid){
      errorSnackBar.current.present(t('common:error:required_fields'));
    }

    return valid;
  }

  function submit(){
   if(valid()){
      if(editMode){
        edit();
      } else {
        create();
      }
    }
   }

  const create = () => {

    const userMin = UserMinimal.map(initialUser);
    realm.write(() => {
    
      if(initialUser){
        const roof = realm.create(Roof, {
          _id: new Realm.BSON.UUID(),
          width: parseFloat(width),
          height: parseFloat(height),
          zipCode: zipCode,
          street: street,
          streetNumber: streetNumber,
          city: city,
          notes: notes,
        });
        initialUser.roofs.push(roof);
     }
    });
  
    reset();
    navigation.navigate(ROUTES.ROOF.HOME, {prevEvent: PAGE_EVENTS.ROOF.ADD_ROOF_SUCCESS, user: userMin});
  }

  function edit(){

    const userMin = UserMinimal.map(initialUser);

    if(roof != null){
        realm.write(() => {
          roof.width = parseFloat(width);
          roof.height = parseFloat(height);
          roof.zipCode = zipCode;
          roof.street = street;
          roof.streetNumber = streetNumber;
          roof.city = city;
          roof.notes = notes;
      });
    
      reset();
      navigation.navigate(ROUTES.ROOF.HOME, {prevEvent: PAGE_EVENTS.ROOF.EDIT_ROOF_SUCCESS, user: userMin});
    }
  }

  function FilterRow(){

    if(!user){
      return <></>
    }

    return(<View style={{alignSelf: 'flex-start', display: 'flex', marginBottom: CONTAINER_PADDING}}>
              <Chip 
                icon='human-male'
               >{user.firstName} {user.lastName}</Chip>
           </View>);
  }

  return (  <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
              >
                <View style={{flex: 1}}>
                  <AppBar title={appTitle} left={<Appbar.Action icon={'arrow-left'} onPress={() => {navigation.goBack()}} />}>
                    
                  </AppBar>
                  <View style={GlobalStyles.siteContainer}>

                  <FilterRow />

                    <ScrollView
                      style={{flex: 1}}
                      contentContainerStyle={styles.rowContainer}
                      bounces={false}
                    >
                        <View style={{...styles.rowContainer, width: '55%'}}>
                          <Text
                            style={styles.section}
                            variant={labelSize} 
                            >{t('roofs:generell_data')}</Text>

                            <TextInput
                              style={styles.inputContainer}
                              label={t('roofs:width')}
                              value={width}
                              onChangeText={setWidth}
                            />
                            <TextInput
                              style={styles.inputContainer}
                              label={t('roofs:height')}
                              value={height}
                              onChangeText={setHeight}
                            />

                            <Text
                              style={styles.section}
                              variant={labelSize}>
                                {t('roofs:address_data')}
                              </Text>

                            <TextInput
                              style={styles.inputContainer}
                              label={t('roofs:city')}
                              value={city}
                              onChangeText={setCity}
                            />


                            <TextInput
                              style={styles.inputContainer}
                              label={t('users:zip_code')}
                              value={zipCode}
                              onChangeText={setZipCode}
                            />

                            <TextInput
                              style={{...styles.inputContainer, marginBottom: 0}}
                              label={t('users:street')}
                              value={street}
                              onChangeText={setStreet}
                            />

                          <TextInput
                              style={{...styles.inputContainer, marginBottom: 0}}
                              label={t('users:street_number')}
                              value={streetNumber}
                              onChangeText={setStreetNumber}
                            />
                        </View>
                          
                        <View style={{width: '45%', alignItems: 'flex-end'}}>
                        <Text variant={labelSize} >
                                {t('users:notes')}
                              </Text>
                        
                        <NativeTextInput
                              style={styles.notesContainer}
                              value={notes}
                              multiline
                              onChangeText={setNotes}
                            />      
                        </View>

                      <View style={styles.buttonContainer}>
                        <Button icon="format-clear" 
                                mode="contained"
                                style={styles.button}
                                buttonColor={ThemeDark.colors.error}
                                onPress={reset}>
                          {t('common:reset')}
                        </Button>

                        <Button icon="account-sync" 
                                mode="contained"
                                style={styles.button}
                                buttonColor={ThemeDark.colors.inverseSurface}
                                onPress={submit}>
                          {t('common:save')}
                        </Button>
                      </View>
                    </ScrollView>
                    <ErrorSnackbar ref={errorSnackBar} />
                  </View>
                </View>
                </KeyboardAvoidingView>
              );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-end',
    width: '100%',     
    marginTop: 2 * CONTAINER_PADDING,
  },
  button: {
    marginTop: CONTAINER_PADDING,
    width: '44%'
  },
 inputContainer: {
  marginBottom: CONTAINER_PADDING*2,
  width: '49%'
 },
 section: {
  width: '100%'
 },
 rowContainer: {
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'space-between'
 },
 notesContainer: {
  flex: 1,
  width: '98%',
  backgroundColor: '#ffe57f',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: 'black',
  padding: CONTAINER_PADDING,
  paddingTop: CONTAINER_PADDING
 }
});

export default AddRoof;
