import * as React from 'react';
import 'react-native-get-random-values';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {GlobalStyles} from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import {Appbar, Button, TextInput} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {ThemeDark} from '../../themes/ThemeDark';
import {useObject, useRealm} from '@realm/react';
import Realm from 'realm';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {PAGE_EVENTS} from '../../constants/PageEvent';
import ErrorSnackbar from '../../componentes/ErrorSnackbar';
import {SolarPanelType} from '../../models/SolarPanelType';

function AddSolarPanelType({
  navigation,
  route,
}: StackScreenProps<any>): React.JSX.Element {
  const {t} = useTranslation();

  const errorSnackBar = React.useRef<any>(null);
  const solarPanelType = route.params?.solarPanelType?._id
    ? useObject(
        SolarPanelType,
        new Realm.BSON.UUID(route.params?.solarPanelType?._id),
      )
    : null;
  const realm = useRealm();

  const [name, setName] = React.useState(getOrElse(solarPanelType?.name, ''));
  const [width, setWidth] = React.useState(
    getOrElse(solarPanelType?.width, ''),
  );
  const [height, setHeight] = React.useState(
    getOrElse(solarPanelType?.height, ''),
  );
  const [power, setPower] = React.useState(
    getOrElse(solarPanelType?.performance, ''),
  );

  const [appTitle, setAppTitle] = React.useState(
    t('solarPanels:add_solar_panel'),
  );
  const [editMode, setEditMode] = React.useState(false);

  const [solarPanelTypeInitialState, setSolarPanelTypeInitialState] =
    React.useState<SolarPanelType>();
  const labelSize = 'labelMedium';

  function getOrElse(value: any, otherwise: any) {
    if (value != null && value != otherwise) {
      return value + '';
    }
    return otherwise;
  }

  React.useEffect(() => {
    if (solarPanelType) {
      setAppTitle(t('solarPanels:edit_solar_panel'));
      setSolarPanelTypeInitialState(solarPanelType);
      setEditMode(true);
    }
  }, [solarPanelType]);

  function setSolarPanelTypeValues(solarPanel: SolarPanelType) {
    setName(solarPanel.name + '');
    setWidth(solarPanel.width + '');
    setHeight(solarPanel.height + '');
    setPower(solarPanel.performance + '');
  }

  function reset() {
    if (editMode) {
      if (solarPanelTypeInitialState != null) {
        setSolarPanelTypeValues(solarPanelTypeInitialState);
      }
    } else {
      setName('');
      setWidth('');
      setHeight('');
      setPower('');
    }
  }

  function valid(): boolean {
    const valid =
      name?.length > 0 &&
      width?.length > 0 &&
      height?.length > 0 &&
      power?.length > 0;

    if (!valid) {
      errorSnackBar.current.present(t('common:error:required_fields'));
    }

    return valid;
  }

  function submit() {
    if (valid()) {
      if (editMode) {
        edit();
      } else {
        create();
      }
    }
  }

  function create() {
    realm.write(() => {
      realm.create(SolarPanelType, {
        _id: new Realm.BSON.UUID(),
        name: name,
        width: parseFloat(width),
        height: parseFloat(height),
        performance: parseFloat(power),
      });
    });
    reset();
    navigation.navigate(ROUTES.SOLAR_PANELS.HOME, {
      prevEvent: PAGE_EVENTS.SOLAR_PANELS.ADD_SOLAR_PANEL_TYPE_SUCCESS,
    });
  }

  function edit() {
    if (solarPanelTypeInitialState != null) {
      if (solarPanelType != null) {
        realm.write(() => {
          solarPanelType.name = name;
          solarPanelType.width = parseFloat(width);
          solarPanelType.height = parseFloat(height);
          solarPanelType.performance = parseFloat(power);
        });
      }

      reset();
      navigation.navigate(ROUTES.SOLAR_PANELS.HOME, {
        prevEvent: PAGE_EVENTS.SOLAR_PANELS.EDIT_SOLAR_PANEL_TYPE_SUCCESS,
      });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={{flex: 1}}>
        <AppBar
          title={appTitle}
          left={
            <Appbar.Action
              icon={'arrow-left'}
              onPress={() => {
                navigation.goBack();
              }}
            />
          }></AppBar>

        <View style={GlobalStyles.siteContainer}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.rowContainer}
            bounces={false}>
            <View style={{...styles.rowContainer, width: '100%'}}>
              <TextInput
                style={styles.inputContainer}
                label={t('solarPanels:name')}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.inputContainer}
                label={t('solarPanels:performance')}
                value={power}
                onChangeText={setPower}
              />

              <TextInput
                style={styles.inputContainer}
                label={t('solarPanels:width')}
                value={width}
                onChangeText={setWidth}
              />

              <TextInput
                style={styles.inputContainer}
                label={t('solarPanels:height')}
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                icon="format-clear"
                mode="contained"
                style={styles.button}
                buttonColor={ThemeDark.colors.error}
                onPress={reset}>
                {t('common:reset')}
              </Button>

              <Button
                icon="account-sync"
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
    width: '44%',
  },
  inputContainer: {
    marginBottom: CONTAINER_PADDING * 2,
    width: '49%',
  },
  section: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  notesContainer: {
    flex: 1,
    width: '98%',
    backgroundColor: '#ffe57f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    padding: CONTAINER_PADDING,
    paddingTop: CONTAINER_PADDING,
  },
});

export default AddSolarPanelType;
