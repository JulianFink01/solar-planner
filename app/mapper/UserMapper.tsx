import { User } from "../models/User";

export class UserMapper {

    static mapToJson(user: User){
            return {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                eMail: user.eMail,
                phoneNumber: user.phoneNumber,
                placeOfResidence: user.placeOfResidence,
                zipCode: user.zipCode,
                street: user.street,
                steetNumber: user.streetNumber,
                notes: user.notes
            }
    }
}