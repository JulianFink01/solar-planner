import Realm from 'realm';


export class User extends Realm.Object<User> {
    
    _id!: Realm.BSON.UUID;
    firstName!: string;
    lastName!: string;
    eMail!: string;
    phoneNumber!: string;
    placeOfResidence!: string;
    zipCode!: string;
    street!: string;
    streetNumber!: string;
    notes!: string;
    
    static schema = {
      name: 'User',
      properties: {
        _id: 'uuid',
        firstName: {type: 'string', indexed: 'full-text'},
        lastName: {type: 'string', indexed: 'full-text'},
        eMail: {type: 'string', indexed: 'full-text'},
        phoneNumber: {type: 'string', indexed: 'full-text'},
        placeOfResidence: {type: 'string', indexed: 'full-text'},
        zipCode: {type: 'string', indexed: 'full-text'},
        street: {type: 'string', indexed: 'full-text'},
        streetNumber: {type: 'string', indexed: 'full-text'},
        notes: {type: 'string', indexed: 'full-text'}
      },
      primaryKey: '_id',
    };
  }