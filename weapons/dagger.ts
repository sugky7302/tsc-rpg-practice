import { StabAttack } from '../ability/stabattack';
import { Weapon } from './weapon';

export class Dagger extends Weapon {
    public readonly name = 'Dagger';
    public attackStrategy = new StabAttack();
    public availableRoles = [];
}
