import { Character } from '../character/character';
import IAttack from './attack';

export class StabAttack implements IAttack {
    public attack(self: Character, target: Character): void {
        console.log(`${self.name} stabs through ${target.name} with his sword!`);
    }
}
