import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {  Appbar, DefaultTheme, List, Text } from 'react-native-paper';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ThemeDark } from '../../themes/ThemeDark';
import { DEFAULT_LANGUAGE } from '../../style/GlobalConstants';
import AppBar from '../../componentes/appBar/AppBar';
import { GlobalStyles } from '../../style/GlobalStyle';

const languages = [ 
 { code: 'en', label: t('languages:en') },
 { code: 'de', label: t('languages:de') },
];



function Settings({navigation, changeTab}: StackScreenProps): React.JSX.Element {

  const { t, i18n } = useTranslation();
  const [lang, changeLang] = React.useState(DEFAULT_LANGUAGE);
  const selectedLanguageCode = i18n.language;

  return (
    <View style={GlobalStyles.pageWrapper}>
       <AppBar title={t('settings:title')}>
      </AppBar>

      <View style={GlobalStyles.siteContainer}>
        <Text variant='labelLarge' style={{color: ThemeDark.colors.outline}}>{t('settings:general')}</Text>
        <List.AccordionGroup>
          <List.Accordion title={t('settings:change_language')} id="1">
            {languages.map((currentLang, i) => {
            
            const selectedLanguage = currentLang.code === selectedLanguageCode;
        
            return (
              <List.Item 
                titleStyle={{color: selectedLanguage ? ThemeDark.colors.inverseSurface : ThemeDark.colors.secondary, 
                            fontWeight: selectedLanguage ? '600' : '400'}}
                key={currentLang.code}
                onPress={() => {
                changeLang(currentLang.code);
                  i18n.changeLanguage(currentLang.code); 
                }}
                title={currentLang.label} />
            );
            })}
          </List.Accordion>
        
        </List.AccordionGroup>
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
