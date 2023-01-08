import { Equipment } from '../equipments/equipment';
import { Equipments } from '../equipments/factory';
import { Role } from '../role/role';

export abstract class Armor implements Equipment {
    abstract name: string;
    public type = Equipments.Armor;
    abstract availableRoles: Role[];
}
