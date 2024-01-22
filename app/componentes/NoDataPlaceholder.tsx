import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Icon, IconButton, Text } from "react-native-paper";
import { Image } from "react-native-paper/lib/typescript/components/Avatar/Avatar";
import { CONTAINER_PADDING } from "../constants/GlobalConstants";

interface Props extends StackNavigationProp {
    onPress?: () => {},
    message: string,
    icon: string
}

function NoDataPlaceholder({onPress, message, navigation, icon}: StackNavigationProp): React.JSX.Element {

    const {t} = useTranslation();

    return (
        <View style={{flex: 1,height: '100%', justifyContent: 'center', alignItems: 'center', opacity: 0.3}}>
                <View style={{borderColor: 'white', borderWidth: 1, borderRadius: 120, padding: 20}}>
                    <IconButton
                        icon={icon}
                        size={180}
                        animated
                        onPress={onPress}
                    />
                </View>
                <Text variant="bodyMedium" style={{marginTop: 2 * CONTAINER_PADDING, textAlign: 'center'}}>{t('users:no_data')}</Text>
            </View>
    )
 }

NoDataPlaceholder.defaultProps = {
    onPress: () => {}
}

export default NoDataPlaceholder;

