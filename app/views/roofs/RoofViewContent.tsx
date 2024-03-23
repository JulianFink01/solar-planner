import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {Roof} from '../../models/Roof';
import {User} from '../../models/User';
import {RoofImage} from '../../models/RoofImage';
import {SolarPanelMinimal} from '../../mapper/SolarPanelMinimal';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';

interface Props {
  roof: Roof;
  user: User;
  solarPanels?: SolarPanelMinimal[];
  minimal: boolean;
}

function RoofViewContent({
  roof,
  solarPanels,
  user,
  minimal,
}: Props): React.JSX.Element {
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
      {!minimal && (
        <View
          style={{
            height: 20,
            marginBottom: 20,
            width: '100%',
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            opacity: 0.3,
          }}
        />
      )}
      {solarPanels && !minimal && (
        <View style={{flexDirection: 'row'}}>
          <Icon size={18} source={'solar-panel'} />
          <Text style={{marginLeft: 5}} variant="bodyMedium">
            {t('editor:totalPanels').replaceAll(
              '%s',
              (solarPanels?.length ?? 0) + '',
            )}
          </Text>
        </View>
      )}
      {roof && !minimal && (
        <>
          <View style={{flexDirection: 'row'}}>
            <Icon size={18} source={'solar-panel'} />
            <Text style={{marginLeft: 5}} variant="bodyMedium">
              {t('solarPanels:solar_panel')}: {roof.solarPanelType?.name}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 2 * CONTAINER_PADDING,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon size={18} source={'arrow-expand-horizontal'} />
              <Text style={{marginLeft: 5}} variant="bodyMedium">
                {roof.solarPanelType?.width} cm
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon size={18} source={'arrow-expand-vertical'} />
              <Text style={{marginLeft: 5}} variant="bodyMedium">
                {roof.solarPanelType?.height} cm
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon size={18} source={'solar-power'} />
              <Text style={{marginLeft: 5}} variant="bodyMedium">
                {roof.solarPanelType?.performance} kW
              </Text>
            </View>
          </View>
        </>
      )}
      {solarPanels?.length > 0 && !minimal && (
        <View style={{flexDirection: 'row'}}>
          <Icon size={18} source={'solar-power'} />
          <Text style={{marginLeft: 5}} variant="bodyMedium">
            {t('editor:totalPower', {
              power: solarPanels?.length * roof.solarPanelType?.performance,
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

RoofViewContent.defaultProps = {
  minimal: true,
};
export default RoofViewContent;
