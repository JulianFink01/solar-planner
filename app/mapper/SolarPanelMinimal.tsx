import {SolarPanelType} from './SolarPanelType';
import Realm from 'realm';

export class SolarPanelMinimal {
  uuid: string;
  solarPanelType: SolarPanelType;
  startX: number;
  startY: number;
  placement: 'vertical' | 'horizontal';

  public copy() {
    return new SolarPanelMinimal(
      this.solarPanelType,
      this.startX,
      this.startY,
      this.placement,
      this.uuid,
    );
  }

  constructor(
    solarPanelType: SolarPanelType,
    startX: number,
    startY: number,
    placement: 'vertical' | 'horizontal' = 'vertical',
    uuid = new Realm.BSON.UUID().toString(),
  ) {
    this.solarPanelType = solarPanelType;
    this.startX = startX;
    this.startY = startY;
    this.placement = placement;
    this.uuid = uuid;
  }

  private getWidth(mode: 'vertical' | 'horizontal' = this.placement) {
    if (mode !== 'horizontal') {
      return this.solarPanelType.width;
    }

    return this.solarPanelType.height;
  }

  private getHeight(mode: 'vertical' | 'horizontal' = this.placement) {
    if (mode !== 'horizontal') {
      return this.solarPanelType.height;
    }

    return this.solarPanelType.width;
  }

  getWrapperCoordinates(
    panelMargin: number,
    relationOneZentimeterX: number,
    relationOneZentimeterY: number,
    panelPlacement: 'vertical' | 'horizontal' = this.placement,
  ): PointInterface[] {
    function relationize(value: number, isX = true) {
      if (isX) {
        return value * relationOneZentimeterX;
      }
      return value * relationOneZentimeterY;
    }

    const width =
      relationize(this.getWidth(panelPlacement)) + relationize(panelMargin);
    const height =
      relationize(this.getHeight(panelPlacement), false) +
      relationize(panelMargin, false);

    return [
      {x: this.startX, y: this.startY},
      {x: this.startX + width, y: this.startY},
      {x: this.startX + width, y: this.startY + height},
      {x: this.startX, y: this.startY + height},
    ];
  }

  getCoordinates(
    panelMargin: number,
    relationOneZentimeterX: number,
    relationOneZentimeterY: number,
    panelPlacement: 'vertical' | 'horizontal' = this.placement,
  ): PointInterface[] {
    function relationize(value: number, isX = true) {
      if (isX) {
        return value * relationOneZentimeterX;
      }
      return value * relationOneZentimeterY;
    }

    const marginXHalth = relationize(panelMargin) / 2;
    const marginYHalth = relationize(panelMargin, false) / 2;

    const panelWidth = relationize(this.getWidth(panelPlacement));
    const panelHeight = relationize(this.getHeight(panelPlacement), false);

    return [
      {x: this.startX + marginXHalth, y: this.startY + marginYHalth},
      {
        x: this.startX + marginXHalth + panelWidth,
        y: this.startY + marginYHalth,
      },
      {
        x: this.startX + marginXHalth + panelWidth,
        y: this.startY + panelHeight + marginYHalth,
      },
      {
        x: this.startX + marginXHalth,
        y: this.startY + panelHeight + marginYHalth,
      },
    ];
  }
}
