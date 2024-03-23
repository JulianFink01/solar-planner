import Realm from 'realm';
import {Roof} from './Roof';
import {RoofPoint} from './RoofPoint';
import {SolarPanel} from './SolarPanel';
import {SolarPanelType} from './SolarPanelType';

export class RoofImage extends Realm.Object<RoofImage> {
  _id!: Realm.BSON.UUID;
  src!: string;
  roof!: Realm.List<Roof>;
  roofPoints!: Realm.List<RoofPoint>;
  solarPanels!: Realm.List<SolarPanel>;
  solarPanelType?: SolarPanelType;
  notes!: string;

  static schema = {
    name: 'RoofImage',
    properties: {
      _id: 'uuid',
      src: 'string',
      notes: 'string',
      roof: {
        type: 'linkingObjects',
        objectType: 'Roof',
        property: 'roofImages',
      },
      roofPoints: 'RoofPoint[]',
      solarPanels: 'SolarPanel[]',
      solarPanelType: 'SolarPanelType?',
    },
    primaryKey: '_id',
  };
}
