import { Role, RoleTemplate } from '../role/role';
import { Assert } from '../shared/assert';

class RoleTest {
    // 測試列舉
    testEnumerate() {
        console.log(Role.Swordsman);
    }

    // 測試職業模板需要擁有哪些基本屬性
    testRoleTemplateProperty() {
        const roleTemplate = new RoleTemplate(Role.Mage);
        console.log(roleTemplate.role);
        console.log(roleTemplate.knowledges);
        console.log(roleTemplate.skills);
        Assert.isTrue(roleTemplate.match({ roles: [Role.Mage, Role.Knight, Role.Warlock] }));
    }
}

export function test() {
    const test = new RoleTest();
    test.testEnumerate();
    test.testRoleTemplateProperty();
}
