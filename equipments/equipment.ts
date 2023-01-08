import { Role } from '../role/role';
import { Equipments } from './factory';

export interface Equipment {
    name: string;
    type: Equipments;
    availableRoles: Role[];
}
