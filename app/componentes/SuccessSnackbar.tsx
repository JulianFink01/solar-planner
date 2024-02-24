import * as React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {MD3DarkTheme, SnackbarProps} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Button, Snackbar} from 'react-native-paper';
import {ThemeDark} from '../themes/ThemeDark';

interface Props {}

function SuccessSnackbar({}: Props, ref: React.Ref<any>): React.JSX.Element {
  const {t} = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onDismissSnackBar = () => {
    setVisible(false);
  };

  React.useImperativeHandle(ref, () => ({
    present(message: string) {
      setVisible(true);
      setMessage(message);
    },
    close() {
      setVisible(false);
    },
  }));

  return (
    <Snackbar
      style={{backgroundColor: ThemeDark.colors.secondary}}
      duration={2000}
      visible={visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: t('common:close'),
        onPress: () => {
          onDismissSnackBar();
        },
      }}>
      {message}
    </Snackbar>
  );
}

export default React.forwardRef(SuccessSnackbar);
