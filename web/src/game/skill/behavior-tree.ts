export enum Status {
    Success,
    Fail,
    Running,
}

export class Blackboard {
    private data: Record<string, any> = {};
    get(key: string) {
        return this.data[key];
    }
    set(key: string, value: any) {
        this.data[key] = value;
    }
}

// 行為樹節點的基類，所有節點都需要繼承自這個類。
// 它包含了一個 aborted 屬性，用於標記節點是否被中止。
// 每個節點都需要實現 tick 方法，這是行為樹的核心邏輯。
// 當需要中止節點時，可以調用 abort 方法。
// tick 方法會接收一個 Blackboard 實例，這是行為樹的黑板，用於存儲和共享數據。
// 返回值是 Status 枚舉，表示節點的執行狀態：Success、Fail、Running。
// 不設計 init 方法，因為行為樹節點用完就會被刪除
export abstract class BehaviorTreeNode {
    constructor(protected aborted = false) {}
    // 每個節點都需要實現 tick 方法，這是行為樹的核心邏輯。
    abstract tick(bb: Blackboard): Promise<Status>;
    abort(): void {
        this.aborted = true;
    }
}

// SequenceNode 會執行一系列子節點，直到其中一個失敗或全部成功。
// 如果有子節點正在運行，則會返回 Running 狀態。
// 如果所有子節點都成功，則返回 Success 狀態。
// 如果有子節點失敗，則返回 Fail 狀態並重置當前索引。
// 如果在運行過程中需要中止，則可以調用 abort 方法。
export class SequenceNode extends BehaviorTreeNode {
    private current = 0;

    constructor(private children: BehaviorTreeNode[]) {
        super();
    }

    async tick(bb: Blackboard): Promise<Status> {
        while (this.current < this.children.length && !this.aborted) {
            const status = await this.children[this.current].tick(bb);

            if (status === Status.Running) return Status.Running;
            if (status === Status.Fail) {
                this.current = 0; // Reset on failure
                return Status.Fail;
            }
            this.current++;
        }
        return Status.Success;
    }

    override abort() {
        for (const child of this.children) {
            child.abort();
        }
        this.aborted = true; // 標記為已中止
    }
}

// SelectorNode 會嘗試執行一系列子節點，直到其中一個成功或全部失敗。
// 如果有子節點正在運行，則會返回 Running 狀態。
// 如果有子節點成功，則返回 Success 狀態並重置當前索引。
// 如果所有子節點都失敗，則返回 Fail 狀態並重置當前索引。
// 如果在運行過程中需要中止，則可以調用 abort 方法。
export class SelectorNode extends BehaviorTreeNode {
    private current = 0;

    constructor(private children: BehaviorTreeNode[]) {
        super();
    }

    async tick(bb: Blackboard): Promise<Status> {
        while (this.current < this.children.length) {
            const status = await this.children[this.current].tick(bb);

            if (status === Status.Running) return Status.Running;
            if (status === Status.Success) {
                this.current = 0; // Reset on success
                return Status.Success;
            }
            this.current++;
        }
        return Status.Fail;
    }

    override abort() {
        this.current = 0; // Reset current index
        this.aborted = true; // 標記為已中止
        for (let i = this.current; i < this.children.length; i++) {
            this.children[i].abort();
        }
    }
}

// ActionNode 代表一個具體的行為節點，執行特定的任務。
export class ActionNode extends BehaviorTreeNode {
    constructor(private action: (bb: Blackboard) => Promise<Status>) {
        super();
    }

    async tick(bb: Blackboard): Promise<Status> {
        return this.action(bb);
    }
}

// ConditionNode 代表一個條件節點，檢查某個條件是否滿足。
export class ConditionNode extends BehaviorTreeNode {
    constructor(private condition: (bb: Blackboard) => boolean) {
        super();
    }

    async tick(bb: Blackboard): Promise<Status> {
        return this.condition(bb) ? Status.Success : Status.Fail;
    }
}

// ParallelNode 代表一個並行節點，同時執行多個子節點。
export class ParallelNode extends BehaviorTreeNode {
    constructor(
        private children: BehaviorTreeNode[],
        private successThreshold: number
    ) {
        super();
        if (successThreshold < 1 || successThreshold > children.length) {
            throw new Error('Success threshold must be between 1 and the number of children');
        }
    }

    async tick(bb: Blackboard): Promise<Status> {
        // 全部都執行一遍
        const promises = this.children.map((child) => child.tick(bb));
        // 用 Promise.allSettled，這樣每個都會執行完，不會因為一個 rejected 中斷
        const results = await Promise.allSettled(promises);

        // 統計結果
        let successCount = 0;
        let runningCount = 0;

        for (const result of results) {
            if (result.status === 'fulfilled') {
                if (result.value === Status.Success) successCount++;
                if (result.value === Status.Running) runningCount++;
            }
        }

        if (successCount >= this.successThreshold) return Status.Success;
        if (runningCount > 0) return Status.Running;

        return Status.Fail;
    }

    override abort() {
        for (const child of this.children) {
            child.abort();
        }
        this.aborted = true; // 標記為已中止
    }
}

// DecoratorNode 代表一個裝飾器節點，可以修改子節點的行為。
export class DecoratorNode extends BehaviorTreeNode {
    constructor(
        private child: BehaviorTreeNode,
        private decorator: (status: Status) => Status
    ) {
        super();
    }

    async tick(bb: Blackboard): Promise<Status> {
        const status = await this.child.tick(bb);
        return this.decorator(status);
    }

    override abort(): void {
        this.child.abort();
    }
}

export class BTManager {
    private running = false;

    private trees: {
        node: BehaviorTreeNode;
        blackboard: Blackboard;
        status: Status;
    }[] = [];

    addTree(node: BehaviorTreeNode, blackboard: Blackboard): void {
        this.trees.push({ node, blackboard, status: Status.Running });
    }

    abortTree(i: number): void {
        if (i < 0 || i >= this.trees.length) {
            console.warn(`Invalid tree index: ${i}`);
            return;
        }

        const tree = this.trees[i];
        if (tree) {
            tree.node.abort();
            tree.status = Status.Fail; // 標記為失敗
        }
    }

    isRunning(): boolean {
        return this.running;
    }

    start(): void {
        this.running = true;
        this.trees.forEach((tree) => {
            tree.status = Status.Running; // 重置狀態為 Running
        });
        this.tick();
    }

    stop(): void {
        this.running = false;
    }

    private tick = async () => {
        if (!this.running) return;
        for (const tree of this.trees) {
            const status = await tree.node.tick(tree.blackboard);
            tree.status = status;
        }

        if (this.trees.some((tree) => tree.status === Status.Running)) {
            // 如果還有樹在運行，繼續下一個 tick
            await new Promise(() => setTimeout(this.tick, 100)); // 每 100 毫秒執行一次
        } else {
            this.stop();
        }
    };
}
