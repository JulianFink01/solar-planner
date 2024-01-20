import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, Avatar, Button, Card, List, Text} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import ActionContainer from '../../componentes/ActionContainer';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';

function Editor({navigation, changeTab}: StackScreenProps): React.JSX.Element {

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const { t } = useTranslation();

  return (
    <View style={GlobalStyles.pageWrapper}>
    <AppBar title={t('editor:title')}>
      <Appbar.Action icon={'account-plus'} onPress={() => {}} />
      <Appbar.Action icon="magnify" onPress={() => {}} />
      <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
    </AppBar>
    
    <View style={GlobalStyles.siteContainer}>
      <ScrollView
        style={{flex: 1}}
        bounces={false}
      >
        <Card>
          <Card.Title title="Card Title" subtitle="Card Subtitle" left={() => <Avatar.Icon size={50} icon="home-roof" />} />
          <Card.Content>
            <Text variant="titleLarge">Card title</Text>
            <Text variant="bodyMedium">Card content</Text>
          </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>    
      </ScrollView>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Editor;
