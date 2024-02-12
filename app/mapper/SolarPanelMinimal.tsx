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
  

    getWrapperCoordinates(panelMarginY: number, panelMarginX: number): PointInterface[]{

        const width = this.solarPanelType.width + (panelMarginX);
        const height = this.solarPanelType.height + (panelMarginY);

        return [{x: this.startX, y: this.startY},
                {x: this.startX + width, y: this.startY},
                {x: this.startX + width, y: this.startY + height},
                {x: this.startX, y: this.startY + height}];
    }

    getCoordinates(panelMarginY: number, panelMarginX: number): PointInterface[]{

        const marginXHalth = panelMarginX / 2;
        const marginYHalth = panelMarginY / 2;

        return [{x: this.startX + marginXHalth, y: this.startY + marginYHalth},
                {x: this.startX - marginXHalth + this.solarPanelType.width, y: this.startY + marginYHalth},
                {x: this.startX - marginXHalth + this.solarPanelType.width, y: this.startY + this.solarPanelType.height - marginYHalth},
                {x: this.startX + marginXHalth, y: this.startY + this.solarPanelType.height - marginYHalth}];
    }

}