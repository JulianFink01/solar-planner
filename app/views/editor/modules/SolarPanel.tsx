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
const STROKE_WIDTH = 3;

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
  const [isDraging, setIsDraging] = React.useState(false);

  const [solarPanelState, setSolarPanelState] = React.useState(
    solarPanel.copy(),
  );
  const [coordinates, setCoordinates] = React.useState<PointInterface[]>(
    solarPanelState.getCoordinates(
      roof.distanceBetweenPanelsCM,
      oneZentimeterHorizontal,
      oneZentimeterVertical,
    ),
  );
  const [wrapperCoordinates, setWrapperCoordinates] = React.useState<
    PointInterface[]
  >(
    solarPanelState.getWrapperCoordinates(
      roof.distanceBetweenPanelsCM,
      oneZentimeterHorizontal,
      oneZentimeterVertical,
    ),
  );

  const [prevSolarPanel, setPrevSolarPanel] = React.useState(solarPanel.copy());

  React.useEffect(() => {
    setAllCoordinates(solarPanel);
  }, [solarPanel]);

  React.useEffect(() => {
    if (!active) {
      setIsDraging(false);
    }
  }, [active]);

  React.useEffect(() => {
    if (lockMode) {
      setActive(false);
      setIsDraging(false);
    }
  }, [lockMode]);

  function setAllCoordinates(panel: SolarPanelMinimal) {
    setCoordinates(
      panel.getCoordinates(
        roof.distanceBetweenPanelsCM,
        oneZentimeterHorizontal,
        oneZentimeterVertical,
      ),
    );
    setWrapperCoordinates(
      panel.getWrapperCoordinates(
        roof.distanceBetweenPanelsCM,
        oneZentimeterHorizontal,
        oneZentimeterVertical,
      ),
    );
  }

  React.useImperativeHandle(ref, () => ({
    isActive() {
      return active;
    },
    isDraging() {
      return isDraging;
    },
    getState() {
      return solarPanelState.copy();
    },
    setIsActive(a: boolean) {
      setActive(a);
    },
    setDraging(a: boolean) {
      setIsDraging(a);
    },
    checkIfColides(x: number, y: number, e: any): boolean {
      if (lockMode) {
        return false;
      }
      const colides = checkIfColides(x, y);

      return colides;
    },
    movePanel(x: number, y: number, e: any) {
      if (isInsideRoof(e)) {
        if (e?.translationX != undefined) {
          setIsDraging(true);
          const newSolarPanel = solarPanelState.copy();
          newSolarPanel.startX = prevSolarPanel.startX + e.translationX;
          newSolarPanel.startY = prevSolarPanel.startY + e.translationY;

          setCoordinates(
            newSolarPanel.getCoordinates(
              roof.distanceBetweenPanelsCM,
              oneZentimeterHorizontal,
              oneZentimeterVertical,
            ),
          );
          setWrapperCoordinates(
            newSolarPanel.getWrapperCoordinates(
              roof.distanceBetweenPanelsCM,
              oneZentimeterHorizontal,
              oneZentimeterVertical,
            ),
          );
          setSolarPanelState(newSolarPanel);
        } else {
          setIsDraging(false);
        }
      }
    },
    onDragEnd() {
      setPrevSolarPanel(solarPanelState.copy());
      setIsDraging(false);
    },
  }));

  function isInsideRoof(e: any) {
    const transformedPoints = transforMatrix(
      allScreen,
      coordinates,
      roofPoints,
    );

    return true;
  }

  function checkIfColides(x: number, y: number) {
    const transformedPoints = transforMatrix(
      allScreen,
      active && isDraging ? getOuterContainer() : coordinates,
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
    return [
      {
        x: coordinates[0].x + STROKE_WIDTH + 1,
        y: coordinates[0].y + STROKE_WIDTH + 1,
      },
      {
        x: coordinates[1].x - STROKE_WIDTH - 1,
        y: coordinates[1].y + STROKE_WIDTH + 1,
      },
      {
        x: coordinates[2].x - STROKE_WIDTH - 1,
        y: coordinates[2].y - STROKE_WIDTH - 1,
      },
      {
        x: coordinates[3].x + STROKE_WIDTH + 1,
        y: coordinates[3].y - STROKE_WIDTH - 1,
      },
    ];
  }

  function getOuterContainer() {
    const margin = 300;
    return [
      {x: coordinates[0].x - margin, y: coordinates[0].y - margin},
      {x: coordinates[1].x + margin, y: coordinates[1].y - margin},
      {x: coordinates[2].x + margin, y: coordinates[2].y + margin},
      {x: coordinates[3].x - margin, y: coordinates[3].y + margin},
    ];
  }

  return (
    <>
      <TransformedPath
        pathStyle="fill"
        strokeWidth={STROKE_WIDTH}
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
