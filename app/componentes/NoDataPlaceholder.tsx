import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {CONTAINER_PADDING} from '../constants/GlobalConstants';
import {StackNavigationProp} from '@react-navigation/stack';

interface Props extends StackNavigationProp<any, any, any> {
  onPress?: () => {};
  message: string;
  icon: string;
  size: number;
}

function NoDataPlaceholder({
  onPress,
  message,
  navigation,
  size,
  icon,
}: Props): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.3,
      }}>
      <View
        style={{
          borderColor: 'white',
          borderWidth: 1,
          borderRadius: 120,
          padding: 20,
        }}>
        <IconButton icon={icon} size={size} animated onPress={onPress} />
      </View>
      <Text
        variant="bodyMedium"
        style={{marginTop: 2 * CONTAINER_PADDING, textAlign: 'center'}}>
        {message}
      </Text>
    </View>
  );
}

NoDataPlaceholder.defaultProps = {
  onPress: () => {},
  size: 180,
};

export default NoDataPlaceholder;
