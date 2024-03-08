import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Chip,
  Dialog,
  Divider,
  List,
  Text,
} from 'react-native-paper';
import {GlobalStyles} from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import {StackScreenProps} from '@react-navigation/stack';
import {ROUTES} from '../../componentes/navigtation/Routes';
import {UserMinimal} from '../../mapper/UserMinimal';
import {useQuery, useRealm} from '@realm/react';
import {Roof} from '../../models/Roof';
import NoDataPlaceholder from '../../componentes/NoDataPlaceholder';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {ThemeDark} from '../../themes/ThemeDark';
import SuccessSnackbar from '../../componentes/SuccessSnackbar';
import {PAGE_EVENTS} from '../../constants/PageEvent';
import RoofListView from './RoofListView';
import {User} from '../../models/User';
import RoofCardView from './RoofCardView';

function Roofs({navigation, route}: StackScreenProps<any>): React.JSX.Element {
  const [user, setUser] = React.useState<UserMinimal | null>();
  const [deletePromptVisible, setDeletePromptVisible] = React.useState(false);
  const [roofToDelete, setRoofToDelete] = React.useState<Roof | null>(null);
  const [sortReverse, setSortReverse] = React.useState<boolean>(false);
  const [cardView, setCardView] = React.useState<boolean>(true);

  const {t} = useTranslation();
  const users = useQuery(User);
  const realm = useRealm();
  const snackbBar = React.useRef<any>(null);

  React.useEffect(() => {
    if (route?.params?.user) {
      setUser(route.params.user);
    }
    if (route?.params?.prevEvent === PAGE_EVENTS.ROOF.ADD_ROOF_SUCCESS) {
      snackbBar?.current?.present(t('roofs:add_roof_success'));
    } else if (
      route?.params?.prevEvent === PAGE_EVENTS.ROOF.EDIT_ROOF_SUCCESS
    ) {
      snackbBar?.current?.present(t('roofs:edit_roof_success'));
    }
  }, [route]);

  function addRoof() {
    navigation.navigate(ROUTES.ROOF.ADD_ROOF, {user: user});
  }

  function FilterRow() {
    function clearUser() {
      setUser(null);
    }

    function changeSort() {
      setSortReverse(!sortReverse);
    }
    function changeListView() {
      setCardView(!cardView);
    }

    return (
      <View
        style={{
          alignSelf: 'flex-start',
          flexDirection: 'row',
          display: 'flex',
          paddingBottom: 10,
        }}>
        <Chip
          icon={
            sortReverse
              ? 'sort-alphabetical-ascending'
              : 'sort-alphabetical-descending'
          }
          style={styles.chip}
          onPress={changeSort}>
          {t('common:sort:change')}
        </Chip>
        <Chip
          icon={cardView ? 'view-list' : 'card'}
          style={styles.chip}
          onPress={changeListView}>
          {t('common:view:change')}
        </Chip>
        {user && (
          <Chip icon="human-male" style={styles.chip} onClose={clearUser}>
            {user.firstName} {user.lastName}
          </Chip>
        )}
      </View>
    );
  }

  function deleteRoof() {
    const affectedRoof = roofToDelete;
    setDeletePromptVisible(false);
    setRoofToDelete(null);
    if (affectedRoof != null) {
      realm.write(() => {
        realm.delete(affectedRoof);
      });
    }
  }

  function openDeleteRoofPrompt(roof: Roof) {
    setRoofToDelete(roof);
    setDeletePromptVisible(true);
  }

  function cancelDelete() {
    setDeletePromptVisible(false);
    setRoofToDelete(null);
  }

  function filterUsers(value: User) {
    let contain = true;

    if (user && contain === true) {
      contain = value._id.toString() === user._id;
    }
    return contain;
  }

  function getAllUserRoofs(user: User) {
    return user.roofs;
  }

  function reduceArray(first?: any, second?: any) {
    if (second != null) {
      return [...first, ...second];
    }

    return first;
  }

  function AcordionTitle({_user}: {_user: User}) {
    return (
      <View
        style={{
          width: '100%',
          marginTop: CONTAINER_PADDING - 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Avatar.Icon
          icon={'account'}
          size={25}
          style={{marginBottom: 10, marginRight: 10}}
        />
        <Text
          style={{marginRight: 10, marginBottom: 10}}
          variant={'titleLarge'}>
          {_user.firstName} {_user.lastName}
        </Text>
        <View
          style={{flex: 1, height: 1, backgroundColor: 'white', opacity: 0.2}}
        />
      </View>
    );
  }

  const allRoofs = users
    .filter(filterUsers)
    .map(getAllUserRoofs)
    .reduce(reduceArray, []);
  const usersFiltered = users
    .sorted('firstName', sortReverse)
    .filter(filterUsers);
  return (
    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('roofs:title')}>
        {user != null && <Appbar.Action icon={'plus'} onPress={addRoof} />}
      </AppBar>

      <View style={GlobalStyles.siteContainer}>
        <FilterRow />

        {allRoofs.length === 0 && (
          <NoDataPlaceholder
            icon="home-roof"
            onPress={addRoof}
            message={t('roofs:no_data')}
          />
        )}

        <ScrollView bounces={false} style={{width: '100%'}}>
          {usersFiltered
            .filter(u => u.roofs.length > 0)
            .map((_user, userIndex) => {
              const userKey = _user._id.toString();

              return (
                <View style={{width: '100%'}} key={userKey}>
                  <AcordionTitle _user={_user} />
                  <List.Section
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                    }}>
                    {_user.roofs.map((roof, index, array) => {
                      const wrapperKey = 'wrapper-' + roof._id.toString();
                      const roofKey = 'roof' + roof._id.toString();

                      return (
                        <View
                          key={wrapperKey}
                          style={cardView ? styles.cardView : styles.listView}>
                          {cardView && (
                            <RoofCardView
                              navigation={navigation}
                              key={'card-' + roofKey}
                              onOpenDelete={openDeleteRoofPrompt}
                              roof={roof}></RoofCardView>
                          )}
                          {!cardView && (
                            <RoofListView
                              navigation={navigation}
                              key={'list-' + roofKey}
                              onOpenDelete={openDeleteRoofPrompt}
                              roof={roof}></RoofListView>
                          )}
                          {!cardView && index < array.length - 1 && <Divider />}
                        </View>
                      );
                    })}
                  </List.Section>
                </View>
              );
            })}
        </ScrollView>

        <Dialog
          visible={deletePromptVisible}
          onDismiss={cancelDelete}
          style={{width: '50%', alignSelf: 'center'}}>
          <Dialog.Icon icon="alert" size={3 * CONTAINER_PADDING} />
          <Dialog.Title style={{}}>{t('roofs:delete_roof_title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t('roofs:delete_roof_prompt')}</Text>
            <Divider style={{marginBottom: 20, marginTop: 20}} />
            <View style={{width: '30%', alignSelf: 'center'}}>
              <Button onPress={cancelDelete}>{t('common:cancel')}</Button>
              <Button
                onPress={deleteRoof}
                textColor={ThemeDark.colors.background}
                style={{backgroundColor: ThemeDark.colors.error}}>
                {t('common:submit')}
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>

        <SuccessSnackbar ref={snackbBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 10,
  },
  cardView: {
    width: '50%',
    paddingRight: 2 * CONTAINER_PADDING,
    marginBottom: 2 * CONTAINER_PADDING,
  },
  listView: {
    width: '100%',
  },
});

export default Roofs;
