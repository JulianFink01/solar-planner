import * as React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {Snackbar} from 'react-native-paper';
import {ThemeDark} from '../themes/ThemeDark';

function ErrorSnackbar(
  props: StackNavigationProp<any, any, any>,
  ref: React.Ref<any>,
): React.JSX.Element {
  const {t} = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const [message, setMessage] = React.useState('');

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
      style={{backgroundColor: ThemeDark.colors.error}}
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

export default React.forwardRef(ErrorSnackbar);
