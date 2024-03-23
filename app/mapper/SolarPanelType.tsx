import {SolarPanelType as SolarPanelTypeDB} from '../models/SolarPanelType';

export class SolarPanelType {
  width: number;
  height: number;
  name: string;
  performance: number;
  _id: string;

  constructor(
    width: number,
    heigth: number,
    name = '',
    performance: number = 0,
    id = '',
  ) {
    this.width = width;
    this.height = heigth;
    this.name = name;
    this.performance = performance;
    this._id = id;
  }

  static map(solarPanelType: SolarPanelTypeDB) {
    return new SolarPanelType(
      solarPanelType.width,
      solarPanelType.height,
      solarPanelType.name,
      solarPanelType.performance,
      solarPanelType._id?.toString(),
    );
  }
}
