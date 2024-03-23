import Realm from 'realm';
import {RoofImage} from './RoofImage';

export class SolarPanelType extends Realm.Object<SolarPanelType> {
  _id!: Realm.BSON.UUID;
  width!: number;
  height!: number;
  name!: string;
  performance!: number;

  static schema = {
    name: 'SolarPanelType',
    properties: {
      _id: 'uuid',
      width: 'float',
      height: 'float',
      name: 'string',
      performance: 'float',
    },
    primaryKey: '_id',
  };
}
