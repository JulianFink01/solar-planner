import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import ActionContainer from '../../componentes/ActionContainer';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {UserMinimal} from '../../mapper/UserMinimal';
import {SolarPanelType} from '../../mapper/SolarPanelType';

function SolarPanelListView({
  navigation,
  route,
  solarPanel,
  displayActions,
  onOpenDelete,
}: StackNavigationProp<any>): React.JSX.Element {
  function editSolarPanelType(sp: SolarPanelType) {
    navigation.navigate(ROUTES.SOLAR_PANELS.ADD_SOLAR_PANEL_TYPE, {
      solarPanelType: sp,
    });
  }

  return (
    <List.Item
      key={solarPanel._id.toString()}
      style={{paddingRight: 0}}
      title={solarPanel.name}
      left={() => <List.Icon icon="solar-panel" />}
      right={() => {
        if (!displayActions) {
          return;
        }

        return (
          <ActionContainer
            deleteAction
            editAction
            editIcon="pencil"
            onDelete={() => onOpenDelete(solarPanel)}
            onEdit={() => editSolarPanelType(SolarPanelType.map(solarPanel))}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({});
SolarPanelListView.defaultProps = {
  displayActions: true,
};
export default SolarPanelListView;
