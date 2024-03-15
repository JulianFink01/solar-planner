import * as React from 'react';
import {
  LinearGradient,
  Path,
  Rect,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import {pointsToSvg, transforMatrix} from '../../../utils/PerspectiveHelper';
import {Roof} from '../../../models/Roof';
import {SolarPanelMinimal} from '../../../mapper/SolarPanelMinimal';
import TransformedPath from './TransformedPath';
import {ThemeDark} from '../../../themes/ThemeDark';

type Line = PointInterface[];
const SOLAR_GRID_ROWS = 4;
const SOLAR_GRID_COLS = 3;

interface Props {
  allScreen: PointInterface[];
  solarPanel: SolarPanelMinimal;
  debugView: boolean;
  displayGrid: boolean;
  roofPoints: PointInterface[];
  imageSize: {width: number; height: number};
  roof: Roof;
  opacity: number;
  lockMode: boolean;
}
function SolarPanel(
  {
    imageSize,
    lockMode,
    roof,
    allScreen,
    solarPanel,
    displayGrid,
    debugView,
    roofPoints,
    opacity,
  }: Props,
  ref: any,
) {
  const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
  const oneZentimeterVertical = imageSize.height / roof.height / 100;

  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (lockMode) {
      setActive(false);
    }
  }, [lockMode]);

  const coordinates = solarPanel.getCoordinates(
    roof.distanceBetweenPanelsCM,
    oneZentimeterHorizontal,
    oneZentimeterVertical,
  );
  const wrapperCoordinates = solarPanel.getWrapperCoordinates(
    roof.distanceBetweenPanelsCM,
    oneZentimeterHorizontal,
    oneZentimeterVertical,
  );

  React.useImperativeHandle(ref, () => ({
    checkForAction(x: number, y: number) {
      if (lockMode) {
        setActive(false);
        return;
      }
      const colides = checkIfColides(x, y);
      setActive(colides);
    },
  }));

  function checkIfColides(x: number, y: number) {
    const transformedPoints: PointInterface[] = transforMatrix(
      allScreen,
      coordinates,
      roofPoints,
    );

    let inside = false;
    const n = transformedPoints.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = transformedPoints[i].x,
        yi = transformedPoints[i].y;
      const xj = transformedPoints[j].x,
        yj = transformedPoints[j].y;

      const intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function getInnerStroke() {
    const strokeWidth = 3;
    return [
      {x: coordinates[0].x + strokeWidth, y: coordinates[0].y + strokeWidth},
      {x: coordinates[1].x - strokeWidth, y: coordinates[1].y + strokeWidth},
      {x: coordinates[2].x - strokeWidth, y: coordinates[2].y - strokeWidth},
      {x: coordinates[3].x + strokeWidth, y: coordinates[3].y - strokeWidth},
    ];
  }

  return (
    <>
      <TransformedPath
        pathStyle="fill"
        strokeWidth={3}
        opacity={opacity}
        color={ThemeDark.colors.background}
        useGradient
        debugView={false}
        allScreen={allScreen}
        roofPoints={roofPoints}
        points={coordinates}
      />

      <TransformedPath
        pathStyle="stroke"
        strokeWidth={3}
        opacity={opacity}
        color={
          active ? ThemeDark.colors.secondary : ThemeDark.colors.background
        }
        useGradient
        debugView={false}
        allScreen={allScreen}
        roofPoints={roofPoints}
        points={getInnerStroke()}
      />

      {displayGrid && debugView && (
        <TransformedPath
          strokeWidth={1}
          color="yellow"
          debugView={false}
          allScreen={allScreen}
          roofPoints={roofPoints}
          points={wrapperCoordinates}
        />
      )}
    </>
  );
}
export default React.forwardRef(SolarPanel);
