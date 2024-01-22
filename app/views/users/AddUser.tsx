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
import { Appbar, Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';
import {useObject, useRealm} from '@realm/react';
import { User } from '../../models/User';
import Realm from 'realm';
import { ROUTES } from '../../componentes/navigtation/Routes';
import { PAGE_EVENTS } from '../../constants/PageEvent';
import ErrorSnackbar from '../../componentes/ErrorSnackbar';

function AddUser({navigation, route}: StackScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  
  const errorSnackBar = React.useRef<any>(null);

  const user = route.params?.user?.id ? useObject(User, new Realm.BSON.UUID(route.params?.user?.id)): null;
  const realm = useRealm();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [eMail, setEMail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [placeOfResidence, setPlaceOfResidence] = React.useState("");
  const [zipCode, setZipCode] = React.useState(""); 
  const [street, setStreet] = React.useState("");
  const [streetNumber, setStreetNumber] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [appTitle, setAppTitle] = React.useState(t('users:add_user'));
  const [editMode, setEditMode] = React.useState(false);

  const [userInitialState, setUserInitialState] = React.useState<User>();
  const labelSize = 'labelMedium';

  React.useEffect(() => {
    if(user){
      setAppTitle(t('users:edit_user'));
      setUserInitialState(user);
      setUserValues(user);
      setEditMode(true);
    }
  }, [user]);

  function setUserValues(user: User){

      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEMail(user.eMail);
      setPhoneNumber(user.phoneNumber);
      setPlaceOfResidence(user.placeOfResidence);
      setZipCode(user.zipCode);
      setStreet(user.street);
      setStreetNumber(user.streetNumber);
      setNotes(user.notes);
  }

  function reset(){
    
    if(editMode){
      if(userInitialState != null){
        setUserValues(userInitialState);
      }
    } else {
      setFirstName('');
      setLastName('');
      setEMail('');
      setPhoneNumber('');
      setPlaceOfResidence('');
      setZipCode('');
      setStreet('');
      setStreetNumber('');
      setNotes('');
    }
  }

  function valid(): boolean{

    const valid = firstName?.length > 0 && 
    lastName?.length > 0 &&
    eMail?.length > 0 && 
    phoneNumber?.length > 0 && 
    placeOfResidence?.length > 0&& 
    zipCode?.length > 0 && 
    street?.length > 0 && 
    streetNumber?.length > 0     ;

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

  function create() {
    realm.write(() => {
      
      realm.create(User, {
        _id: new Realm.BSON.UUID(),
        firstName: firstName,
        lastName: lastName,
        eMail: eMail,
        phoneNumber: phoneNumber,
        placeOfResidence: placeOfResidence,
        zipCode: zipCode,
        street: street,
        streetNumber: streetNumber,
        notes: notes
      });
    });
    reset();
    navigation.navigate(ROUTES.USER.HOME, {prevEvent: PAGE_EVENTS.USER.ADD_USER_SUCCESS});
  }

  function edit(){
    
    if(userInitialState != null){    
      if(user != null){
          realm.write(() => {
            user.firstName = firstName;
            user.lastName = lastName,
            user.eMail = eMail;
            user.phoneNumber = phoneNumber;
            user.placeOfResidence = placeOfResidence;
            user.zipCode = zipCode;
            user.street = street;
            user.streetNumber = streetNumber;
            user.notes = notes;
        });
      }
      
      reset();
      navigation.navigate(ROUTES.USER.HOME, {prevEvent: PAGE_EVENTS.USER.EDIT_USER_SUCCESS});
    }
  }

  return (  <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
              >
                <View style={{flex: 1}}>
                  <AppBar title={appTitle} left={<Appbar.Action icon={'arrow-left'} onPress={() => {navigation.goBack()}} />}>
                    
                  </AppBar>
                  
                  <View style={GlobalStyles.siteContainer}>
                    <ScrollView
                      style={{flex: 1}}
                      contentContainerStyle={styles.rowContainer}
                      bounces={false}
                    >
                        <View style={{...styles.rowContainer, width: '55%'}}>
                          <Text
                            style={styles.section}
                            variant={labelSize} 
                            >{t('users:personal_data')}</Text>

                            <TextInput
                              style={styles.inputContainer}
                              label={t('users:firstName')}
                              value={firstName}
                              onChangeText={setFirstName}
                            />
                            <TextInput
                              style={styles.inputContainer}
                              label={t('users:lastName')}
                              value={lastName}
                              onChangeText={setLastName}
                            />

                            <Text
                              style={styles.section}
                              variant={labelSize}>
                                {t('users:contacting_information')}
                              </Text>

                            <TextInput
                              style={styles.inputContainer}
                              label={t('users:email')}
                              value={eMail}
                              onChangeText={setEMail}
                            />

                            <TextInput
                              style={styles.inputContainer}
                              label={t('users:phone_number')}
                              value={phoneNumber}
                              onChangeText={setPhoneNumber}
                            />


                            <Text
                              style={styles.section}
                              variant={labelSize}
                            >{t('users:address_data')}</Text>

                          <TextInput
                              style={styles.inputContainer}
                              label={t('users:place_of_residence')}
                              value={placeOfResidence}
                              onChangeText={setPlaceOfResidence}
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

export default AddUser;
