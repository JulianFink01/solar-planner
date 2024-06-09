import * as React from 'react';
import MapView, {Region} from 'react-native-maps';
import {RoofMinimal} from '../../mapper/RoofMinimal';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AppBar from '../../componentes/appBar/AppBar';
import {t} from 'i18next';
import {Appbar, Button, Dialog} from 'react-native-paper';
import {GlobalStyles} from '../../style/GlobalStyle';
import ViewShot from 'react-native-view-shot';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {ThemeDark} from '../../themes/ThemeDark';

const GEO_CODING_API_URI =
  'https://geocode.maps.co/search?q=%s&api_key=6665860b9860f940413782kfx3023b1';

type Props = {
  onSelect: Function;
};

function GoogleMapsImagePicker(
  {onSelect}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const appTitle = t('roofs:get_from_maps');
  const [loading, setLoading] = React.useState(true);
  const [region, setRegion] = React.useState<Region>();
  const [visible, setVisible] = React.useState(false);

  const viewshotRef = React.useRef<ViewShot>();

  React.useImperativeHandle(ref, () => ({
    present(roof: RoofMinimal) {
      prepareLocation(roof);
      setVisible(true);
    },
    close() {
      setVisible(false);
    },
  }));

  function cancelModal() {
    setVisible(false);
  }

  async function prepareLocation(roof: RoofMinimal) {
    if (roof?.zipCode != null && roof?.street != null) {
      const address = `${roof?.street} ${roof?.streetNumber} ${roof?.zipCode} ${roof?.city} `;
      const addressAPI = GEO_CODING_API_URI.replace('%s', encodeURI(address));
      fetch(addressAPI)
        .then(response => response.json()) // Konvertiere die Antwort zu JSON
        .then(data => {
          setRegion({
            latitude: data[0].lat,
            longitude: data[0].lon,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
          console.log('here');
          setLoading(false);
        })
        .catch(error => {
          console.error('Fehler:', error); // Logge Fehler
        });
    }
  }

  function takeScreenshot() {
    viewshotRef.current.capture().then(uri => {
      setVisible(false);
      onSelect(uri);
    });
  }

  return (
    <Dialog visible={visible} onDismiss={cancelModal} style={styles.modal}>
      <Dialog.Title style={{}}>{appTitle}</Dialog.Title>
      <Dialog.Content>
        <View style={{height: '78%'}}>
          {!loading && (
            <ViewShot ref={viewshotRef}>
              <MapView
                mapType="satellite"
                style={{
                  width: '100%',
                  height: 500,
                }}
                region={region}
              />
            </ViewShot>
          )}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        {!loading && (
          <Button
            icon="camera"
            mode="contained"
            textColor="white"
            style={{...styles.button, alignSelf: 'flex-start'}}
            buttonColor={ThemeDark.colors.elevation.level5}
            onPress={takeScreenshot}>
            {t('common:picture')}
          </Button>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: CONTAINER_PADDING,
    width: '100%',
  },
});

export default React.forwardRef(GoogleMapsImagePicker);
