import UserRoutes from '../../views/users/UserRoutes';
import RoufeRoots from '../../views/roofs/RoofRoutes';
import SettingsRoutes from '../../views/settings/SettingsRoutes';
import EditorRoutes from '../../views/editor/EditorRoutes';
import SolarPanelRoutes from '../../views/solar-panels/SolarPanelRoutes';

export const ROUTES = {
  USER: {...UserRoutes},
  ROOF: {...RoufeRoots},
  SETTINGS: {...SettingsRoutes},
  EDITOR: {...EditorRoutes},
  NAVIGATOR: {HOME: 'navigator'},
  SOLAR_PANELS: {...SolarPanelRoutes},
};
