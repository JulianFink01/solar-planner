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


    static placePanelsAlignedLeft(imageSize: {width: number, height: number},roof: Roof, roofTopLeftPoint: PointInterface, position: POSITIONED): SolarPanelMinimal[]{
      const oneZentimeterVertical = imageSize.height / roof.height / 100;
      const oneZentimeterHorizontal = imageSize.width / roof.width / 100;

      const panelType: SolarPanelType = {width: 100, height: 100};  

      function relationize(value: number, isX = true){
        if(isX){
            return value * oneZentimeterHorizontal;
        }
        return value * oneZentimeterVertical;
      }
      
      const panelWidth =relationize(panelType.width);
      const panelHeight = relationize(panelType.height, false);
      
      const innerMarginX = relationize(roof.innerMarginCM);
      const innerMarginY = relationize(roof.innerMarginCM, false);


      const maxPanels = this.getMaximumSolarPanelsOnRoof(imageSize.width - (2 * innerMarginX), imageSize.height - (2 * innerMarginY), relationize(roof.distanceBetweenPanelsCM), relationize(roof.distanceBetweenPanelsCM, false), panelWidth, panelHeight);
      const result: SolarPanelMinimal[] = [];

    
    
      if(position === POSITIONED.LEFT){
        for(let x = 0; x < maxPanels.x; x++){
            for(let y = 0; y < maxPanels.y; y++){
                const startX = roofTopLeftPoint.x + (x * (panelWidth + relationize(roof.distanceBetweenPanelsCM)) );
                const startY = roofTopLeftPoint.y + (y * (panelHeight + relationize(roof.distanceBetweenPanelsCM, false)) );

                result.push(new SolarPanelMinimal(panelType, startX, startY));
            }            
        }
      }
        return result;
    }
}