import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import { GlobalStyles } from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { CONTAINER_PADDING } from '../../style/GlobalConstants';
import { ThemeDark } from '../../themes/ThemeDark';

function AddUser({navigation, route}: StackScreenProps): React.JSX.Element {

  
  const { t } = useTranslation();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [eMail, setEMail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [placeOfResidence, setPlaceOfResidence] = React.useState("");
  const [zipCode, setZipCode] = React.useState(""); 
  const [street, setStreet] = React.useState("");
  const [streetNumber, setStreetNumber] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [appTitle, setAppTitle] = React.useState(t('users:add_user'));


  const labelSize = 'labelMedium';

  React.useEffect(() => {
    if(route.params != null){
      setAppTitle(t('users:edit_user'));

      if(route.params?.firstName != null){
        setFirstName(route.params.firstName);
      }
      
      if(route.params?.lastName != null){
        setLastName(route.params.lastName);
      }
    }
  }, [route.params]);

  function reset(){
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setEMail('');
    setPhoneNumber('');
    setPlaceOfResidence('');
    setZipCode('');
    setStreet('');
    setStreetNumber('');
    setNotes('');
  }

  return (  
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

                <TextInput
                  style={styles.inputContainer}
                  label={t('users:birthDate')}
                  value={birthDate}
                  onChangeText={setBirthDate}
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
                  label={t('users:street_number')}
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
                    onPress={() => reset()}>
              {t('common:reset')}
            </Button>

            <Button icon="account-sync" 
                    mode="contained"
                    style={styles.button}
                    buttonColor={ThemeDark.colors.inverseSurface}
                    onPress={() => console.log('Pressed')}>
              {t('common:save')}
            </Button>
          </View>

        </ScrollView>
      </View>
    </View>
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
