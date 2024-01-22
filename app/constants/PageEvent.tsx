import UserActions from "../views/users/UserActions"
import RoofActions from "../views/roofs/RoofActions"
import SettingsActions from "../views/settings/SettingsActions"
import EditorActions from "../views/editor/EditorActions"

export const PAGE_EVENTS = {
    USER: {...UserActions},
    ROOF: {...RoofActions},
    SETTINGS: {...SettingsActions},
    EDITOR: {...EditorActions}
}