import { useObject } from "@realm/react";
import { Roof } from "./Roof";
import { User } from "./User";
import { UserMinimal } from "./UserMinimal";

export class RoofMinimal {
    
    _id: string;
    city: string;
    street: string;
    width: number;
    height: number;
    userId: string;

    constructor(_id: string, city: string, street: string, width: number, height: number, userId: string){
        this._id = _id;
        this.city = city;
        this.street = street;
        this.width = width;
        this.height = height;
        this.userId = userId;
    }

    static map(roof: Roof | null): RoofMinimal{
        if(roof == null){
            throw "Roof Mapping was not successfull";
        }
        return new RoofMinimal(roof._id.toString(), roof.city, roof.street, roof.width, roof.height, roof.userId.toString());
    }
}