/**
 * The discussion is stored as a flat array. Parentage is encoded by `depth`:
 * an entry at depth N replies to the nearest preceding entry at depth N-1.
 * That is the existing relationship — this helper only materialises it as a
 * tree so the renderer can collapse a branch or continue a deep thread.
 */

export type CommentSource = {
  id?: string | null
  author: string
  role?: string | null
  date?: string | null
  depth?: number | null
  isExpert?: boolean | null
}

export type CommentTreeNode<T extends CommentSource> = T & {
  key: string
  children: CommentTreeNode<T>[]
}

export const buildCommentTree = <T extends CommentSource>(
  comments: T[],
): CommentTreeNode<T>[] => {
  const roots: CommentTreeNode<T>[] = []
  const stack: Array<CommentTreeNode<T> | undefined> = []

  comments.forEach((comment, index) => {
    const depth = Math.max(0, comment.depth ?? 0)
    const node: CommentTreeNode<T> = {
      ...comment,
      key: comment.id || `comment-${index}`,
      children: [],
    }

    if (depth === 0) {
      roots.push(node)
      stack.length = 0
      stack[0] = node
      return
    }

    const parent = stack[depth - 1]
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    stack.length = depth
    stack[depth] = node
  })

  return roots
}

type TreeLike = {
  children: TreeLike[]
}

export const countDescendants = (node: TreeLike): number =>
  node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0)

export const measureCommentTree = (roots: TreeLike[]) => {
  const walk = (nodes: TreeLike[], depth: number): { total: number; maxDepth: number } =>
    nodes.reduce(
      (acc, node) => {
        const nested = walk(node.children, depth + 1)
        return {
          total: acc.total + 1 + nested.total,
          maxDepth: Math.max(acc.maxDepth, depth, nested.maxDepth),
        }
      },
      { total: 0, maxDepth: 0 },
    )

  const { total, maxDepth } = walk(roots, 0)

  return {
    topLevel: roots.length,
    total,
    maxDepth,
    branchSizes: roots.map((root) => 1 + countDescendants(root)),
  }
}
