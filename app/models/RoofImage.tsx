import { useObject } from '@realm/react';
import Realm from 'realm';
import { User } from './User';
import { UserMinimal } from '../mapper/UserMinimal';
import { Roof } from './Roof';
import { RoofPoint } from './RoofPoint';
import { SolarPanel } from './SolarPanel';


export class RoofImage extends Realm.Object<RoofImage> {
    
    _id!: Realm.BSON.UUID;
    src!: string;
    roof!: Realm.List<Roof>;
    roofPoints!: Realm.List<RoofPoint>;
    solarPanels!: Realm.List<SolarPanel>

    static schema = {
      name: 'RoofImage',
      properties: {
        _id: 'uuid',
        src: 'string',
        roof: {
          type: 'linkingObjects',
          objectType: 'Roof',
          property: 'roofImages',
        },
        roofPoints: 'RoofPoint[]',
        solarPanels: 'SolarPanel[]',
      },
      primaryKey: '_id',
    };
  }