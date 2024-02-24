import * as React from 'react';
import {Path} from '@shopify/react-native-skia';
import {pointsToSvg, transforMatrix} from '../../../utils/PerspectiveHelper';

interface Props {
  allScreen: PointInterface[];
  roofPoints: PointInterface[];
  debugView: boolean;
  points: {x: number; y: number}[];
  color: string;
  strokeWidth: number;
  pathStyle: 'stroke' | 'fill';
}
function TransformedPath({
  allScreen,
  pathStyle,
  strokeWidth,
  points,
  debugView,
  roofPoints,
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
        opacity={1}
        style={pathStyle}
        strokeJoin="round"
        color={color}
        strokeWidth={strokeWidth}
      />
      {debugView && (
        <Path
          path={pointsToSvg(points)}
          opacity={1}
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
};

export default TransformedPath;
