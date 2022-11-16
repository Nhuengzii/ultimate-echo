// priority queue that store generic type
//
export class PriorityQueueNode<T> {
  priority: number;
  value: T;
  constructor(priority: number, value: T) {
    this.priority = priority;
    this.value = value;
  }
}


export class PriorityQueue {
  queue: PriorityQueueNode<any>[];
  constructor() {
    this.queue = [];
  }
  enqueue(priority: number, value: any) {
    let node = new PriorityQueueNode(priority, value);
    let isAdded = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (node.priority < this.queue[i].priority) {
        this.queue.splice(i, 0, node);
        isAdded = true;
        break;
      }
    }
    if (!isAdded) {
      this.queue.push(node);
    }
  }
  dequeue() {
    return this.queue.shift();
  }
  peek() {
    return this.queue[0];
  }
  isEmpty() {
    return this.queue.length == 0;
  }
  size() {
    return this.queue.length;
  }
  print() {
    for (let i = 0; i < this.queue.length; i++) {
      console.log(`${this.queue[i].priority} - ${this.queue[i].value}`);
    }
  }
}
