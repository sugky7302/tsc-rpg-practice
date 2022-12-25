import { Character } from '../character/character';
import IAttack from './attack';

export class MagicAttack implements IAttack {
    public attack(self: Character, target: Character): void {
        console.log(`${self.name} casts magic and pierces through ${target.name}`);
    }
}
