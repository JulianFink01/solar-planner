import { SolarPanelMinimal } from "../mapper/SolarPanelMinimal";
import { Roof } from "../models/Roof";

export default class SolarPanelHelper{

    private static getMaximumSolarPanelsOnRoof(imageSize: {width: number, height: number}, roof: Roof, panel: SolarPanelType): {x: number, y: number}{

        const oneZentimeterVertical = imageSize.height / roof.height / 100;
        const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
    
        let widthTotal = imageSize.width;
        let heightTotal = imageSize.height;

        // removeRoofInnerMargin 
        widthTotal  -= (2 * roof.innerMarginCM) * oneZentimeterHorizontal;
        heightTotal -= (2 * roof.innerMarginCM) * oneZentimeterVertical;

        const panelWidth = panel.width + (roof.distanceBetweenPanelsCM * oneZentimeterHorizontal);
        const panelHeight = panel.width + (roof.distanceBetweenPanelsCM * oneZentimeterVertical);

        const maxX = widthTotal /  panelWidth;
        const maxY = heightTotal / panelHeight;

        return {x: Math.floor(maxX), y: Math.floor(maxY)};
    }


    static placePanelsAlignedLeft(imageSize: {width: number, height: number},roof: Roof, roofTopLeftPoint: PointInterface): SolarPanelMinimal[]{
      const oneZentimeterVertical = imageSize.height / roof.height / 100;
      const oneZentimeterHorizontal = imageSize.width / roof.width / 100;

      const panelType: SolarPanelType = {width: 100, height: 150};  
      const maxPanels = this.getMaximumSolarPanelsOnRoof(imageSize, roof, panelType);
      ;
      const result: SolarPanelMinimal[] = [];

    
      const panelWidth = panelType.width ;
      const panelHeight = panelType.width ;

        for(let x = 0; x < maxPanels.x; x++){
            for(let y = 0; y < maxPanels.y; y++){
                const startX = roofTopLeftPoint.x + ((x) * (panelWidth + (oneZentimeterHorizontal * roof.distanceBetweenPanelsCM)) );
                const startY = roofTopLeftPoint.y + ((y) * (panelHeight+ (oneZentimeterVertical * roof.distanceBetweenPanelsCM)) );

                result.push(new SolarPanelMinimal(panelType, (roof.distanceBetweenPanelsCM * oneZentimeterHorizontal),(roof.distanceBetweenPanelsCM * oneZentimeterVertical), startX, startY));
            }            
        }
      
        return result;
    }
}