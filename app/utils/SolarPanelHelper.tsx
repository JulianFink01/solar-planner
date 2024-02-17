import { SolarPanelMinimal } from "../mapper/SolarPanelMinimal";
import { SolarPanelType } from "../mapper/SolarPanelType";
import { Roof } from "../models/Roof";

export enum POSITIONED {
    LEFT
}

export default class SolarPanelHelper{

    private static getMaximumSolarPanelsOnRoof(width: number, height: number, distanceBetweenPanelsCMX: number,distanceBetweenPanelsCMY: number, panelWidth: number, panelHeight: number): {x: number, y: number}{
        const maxX = (width - panelWidth) / (panelWidth + distanceBetweenPanelsCMX);
        const maxY = (height - panelHeight) / (panelHeight + distanceBetweenPanelsCMY);
        return {x: Math.floor(maxX) + 1, y: Math.floor(maxY) + 1};
    }


    static placePanelsAlignedLeft(imageSize: {width: number, height: number},roof: Roof, roofTopLeftPoint: PointInterface, position: POSITIONED, mode: 'horizontal' |  'vertical'): SolarPanelMinimal[]{
      const oneZentimeterVertical = imageSize.height / roof.height / 100;
      const oneZentimeterHorizontal = imageSize.width / roof.width / 100;

      const panelType: SolarPanelType = {width: 100, height: 200};  

      function relationize(value: number, isX = true){
        if(isX){
            return value * oneZentimeterHorizontal;
        }
        return value * oneZentimeterVertical;
      }
      
      const panelWidth = mode !== 'horizontal' ? relationize(panelType.width) : relationize(panelType.height);
      const panelHeight = mode !== 'horizontal' ? relationize(panelType.height, false) : relationize(panelType.width, false);
      
      const innerMarginX = relationize(roof.innerMarginLeft) + relationize(roof.innerMarginRight);
      const innerMarginY = relationize(roof.innerMarginTop, false) + relationize(roof.innerMarginBottom, false);


      const maxPanels = this.getMaximumSolarPanelsOnRoof(imageSize.width - innerMarginX, imageSize.height - innerMarginY, relationize(roof.distanceBetweenPanelsCM), relationize(roof.distanceBetweenPanelsCM, false), panelWidth, panelHeight);
      const result: SolarPanelMinimal[] = [];

    
    
      if(position === POSITIONED.LEFT){
        for(let x = 0; x < maxPanels.x; x++){
            for(let y = 0; y < maxPanels.y; y++){
                const startX = (roofTopLeftPoint.x - (relationize(roof.distanceBetweenPanelsCM / 2))) + (x * (panelWidth + relationize(roof.distanceBetweenPanelsCM)) );
                const startY = (roofTopLeftPoint.y - (relationize(roof.distanceBetweenPanelsCM / 2, false))) + (y * (panelHeight + relationize(roof.distanceBetweenPanelsCM, false)) );

                result.push(new SolarPanelMinimal(panelType, startX, startY, mode));
            }            
        }
      }
        return result;
    }
}