export enum NodeStatus {
    Ready,
    Running,
    Success,
    Failure,
}

abstract class BehaviorNode {
    public status: NodeStatus = NodeStatus.Ready;

    public abstract execute(): NodeStatus;
}

export class SelectorNode extends BehaviorNode {
    private children: BehaviorNode[];

    constructor(children: BehaviorNode[]) {
        super();
        this.children = children;
    }

    public execute(): NodeStatus {
        for (const child of this.children) {
            const status = child.execute();
            if (status === NodeStatus.Success) {
                this.status = NodeStatus.Success;
                return NodeStatus.Success;
            } else if (status === NodeStatus.Running) {
                this.status = NodeStatus.Running;
                return NodeStatus.Running;
            }
        }

        this.status = NodeStatus.Failure;
        return NodeStatus.Failure;
    }
}

export class SequenceNode extends BehaviorNode {
    private children: BehaviorNode[];

    constructor(children: BehaviorNode[]) {
        super();
        this.children = children;
    }

    public execute(): NodeStatus {
        for (const child of this.children) {
            const status = child.execute();
            if (status === NodeStatus.Failure) {
                this.status = NodeStatus.Failure;
                return NodeStatus.Failure;
            } else if (status === NodeStatus.Running) {
                this.status = NodeStatus.Running;
                return NodeStatus.Running;
            }
        }

        this.status = NodeStatus.Success;
        return NodeStatus.Success;
    }
}

export class ActionNode extends BehaviorNode {
    private action: () => NodeStatus;

    constructor(action: () => NodeStatus) {
        super();
        this.action = action;
    }

    public execute(): NodeStatus {
        this.status = this.action();
        return this.status;
    }
}
