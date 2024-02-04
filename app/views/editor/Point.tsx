import { Circle, FontStyle, Shadow, Skia, Text, listFontFamilies, matchFont, useFont } from '@shopify/react-native-skia';
import * as React from 'react';
import { ThemeDark } from '../../themes/ThemeDark';
import { Icon, IconButton, MD3Colors } from 'react-native-paper';
import { Platform } from 'react-native';

interface Props extends PointInterface  {
    hidden: boolean;
}

const pointColor = ThemeDark.colors.primary;


function Point ({x, y, radius, hidden}: Props, ref: React.Ref): React.JSX.Element {
   
    const [point, setPoint] = React.useState<PointInterface>({x, y, radius});

    React.useImperativeHandle(ref, () => ({
        collides(otherPoint: PointInterface){
            const space = Math.sqrt(Math.pow(otherPoint.x - point.x, 2) + Math.pow(otherPoint.y - point.y, 2));

            const collides = space <= point.radius + otherPoint.radius;
        
            if(collides){
                setPoint({x: otherPoint.x, y: otherPoint.y, radius: point.radius});
            } 
            return collides;
        },
        getState(){
            return point;
        }
       }));
    
    return (
        <Circle cx={point.x} cy={point.y} r={point.radius} color={pointColor} opacity={hidden ? 0 : 1}>
             <Shadow dx={-1} dy={-1} blur={1} color={ThemeDark.colors.shadow} />
             <Shadow dx={1} dy={1} blur={1} color={ThemeDark.colors.shadow} />
        </Circle>
    );
}

export default  React.forwardRef(Point);