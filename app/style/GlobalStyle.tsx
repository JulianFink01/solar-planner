import { StyleSheet } from "react-native";
import { CONTAINER_PADDING } from "../constants/GlobalConstants";
import { ThemeDark } from "../themes/ThemeDark";

export const GlobalStyles =  StyleSheet.create({
    container: {
        flex: 1,
        padding: CONTAINER_PADDING
    },
    siteContainer: {
        flex: 1,
        padding: CONTAINER_PADDING,
        paddingBottom: 0,
        paddingTop: 0,
        alignItems: 'center'
    },
    flex_row: {
        flexDirection: 'row',
    },
    align_right: {
        justifyContent: 'flex-end'
    },
    pageWrapper: {
        flex: 1,
        backgroundColor: ThemeDark.colors.background
    },
    informationContainer: {
        flex: 1,
        position: 'absolute',
        padding: 20,
        width: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.95,
        backgroundColor: ThemeDark.colors.background
      },
});