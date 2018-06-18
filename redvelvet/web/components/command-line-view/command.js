class BufferNode {
  constructor(data, next, prev) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}


class CommandHistory {
  constructor(capacity) {
    this._capacity = capacity || 50;
    this._length = 0;
    this._front = null;
    this._current = null;
  }

  prev() {
    if (!this._current) return '';
    const command = this._current.data;

    if (this._current.prev !== this._front) this._current = this._current.prev;
    return command
  }

  next() {
    if (!this._current) return '';
    if (this._current !== this._front) {
      this._current = this._current.next;
      return this._current.data;
    } else return '';
  }

  push(command) {
    if (this._length === 0) {
      this._front = new BufferNode(command);
      this._front.next = this._front.prev = this._front;
    }
    else if (this._length >= this._capacity) this._front.next.data = command;
    else this._front.next = new BufferNode(command, this._front.next, this._front);

    this._length++;
    this._front = this._front.next;
    this._current = this._front;
  }
}


class CommandBuffer {
  constructor(capacity) {
    this._capacity = capacity || 50;
    this._length = 0;
    this._front = null;
  }

  get length() {
    return Math.min(this._length, this._capacity);
  }

  get commands() {
    let commands = [];
    if (this._length === 0) return commands;

    const end = this._front;
    let iter = this._front;

    do {
      iter = iter.next;
      commands.push(iter.data);
    } while (iter !== end);
    return commands;
  }

  push(command) {
    if (this._length === 0) {
      this._front = new BufferNode(command);
      this._front.next =  this._front;
    }
    else if (this._length >= this._capacity) this._front.next.data = command;
    else this._front.next = new BufferNode(command, this._front.next);

    this._length++;
    this._front = this._front.next;
  }
}


class Command {
  constructor(message) {
    this.command = message.command;
    this.result = message.result;
  }
}
