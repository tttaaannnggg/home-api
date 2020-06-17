//LRU cache for the db layer
//LRU controls DLL controls DllNode
function LRU(maxSize) {
  this.keys = {};
  this.q = new Dll();
  this.maxSize = maxSize;
}

//access should move it to the top of the list
LRU.prototype.get = function(key) {
  if (!this.keys[key]) {
    return null;
  }
  const vals = this.keys[key].removeNode();
  this.q.insertFront(key, vals.removed.val);
  return vals.removed.val;
};

//set should upsert
//if updating, shift to the front
LRU.prototype.set = function(key, val) {
  if (this.keys[key]) {
    this.keys[key].removeNode();
  } else if (this.q.length >= this.maxSize) {
    const removed = this.q.removeEnd();
    delete this.keys[removed.key];
  }
  const newNode = this.q.insertFront(key, val);
  this.keys[key] = newNode;
};

LRU.prototype.delete = function(key) {
  if (!this.keys[key]) {
    return null;
  }
  let target = this.keys[key];
  if (this.q.tail === target) {
    this.q.tail = target.prev;
  }
  if (this.q.head === target) {
    this.q.head = target.next;
  }
  const removed = target.removeNode();
  this.q.length -= 1;
  delete this.keys[key];
  return removed;
};

function Dll() {
  this.length = 0;
  this.head = null;
  this.tail = null;
}

Dll.prototype.insertFront = function(key, val) {
  this.length++;
  const newNode = new DllNode(key, val);
  newNode.next = this.head;
  if (newNode.next) {
    newNode.next.prev = newNode;
  }
  this.head = newNode;
  if (!this.tail) {
    this.tail = newNode;
  }
  return newNode;
};

Dll.prototype.removeEnd = function() {
  if (!this.tail) {
    return null;
  }
  this.length--;
  const removed = this.tail;
  this.tail = removed.prev;
  if (this.tail) {
    this.tail.next = null;
  }
  removed.prev = null;
  return removed;
};

function DllNode(key, val) {
  this.key = key;
  this.val = val;
  this.next = null;
  this.prev = null;
}

DllNode.prototype.removeNode = function() {
  if (this.prev && this.next) {
    this.prev.next = this.next.prev;
  } else if (this.prev && !this.next) {
    this.prev.next = null;
  } else if (this.next) {
    this.next.prev = null;
  }
  return { removed: this, prev: this.prev, next: this.next };
};

module.exports = LRU;
