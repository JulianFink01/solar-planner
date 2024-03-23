import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Button,
  Chip,
  Dialog,
  Divider,
  List,
  Text,
} from 'react-native-paper';
import {GlobalStyles} from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import {StackNavigationProp} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {PAGE_EVENTS} from '../../constants/PageEvent';
import {useQuery} from '@realm/react';
import {User} from '../../models/User';
import {useRealm} from '@realm/react';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import {UserMinimal} from '../../mapper/UserMinimal';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {ThemeDark} from '../../themes/ThemeDark';
import SolarPanelTypeListView from './SolarPanelTypeListView';
import {SolarPanelType} from '../../models/SolarPanelType';

function SolarPanelTypes({
  navigation,
  route,
}: StackNavigationProp<any>): React.JSX.Element {
  const [deletePromptVisible, setDeletePromptVisible] = React.useState(false);
  const [solarPanelTypeToDelete, setSolarPanelToDelete] =
    React.useState<SolarPanelType | null>(null);
  const [sortReverse, setSortReverse] = React.useState<boolean>(false);

  const {t} = useTranslation();
  const realm = useRealm();
  const snackbBar = React.useRef<any>(null);
  const solarPanelTypes = useQuery(SolarPanelType);

  React.useEffect(() => {
    if (
      route?.params?.prevEvent ===
      PAGE_EVENTS.SOLAR_PANELS.ADD_SOLAR_PANEL_TYPE_SUCCESS
    ) {
      snackbBar?.current?.present(t('solarPanels:add_solar_panel_success'));
    } else if (
      route?.params?.prevEvent ===
      PAGE_EVENTS.SOLAR_PANELS.EDIT_SOLAR_PANEL_TYPE_SUCCESS
    ) {
      snackbBar?.current?.present(t('solarPanels:edit_solar_panel_success'));
    }
  }, [route]);

  function addSolarPanelType() {
    navigation.navigate(ROUTES.SOLAR_PANELS.ADD_SOLAR_PANEL_TYPE);
  }

  function deleteSolarPanelType() {
    const affected = solarPanelTypeToDelete;
    setDeletePromptVisible(false);
    setSolarPanelToDelete(null);
    if (affected != null) {
      realm.write(() => {
        realm.delete(affected);
      });
    }
  }

  function openDeleteSolarTypePanelPrompt(solarPanelType: SolarPanelType) {
    setSolarPanelToDelete(solarPanelType);
    setDeletePromptVisible(true);
  }

  function cancelDelete() {
    setDeletePromptVisible(false);
    setSolarPanelToDelete(null);
  }

  function FilterRow() {
    function changeSort() {
      setSortReverse(!sortReverse);
    }

    if (solarPanelTypes.length < 1) {
      return <></>;
    }

    return (
      <View style={{alignSelf: 'flex-start', display: 'flex'}}>
        <Chip
          icon={
            sortReverse
              ? 'sort-alphabetical-ascending'
              : 'sort-alphabetical-descending'
          }
          onPress={changeSort}>
          {t('common:sort:change')}
        </Chip>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('solarPanels:title')}>
        <Appbar.Action icon={'plus'} onPress={addSolarPanelType} />
      </AppBar>

      <View style={GlobalStyles.siteContainer}>
        {solarPanelTypes.length === 0 && (
          <NoDataPlaceholder
            icon="solar-panel"
            onPress={addSolarPanelType}
            message={t('solarPanels:no_data')}
          />
        )}

        <FilterRow />
        <ScrollView style={{flex: 1, width: '100%'}} bounces={false}>
          <List.Section>
            {solarPanelTypes
              .sorted('name', sortReverse)
              .map((solarPanel, index) => {
                const dividerKey = 'divider-' + solarPanel._id.toString();
                const wrapperKey = 'wrapper-' + solarPanel._id.toString();
                const solarPanelKey = 'solar_panel' + solarPanel._id.toString();

                return (
                  <View key={wrapperKey}>
                    <SolarPanelTypeListView
                      navigation={navigation}
                      onOpenDelete={openDeleteSolarTypePanelPrompt}
                      solarPanel={solarPanel}
                      key={solarPanelKey}
                    />
                    {index < solarPanelTypes.length - 1 && (
                      <Divider key={dividerKey} />
                    )}
                  </View>
                );
              })}
          </List.Section>
        </ScrollView>

        <Dialog
          visible={deletePromptVisible}
          onDismiss={cancelDelete}
          style={{width: '50%', alignSelf: 'center'}}>
          <Dialog.Icon icon="alert" size={3 * CONTAINER_PADDING} />
          <Dialog.Title style={{}}>
            {t('solarPanels:delete_solar_panel_title')}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('solarPanels:delete_solar_panel_prompt', {
                user: solarPanelTypeToDelete?.name,
              })}
            </Text>
            <Divider style={{marginBottom: 20, marginTop: 20}} />
            <View style={{width: '30%', alignSelf: 'center'}}>
              <Button onPress={cancelDelete}>{t('common:cancel')}</Button>
              <Button
                onPress={deleteSolarPanelType}
                textColor={ThemeDark.colors.background}
                style={{backgroundColor: ThemeDark.colors.error}}>
                {t('common:submit')}
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>

        <SuccessSnackbar ref={snackbBar} key={'snackbar-success'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default SolarPanelTypes;
