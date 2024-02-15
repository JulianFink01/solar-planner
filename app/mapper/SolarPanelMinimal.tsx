import { SolarPanelType } from "./SolarPanelType";

export class SolarPanelMinimal {
    
    solarPanelType: SolarPanelType;
    startX: number;
    startY: number;

    
    constructor(solarPanelType: SolarPanelType,  startX: number, startY: number){
        this.solarPanelType = solarPanelType;
        this.startX = startX;
        this.startY = startY;
    }
  

    getWrapperCoordinates(panelMargin: number,relationOneZentimeterX: number, relationOneZentimeterY: number, ): PointInterface[]{

        function relationize(value: number, isX = true){
            if(isX){
                return value * relationOneZentimeterX;
            }
            return value * relationOneZentimeterY;
          }

        const width = relationize(this.solarPanelType.width) + relationize(panelMargin);
        const height = relationize(this.solarPanelType.height, false)  + relationize(panelMargin, false);

        return [{x: this.startX, y: this.startY},
                {x: this.startX + width, y: this.startY},
                {x: this.startX + width, y: this.startY + height},
                {x: this.startX, y: this.startY + height}];
    }

    getCoordinates(panelMargin: number,relationOneZentimeterX: number, relationOneZentimeterY: number, ): PointInterface[]{
        
        function relationize(value: number, isX = true){
            if(isX){
                return value * relationOneZentimeterX;
            }
            return value * relationOneZentimeterY;
          }
        

        const marginXHalth = relationize(panelMargin)  / 2;
        const marginYHalth = relationize(panelMargin, false)  / 2;

        const panelWidth = relationize(this.solarPanelType.width);
        const panelHeight = relationize(this.solarPanelType.height, false);

        return [{x: this.startX + marginXHalth, y: this.startY + marginYHalth},
                {x: this.startX  +  marginXHalth + panelWidth, y: this.startY + marginYHalth},
                {x: this.startX  + marginXHalth + panelWidth, y: this.startY + panelHeight + marginYHalth},
                {x: this.startX + marginXHalth, y: this.startY + panelHeight + marginYHalth}];
    }

}