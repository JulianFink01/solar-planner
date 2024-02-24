import * as React from 'react';
import { Roof } from '../../../models/Roof';
import { getMaxCursorCoordinates, pointsToSvg, transforMatrix } from '../../../utils/PerspectiveHelper';
import SolarPanel from './SolarPanel';
import { Path } from '@shopify/react-native-skia';
import Point from '../Point';
import { ThemeDark } from '../../../themes/ThemeDark';
import TransformedPath from './TransformedPath';
import SolarPanelHelper, { POSITIONED } from '../../../utils/SolarPanelHelper';
import { SolarPanelMinimal } from '../../../mapper/SolarPanelMinimal';
import { RoofImage } from '../../../models/RoofImage';

type Props = {
    imageSize: {width: number, height: number},
    roof: Roof,
    roofImage: RoofImage,
    debugView: boolean,
    lockMode: boolean,
    displayGrid: boolean,
    onUpdate: (points: PointInterface[]) => any,
}


type PointProps ={
    imageSize: {width: number, height: number},
}



function AreaPicker({imageSize, roof, debugView, roofImage, lockMode, displayGrid, onUpdate}: Props, ref: React.Ref<any>) : React.JSX.Element{
    
    const pointLeftTop = React.useRef<any>(null);
    const pointLeftBottom = React.useRef<any>(null);
    const pointRightTop = React.useRef<any>(null);
    const pointRightBottom = React.useRef<any>(null);

    const width2 = imageSize.width;  
    const height2 = imageSize.height;
    // Wir plazieren alles in einem Rechteck die Transformation übernimmt den Rest
    const allScreen: PointInterface[] = [{x:0, y: 0}, 
                                         {x: width2, y: 0 }, 
                                         {x: width2, y:  height2}, 
                                         {x:0, y: height2}]; 
                                         
    const startX = 50;
    const startY = 50;
    const POINT_RADIUS = 10;

    const width = imageSize.width - (2 * startX);
    const height = imageSize.height - (2 * startY);

    // Jeden einzelnen für die neue Form herausfinden und innenabstand hinzufügen
    const oneZentimeterVertical = imageSize.height / roof.height / 100;
    const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
   

    // Punkte die man verschieben kann
    const [roofPoints, setRoofPoints] = React.useState<PointInterface[]>(getInititalRoofPoints()); // leftTop 
                                                                                                                                                
    const [roofRect, setRoofRect] = React.useState<PointInterface[]>(getInnerMarginArea());                                                                      
    const [solarPanels, setSolarPanels] = React.useState<SolarPanelMinimal[]>(getInitialSolarPanels());
            
    React.useEffect(() => {
      setRoofRect(getInnerMarginArea());
    }, [roof])


    React.useEffect(() => {
        onUpdate(roofPoints)
    }, [roofPoints])

    React.useImperativeHandle(ref, () => ({
     onGestureStart(x: number, y: number){
         checkForCollsion(x, y, 50);
     },
     onGestureEnd(){
         updatePoints();
     },
     regenerateGrid(panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string'){
      const roofRect = getInnerMarginArea();
      setRoofRect(roofRect);
      const panels = getInitialSolarPanels(panelPlacement, roofRect[0], true);
      setSolarPanels(panels);
      return {roofPoints: roofRect, solarPanels: panels}
    },
    getState(){
      return {roofPoints: roofPoints, solarPanels: solarPanels}
    }
    }));

    function getInititalRoofPoints(){

      if(roofImage.roofPoints?.length > 0){
        return roofImage.roofPoints.map((rp) => ({x: rp.x, y: rp.y, radius: POINT_RADIUS}));
      }

      return [{x: startX, y: startY, radius: POINT_RADIUS}, // leftTop
              {x: startX + width, y: startY, radius: POINT_RADIUS},  // rightTop
              {x: startX + width, y: startY + height, radius: POINT_RADIUS},  // rightBottom
              {x: startX, y: startY + height, radius: POINT_RADIUS}];
    }
    

    function getInitialSolarPanels(panelPlacement: 'vertical' | 'horizontal' = 'vertical', roofStart:PointInterface = roofRect[0], isReset = false): SolarPanelMinimal[]{

      const panelType: SolarPanelType = {width: 100, height: 200};  
  
      if(roofImage.solarPanels?.length > 0 && !isReset){
        return roofImage.solarPanels.map((sp) => new SolarPanelMinimal(panelType, sp.startX, sp.startY, sp.placement));
      }


      return SolarPanelHelper.placePanelsAlignedLeft(panelType, imageSize, roof, roofStart, POSITIONED.LEFT, panelPlacement);
    }  

    function getInnerMarginArea(): PointInterface[]{

      function relationize(value: number, isX = true){
        if(isX){
            return value * oneZentimeterHorizontal;
        }
        return value * oneZentimeterVertical;
      }

     return [ {x: allScreen[0].x + relationize(roof.innerMarginLeft), y: allScreen[0].y + relationize(roof.innerMarginTop, false)},
              {x: allScreen[1].x - relationize(roof.innerMarginRight), y: allScreen[1].y + relationize(roof.innerMarginTop, false)},
              {x: allScreen[2].x - relationize(roof.innerMarginRight), y: allScreen[2].y - relationize(roof.innerMarginBottom, false)},
              {x: allScreen[3].x + relationize(roof.innerMarginLeft), y: allScreen[3].y - relationize(roof.innerMarginBottom, false)}]
    }

    function checkForCollsion(x: number, y: number, radius: number){
        if(pointLeftTop.current.collides({x, y, radius})){
          return;
        }else if(pointLeftBottom.current.collides({x, y, radius})){
          return;
        }else if(pointRightTop.current.collides({x, y, radius})){
          return;
        }
        pointRightBottom.current.collides({x, y, radius});
      }
    
    function updatePoints(){
      const newPoints = [...roofPoints];
      newPoints[0] = pointLeftTop.current.getState();
      newPoints[1] = pointRightTop.current.getState();
      newPoints[2] = pointRightBottom.current.getState();
      newPoints[3] = pointLeftBottom.current.getState();
      setRoofPoints(newPoints);
      onUpdate(newPoints);
    }

    return (
      <>

        {displayGrid && <TransformedPath
                            strokeWidth={2}
                            color='orange'
                            debugView={debugView}
                            allScreen={allScreen}
                            roofPoints={roofPoints}
                            points={roofRect}
                    />}
    
      {solarPanels.map((sp, index) => <SolarPanel 
                                          key={'pane-'+index}
                                          displayGrid={displayGrid}
                                          roof={roof}
                                          imageSize={imageSize}
                                          debugView={debugView} 
                                          roofPoints={roofPoints} 
                                          allScreen={allScreen}
                                          solarPanel={sp} />)}
        
        <Picker imageSize={imageSize} />
      </>
    );


    function Picker({imageSize} : PointProps){
        return (
          <>
            <Path path={pointsToSvg(roofPoints)} opacity={displayGrid ? 1 : 0} style="stroke" strokeJoin="round" color={ThemeDark.colors.inverseSurface} strokeWidth={3}/>
            <Point maxCursorCoordinates={getMaxCursorCoordinates(imageSize)} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointLeftTop} x={roofPoints[0].x} y={roofPoints[0].y} radius={roofPoints[0].radius}  />
            <Point maxCursorCoordinates={getMaxCursorCoordinates(imageSize)} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointRightTop} x={roofPoints[1].x} y={roofPoints[1].y} radius={roofPoints[1].radius}  />
            <Point maxCursorCoordinates={getMaxCursorCoordinates(imageSize)} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointRightBottom} x={roofPoints[2].x} y={roofPoints[2].y} radius={roofPoints[2].radius} />
            <Point maxCursorCoordinates={getMaxCursorCoordinates(imageSize)} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointLeftBottom} x={roofPoints[3].x} y={roofPoints[3].y} radius={roofPoints[3].radius} />
          </>
        );
      }
    
    
}

export default React.forwardRef(AreaPicker);