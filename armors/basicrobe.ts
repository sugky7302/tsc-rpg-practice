import { Role } from '../role/role';
import { Armor } from './armor';

export class BasicRobe extends Armor {
    public readonly name = 'Basic Robe';

    public availableRoles = [Role.Warlock];
}
