import { useObject } from '@realm/react';
import Realm from 'realm';
import { User } from './User';
import { UserMinimal } from './UserMinimal';


export class Roof extends Realm.Object<Roof> {
    
    _id!: Realm.BSON.UUID;
    width!: number;
    height!: number;
    userId!: Realm.BSON.UUID;
    zipCode!: string;
    street!: string;
    streetNumber!: string;
    city!: string;
    notes!: string;

    static schema = {
      name: 'Roof',
      properties: {
        _id: 'uuid',
        width: 'float',
        height:'float',
        userId: 'uuid',
        city: {type: 'string', indexed: 'full-text'},
        zipCode: {type: 'string', indexed: 'full-text'},
        street: {type: 'string', indexed: 'full-text'},
        streetNumber: {type: 'string', indexed: 'full-text'},
        notes: {type: 'string', indexed: 'full-text'}
      },
      primaryKey: '_id',
    };
  }