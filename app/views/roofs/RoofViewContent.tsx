import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {Roof} from '../../models/Roof';
import {User} from '../../models/User';
import {RoofImage} from '../../models/RoofImage';

interface Props {
  roof: Roof;
  user: User;
  roofImage?: RoofImage;
}

function RoofViewContent({roof, roofImage, user}: Props): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Icon size={18} source={'google-maps'} />
        <Text style={{marginLeft: 5}} variant="bodyMedium">
          {roof.city} {roof.zipCode}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Icon size={18} source={'city'} />
        <Text style={{marginLeft: 5}} variant="bodyMedium">
          {roof.street} {roof.streetNumber}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Icon size={18} source={'face-man'} />
        <Text style={{marginLeft: 5}} variant="bodyMedium">
          {user.firstName} {user.lastName}
        </Text>
      </View>
      {roofImage && (
        <View style={{flexDirection: 'row'}}>
          <Icon size={18} source={'face-man'} />
          <Text style={{marginLeft: 5}} variant="bodyMedium">
            {t('editor:totalPanels').replaceAll(
              '%s',
              (roofImage?.solarPanels?.length ?? 0) + '',
            )}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

export default RoofViewContent;
