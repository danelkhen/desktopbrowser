export interface QueueItem {
    action: QueueAction;
}
export interface QueueAction {
    (): Promise<any>;
}

export class Queue {

}