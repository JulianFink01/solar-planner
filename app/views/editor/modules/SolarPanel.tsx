import * as React from 'react';
import {
  LinearGradient,
  Path,
  Rect,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import {pointsToSvg} from '../../../utils/PerspectiveHelper';
import {Roof} from '../../../models/Roof';
import {SolarPanelMinimal} from '../../../mapper/SolarPanelMinimal';
import TransformedPath from './TransformedPath';

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
}
function SolarPanel({
  imageSize,
  roof,
  allScreen,
  solarPanel,
  displayGrid,
  debugView,
  roofPoints,
  opacity,
}: Props) {
  const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
  const oneZentimeterVertical = imageSize.height / roof.height / 100;

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

  const panelGrid = generateGridPoints(
    coordinates[3],
    coordinates[2],
    coordinates[0],
    coordinates[1],
    SOLAR_GRID_ROWS,
    SOLAR_GRID_COLS,
  );

  function generateGridPoints(
    bottomLeft: PointInterface,
    bottomRight: PointInterface,
    topRight: PointInterface,
    topLeft: PointInterface,
    rows: number,
    cols: number,
  ): Line[] {
    const lines: Line[] = [];

    // Schrittgrößen berechnen
    const horizontalStep = (topRight.x - topLeft.x) / cols;
    const verticalStep = (bottomLeft.y - topLeft.y) / rows;

    // Horizontale Linien generieren
    for (let i = 1; i <= rows - 1; i++) {
      const y = topLeft.y + i * verticalStep;
      const lineStart: PointInterface = {x: topLeft.x, y: y};
      const lineEnd: PointInterface = {x: topRight.x, y: y};
      const line: Line = [lineStart, lineEnd];
      lines.push(line);
    }

    // Vertikale Linien generieren
    for (let j = 1; j <= cols - 1; j++) {
      const x = topLeft.x + j * horizontalStep;
      const lineStart: PointInterface = {x: x, y: topLeft.y};
      const lineEnd: PointInterface = {x: x, y: bottomLeft.y};
      const line: Line = [lineStart, lineEnd];
      lines.push(line);
    }

    return lines;
  }
  return (
    <>
      <TransformedPath
        pathStyle="fill"
        strokeWidth={3}
        opacity={opacity}
        color="#4169E1"
        useGradient
        debugView={false}
        allScreen={allScreen}
        roofPoints={roofPoints}
        points={coordinates}
      />

      {panelGrid.map((line, index) => (
        <TransformedPath
          key={'line' + index}
          pathStyle="stroke"
          strokeWidth={2}
          opacity={opacity}
          color="white"
          debugView={false}
          allScreen={allScreen}
          roofPoints={roofPoints}
          points={[...line, ...line]}
        />
      ))}

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
export default SolarPanel;
