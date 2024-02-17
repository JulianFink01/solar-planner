import { useObject } from '@realm/react';
import Realm from 'realm';
import { User } from './User';
import { UserMinimal } from '../mapper/UserMinimal';


export class Roof extends Realm.Object<Roof> {
    
    _id!: Realm.BSON.UUID;
    width!: number;
    height!: number;
    zipCode!: string;
    innerMarginTop!: number;
    innerMarginRight!: number;
    innerMarginBottom!: number;
    innerMarginLeft!: number;
    street!: string;
    streetNumber!: string;
    city!: string;
    notes!: string;
    user!: Realm.List<User>;
    distanceBetweenPanelsCM!: number;

    static schema = {
      name: 'Roof',
      properties: {
        _id: 'uuid',
        width: 'float',
        height:'float',
        innerMarginTop: 'float',
        innerMarginRight: 'float',
        innerMarginBottom: 'float',
        innerMarginLeft: 'float',
        distanceBetweenPanelsCM: 'float',
        user: {
          type: 'linkingObjects',
          objectType: 'User',
          property: 'roofs',
        },
        city: {type: 'string', indexed: 'full-text'},
        zipCode: {type: 'string', indexed: 'full-text'},
        street: {type: 'string', indexed: 'full-text'},
        streetNumber: {type: 'string', indexed: 'full-text'},
        notes: {type: 'string', indexed: 'full-text'}
      },
      primaryKey: '_id',
    };
  }