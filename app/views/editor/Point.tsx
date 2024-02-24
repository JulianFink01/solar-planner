import {Circle, Shadow} from '@shopify/react-native-skia';
import * as React from 'react';
import {ThemeDark} from '../../themes/ThemeDark';

interface Props extends PointInterface {
  hidden: boolean;
  color: string;
  maxCursorCoordinates: {x: number; y: number};
}

function Point(
  {x, y, radius, hidden, color, maxCursorCoordinates}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const [point, setPoint] = React.useState<PointInterface>({x, y, radius});

  React.useImperativeHandle(ref, () => ({
    collides(otherPoint: PointInterface) {
      const space = Math.sqrt(
        Math.pow(otherPoint.x - point.x, 2) +
          Math.pow(otherPoint.y - point.y, 2),
      );

      const collides = space <= point.radius + otherPoint.radius;

      if (
        collides &&
        otherPoint.x > 0 &&
        otherPoint.y > 0 &&
        otherPoint.x < maxCursorCoordinates.x &&
        otherPoint.y < maxCursorCoordinates.y
      ) {
        setPoint({x: otherPoint.x, y: otherPoint.y, radius: point.radius});
      }
      return collides;
    },
    getState() {
      return point;
    },
  }));

  return (
    <Circle
      cx={point.x}
      cy={point.y}
      r={point.radius}
      color={color}
      opacity={hidden ? 0 : 1}>
      <Shadow dx={-1} dy={-1} blur={1} color={ThemeDark.colors.shadow} />
      <Shadow dx={1} dy={1} blur={1} color={ThemeDark.colors.shadow} />
    </Circle>
  );
}

export default React.forwardRef(Point);
