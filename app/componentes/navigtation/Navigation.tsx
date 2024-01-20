import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Roofs from '../../views/roofs/Roofs';
import Users from '../../views/users/Users';
import Editor from '../../views/editor/Editor';
import Settings from '../../views/settings/Settings';
import { useTranslation } from 'react-i18next';
import { ThemeDark } from '../../themes/ThemeDark';
import { ROUTES } from './Routes';
import { StackScreenProps } from '@react-navigation/stack';


const Navigation = ({navigation}: StackScreenProps) => {

  const { t } = useTranslation();

  const routesDefinition = [
    { key: ROUTES.USER.HOME, title: t('users:title'), focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline'},
    { key: ROUTES.ROOF.HOME, title: t('roofs:title'), focusedIcon: 'home-roof' },
    { key: ROUTES.EDITOR.HOME, title: t('editor:title'), focusedIcon: 'solar-panel-large' },
    { key: ROUTES.SETTINGS.HOME, title: t('settings:title'), focusedIcon: 'dots-horizontal'}
  ];

  const [index, setIndex] = React.useState(0);
  
  const [routes, setRoutes] = React.useState(routesDefinition);

  React.useEffect(() => {
      setRoutes(routesDefinition);
  }, [t])


  const renderScene = BottomNavigation.SceneMap({
    users: () => <Users navigation={navigation} />,
    roofs: () => <Roofs navigation={navigation} />,
    editor: () => <Editor navigation={navigation} />,
    settings:() =>  <Settings navigation={navigation} />
  });

  React.useEffect(() => {
    console.log(navigation)
  })

  return (
    <BottomNavigation
  
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Navigation;