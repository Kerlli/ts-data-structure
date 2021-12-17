type TreePath = Array<'left' | 'right'>

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  constructor(value: T) {
    this.value = value
    this.left = null
    this.right = null
  }
}

interface BST<T> {
  root: TreeNode<T> | null;
  insert: (value: T) => void;
  search: (value: T) => string | -1;
  remove: (value: T) => void;
  inOrderTraverse: () => Array<T>;
  preOrderTraverse: () => Array<T>;
  postOrderTraverse: () => Array<T>;
  minNode: () => TreeNode<T> | null;
  maxNode: () => TreeNode<T> | null;
}

class CustomBST<T> implements BST<T> {
  root: TreeNode<T> | null;
  constructor () {
    this.root = null
  }
  insert(value: T) {
    if (!this.root) {
      this.root = new TreeNode(value)
    } else {
      const insertNode = (node: TreeNode<T>, val: T) => {
        if (node.value > val) {
          // insert to left
          node.left ? insertNode(node.left, val) : node.left = new TreeNode(val)
        } else if (node.value < val) {
          // insert to right
          node.right ? insertNode(node.right, val) : node.right = new TreeNode(val)
        } else {
          // temporally ignore when val === node.value
        }
      }
      insertNode(this.root, value)
    }
  }
  private pathToNode(node: TreeNode<T> | null, val: T, paths: TreePath = []): TreePath | -1 {
    if (node === null) return -1
    if (node.value === val) return [...paths]
    return node.value > val
      ? this.pathToNode(node.left, val, [...paths, 'left'])
      : this.pathToNode(node.right, val, [...paths, 'right'])
  }
  search(value: T) {
    const nodePath = this.pathToNode(this.root, value)
    return nodePath === -1
      ? -1
      : `found value ${value}, path: ${['root', ...nodePath].join(' -> ')}`
  }
  remove(value: T) {
    const nodePath = this.pathToNode(this.root, value)
    if (nodePath === -1) {
      console.warn(`could not find node: ${value}`)
    } else if (!nodePath.length) {
      console.warn(`could not remove root node`)
    } else if (nodePath.length) {
      const parentNode = nodePath.length === 1
        ? this.root as TreeNode<T>
        : nodePath.slice(0, -1).reduce((prev, next) => (prev as TreeNode<T>)[next], this.root) as TreeNode<T>
      const targetNode = nodePath.reduce((prev, next) => (prev as TreeNode<T>)[next], this.root) as TreeNode<T>
      const targetNodeIsLeftChild = nodePath.at(-1) === 'left'
      console.log(parentNode)
      console.log(targetNode)
      // if targetNode is leaf
      if (!targetNode.left && !targetNode.right) {
        targetNodeIsLeftChild ? parentNode.left = null : parentNode.right = null
      }
      // set targetNode's child -> parentNode's child
      else if (!targetNode.left || !targetNode.right) {
        if (targetNode.left) {
          targetNodeIsLeftChild
          ? parentNode.left = targetNode.left
          : parentNode.right = targetNode.left
        } else {
          targetNodeIsLeftChild
          ? parentNode.left = targetNode.right
          : parentNode.right = targetNode.right
        }
      } else if (targetNode.left && targetNode.right) {
        const maxLeftLeafNode = this.maxNode(targetNode.left)
        console.log('max left node', maxLeftLeafNode)
        const pathToMaxLeftLeafNode = this.pathToNode(this.root, maxLeftLeafNode.value) as TreePath
        console.log('pathToMaxLeftLeafNode', pathToMaxLeftLeafNode)
        targetNode.value = maxLeftLeafNode.value
        const maxLeftLeafParentNode = pathToMaxLeftLeafNode
          .slice(0, -1)
          .reduce((prev, next) => (prev as TreeNode<T>)[next], this.root) as TreeNode<T>
        maxLeftLeafParentNode.left = null
      }
    }
  }
  inOrderTraverse() {
    let nodeList: Array<T> = []
    const inOrder = (node: TreeNode<T> | null) => {
      if (node) {
        node.left && inOrder(node.left)
        nodeList.push(node.value)
        node.right && inOrder(node.right)
      }
    }
    inOrder(this.root)
    return nodeList
  }
  preOrderTraverse() {
    let nodeList: Array<T> = []
    const preOrder = (node: TreeNode<T> | null) => {
      if (node) {
        nodeList.push(node.value)
        node.left && preOrder(node.left)
        node.right && preOrder(node.right)
      }
    }
    preOrder(this.root)
    return nodeList
  }
  postOrderTraverse() {
    let nodeList: Array<T> = []
    const postOrder = (node: TreeNode<T> | null) => {
      if (node) {
        node.left && postOrder(node.left)
        node.right && postOrder(node.right)
        nodeList.push(node.value)
      }
    }
    postOrder(this.root)
    return nodeList
  }
  minNode(node: TreeNode<T> | null = this.root) {
    while(node?.left !== null) {
      node = node?.left || null
    }
    return node
  }
  maxNode(node: TreeNode<T> | null = this.root) {
    while(node?.right !== null) {
      node = node?.right || null
    }
    return node
  }
}

export {
  CustomBST
}
