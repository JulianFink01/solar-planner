import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { List, MD3Colors, Text } from 'react-native-paper';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ThemeDark } from '../../themes/ThemeDark';
import { DEFAULT_LANGUAGE } from '../../constants/GlobalConstants';
import AppBar from '../../componentes/appBar/AppBar';
import { GlobalStyles } from '../../style/GlobalStyle';


function Settings({navigation, changeTab}: StackScreenProps): React.JSX.Element {

  const { t, i18n } = useTranslation();
  const [lang, changeLang] = React.useState(DEFAULT_LANGUAGE);
  const selectedLanguageCode = i18n.language;
  const [languages, setLanguages] = React.useState<any[]>([]);

  React.useEffect(() => {
    setLanguages([ 
      { code: 'en', label: t('languages:en') },
      { code: 'de', label: t('languages:de') },
     ]);
  }, []);

  return (
    <View style={GlobalStyles.pageWrapper}>
       <AppBar title={t('settings:title')}>
      </AppBar>

      <View style={GlobalStyles.siteContainer}>
        
        <List.Section style={{width: '100%'}}>
        <Text variant='labelLarge' style={{color: ThemeDark.colors.primary, width: '100%'}}>{t('settings:change_language')}</Text>

          {languages.map((currentLang, i) => {
            
            const selectedLanguage = currentLang.code === selectedLanguageCode;
        
            return (
              <List.Item
                  titleStyle={{color: selectedLanguage ? ThemeDark.colors.primary : ThemeDark.colors.secondary, fontWeight: selectedLanguage ? '600' : '400'}}
                  key={currentLang.code}
                  onPress={() => {
                    changeLang(currentLang.code);
                      i18n.changeLanguage(currentLang.code); 
                    }}
                  title={currentLang.label}
                  left={() => <List.Icon color={selectedLanguage ? ThemeDark.colors.primary : ''} icon="book" />}
                />
            );
            })}
        </List.Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  language: {
    paddingTop: 10,
    textAlign: 'center',
   },
});

export default Settings;
