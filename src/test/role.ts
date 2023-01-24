import { Role } from '../role/role';

class RoleTest {
    // 測試列舉
    testEnumerate() {
        console.log(Role.Swordsman);
    }
}

export function test() {
    const test = new RoleTest();
    test.testEnumerate();
}
