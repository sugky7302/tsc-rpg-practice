import { Character } from '../character/character';

/**
 * IAttack 為「攻擊」這個策略模式的介面宣告
 * 我們透過在父類建立一個策略的「參考點」，便可自由替換成所有繼承策略的子策略
 */
export default interface IAttack {
    attack(self: Character, target: Character): void;
}
