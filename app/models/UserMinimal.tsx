import { User } from "./User";

export class UserMinimal {
    firstName: string;
    lastName: string;
    _id: string;

    constructor(firstName: string, lastName: string, _id: string){
        this.firstName = firstName;
        this.lastName = lastName;
        this._id = _id;
    }
    static map(user: User): UserMinimal{
        return new UserMinimal(user.firstName, user.lastName, user._id.toString());
    }
}