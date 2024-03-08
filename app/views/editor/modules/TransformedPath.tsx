import * as React from 'react';
import {
  Canvas,
  LinearGradient,
  Path,
  Rect,
  vec,
} from '@shopify/react-native-skia';
import {pointsToSvg, transforMatrix} from '../../../utils/PerspectiveHelper';

interface Props {
  allScreen: PointInterface[];
  roofPoints: PointInterface[];
  debugView: boolean;
  points: {x: number; y: number}[];
  color: string;
  strokeWidth: number;
  pathStyle: 'stroke' | 'fill';
  useGradient: boolean;
  opacity: number;
}
function TransformedPath({
  allScreen,
  pathStyle,
  strokeWidth,
  points,
  debugView,
  useGradient,
  roofPoints,
  opacity,
  color,
}: Props) {
  const transformedPoints: PointInterface[] = transforMatrix(
    allScreen,
    points,
    roofPoints,
  );

  return (
    <>
      <Path
        path={pointsToSvg(transformedPoints)}
        opacity={opacity}
        style={pathStyle}
        strokeJoin="round"
        color={color}
        strokeWidth={strokeWidth}></Path>

      {debugView && (
        <Path
          path={pointsToSvg(points)}
          opacity={opacity}
          style="stroke"
          strokeJoin="round"
          color={'green'}
          strokeWidth={5}
        />
      )}
    </>
  );
}

TransformedPath.defaultProps = {
  color: 'white',
  strokeWidth: 3,
  pathStyle: 'stroke',
  useGradient: false,
  opacity: 1,
};

export default TransformedPath;
