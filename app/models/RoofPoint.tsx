import Realm from 'realm';
import {RoofImage} from './RoofImage';

export class RoofPoint extends Realm.Object<RoofPoint> {
  _id!: Realm.BSON.UUID;
  x!: number;
  y!: number;
  roofImage!: Realm.List<RoofImage>;

  static schema = {
    name: 'RoofPoint',
    properties: {
      _id: 'uuid',
      x: 'float',
      y: 'float',
      roofImage: {
        type: 'linkingObjects',
        objectType: 'RoofImage',
        property: 'roofPoints',
      },
    },
    primaryKey: '_id',
  };
}
