import { Role } from '../role/role';
import { Armor } from './armor';

export class BasicArmor extends Armor {
    public readonly name = 'Basic Armor';

    public availableRoles = [Role.Swordsman, Role.BountyHunter];
}
