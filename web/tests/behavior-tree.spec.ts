import {
    Status,
    ActionNode,
    SequenceNode,
    Blackboard,
    BTManager,
    BehaviorTreeNode,
} from '../src/game/skill/behavior-tree';
import { test } from '@playwright/test';

class LogAction extends ActionNode {
    constructor(private message: string) {
        super(async (bb: Blackboard) => {
            console.log(this.message, bb.get('id'));
            return Status.Success;
        });
    }
}

class WaitNode extends BehaviorTreeNode {
    private startTime: number | null = null;
    private duration: number;

    constructor(seconds: number) {
        super();
        this.duration = seconds * 1000;
    }

    async tick(bb: Blackboard): Promise<Status> {
        if (this.aborted) return Status.Fail;

        if (this.startTime === null) {
            this.startTime = new Date().getTime();
        }

        if (new Date().getTime() - this.startTime >= this.duration) {
            return Status.Success;
        }

        return Status.Running;
    }

    override abort() {
        super.abort();
        this.startTime = null;
    }
}

test('BT Manager', async () => {
    const manager = new BTManager();

    for (let i = 0; i < 5; i++) {
        const bb = new Blackboard();
        bb.set('id', i);

        const tree = new SequenceNode([
            new LogAction('Start'),
            new WaitNode(2), // 等待 2 秒
            new LogAction('Middle'),
            new WaitNode(1), // 等待 1 秒
            new LogAction('End'),
        ]);

        manager.addTree(tree, bb);
    }

    manager.start();

    // 模擬 3 秒後中止編號 2
    setTimeout(() => {
        manager.abortTree(2);
    }, 3000);

    // 等待所有樹完成
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (!manager.isRunning()) {
                clearInterval(interval);
                resolve(null);
            }
        }, 100);
    });
});
