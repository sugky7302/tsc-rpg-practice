import { NodeStatus, SelectorNode, SequenceNode, ActionNode } from './node';

// sample functions for each action
function castSpell(): NodeStatus {
    console.log('Casting spell...');
    return NodeStatus.Success;
}

function releaseFireball(): NodeStatus {
    console.log('Releasing fireball...');
    return NodeStatus.Success;
}

function moveFireball(): NodeStatus {
    console.log('Moving fireball...');
    return NodeStatus.Success;
}

function explodeFireball(): NodeStatus {
    console.log('Exploding fireball...');
    return NodeStatus.Success;
}

function causeDamage(): NodeStatus {
    console.log('Dealing damage...');
    return NodeStatus.Success;
}

test('建立一個簡單的行為樹', () => {
    const skillTree = new SelectorNode([
        new SequenceNode([
            new ActionNode(castSpell),
            new ActionNode(releaseFireball),
            new ActionNode(moveFireball),
        ]),
        new SequenceNode([new ActionNode(explodeFireball), new ActionNode(causeDamage)]),
    ]);

    // run the behavior tree
    expect(skillTree.execute()).toBe(NodeStatus.Success);
});
