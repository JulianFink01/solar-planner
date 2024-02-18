


import { useObject } from '@realm/react';
import Realm from 'realm';
import { User } from './User';
import { UserMinimal } from '../mapper/UserMinimal';
import { Roof } from './Roof';
import { RoofImage } from './RoofImage';


export class SolarPanel extends Realm.Object<SolarPanel> {
    
    _id!: Realm.BSON.UUID;
    roofImage!: Realm.List<RoofImage>;
    startX!: number;
    startY!: number;
    placement!: string;


    static schema = {
      name: 'SolarPanel',
      properties: {
        _id: 'uuid',
        startX: 'float',
        startY: 'float',
        placement: 'string',
        roofImage: {
          type: 'linkingObjects',
          objectType: 'RoofImage',
          property: 'solarPanels',
        },
      },
      primaryKey: '_id',
    };
  }