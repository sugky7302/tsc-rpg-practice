import { Character } from '../character/character';
import IAttack from './attack';

export class MeleeAttack implements IAttack {
    public attack(self: Character, target: Character): void {
        console.log(`${self.name} strikes ${target.name} with a big sword!`);
    }
}
