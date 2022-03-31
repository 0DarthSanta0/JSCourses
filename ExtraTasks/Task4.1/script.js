class List {
    _root;
    _size = 0;
    _Node = class {
        _next;
        _value;
        constructor(value, nextNode) {
            this._value = value;
            this._next = nextNode;
        }
    }

    constructor(value) {
        this._root = new this._Node(value, null);
        this._size = 1;
    }

    addNode (value, i) {
        if (i !== undefined && (i > this._size || i < 0)) {
            return false;
        }
        let temp = i === undefined ? this._size : i;
        let currentNode = this._root;
        for (let j = 1; j < temp; ++j) {
            currentNode = currentNode._next;
        }
        if (currentNode._next !== undefined) {
            let nextNode = currentNode._next;
            currentNode._next = new this._Node(value, nextNode);
        } else {
            currentNode._next = new this._Node(value, null)
        }
        this._size++;
        return true;
    }

    removeNode (i) {
        if (i === undefined) {
            i = this._size;
        }
        if (i > this._size - 1 || i < 0) {
            return false;
        }
        if (this._root._next === null) return false;
        let currentNode = this._root;
        for (let j = 1; j < i; ++j) {
            currentNode = currentNode._next;
        }
        if (i === 0) {
            this._root = this._root._next;
        }
        if (i === this._size) {
            currentNode._next = null;
        } else {
            currentNode._next = currentNode._next._next;
        }
        this._size--;
        return true;
    }

    print () {
        let ans = "";
        ans += this._root._value.toString();
        let currentNode = this._root;
        for (let j = 1; j < this._size; ++j) {
            currentNode = currentNode._next;
            ans += ", " + currentNode._value.toString();
        }
        console.log(ans);
    }
}

let list = new List(5);
console.log(list);
list.addNode(10);
list.addNode(12);
list.addNode(24, 2);
list.print();
console.log(list.removeNode(2));
list.print();