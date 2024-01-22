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
    }
});