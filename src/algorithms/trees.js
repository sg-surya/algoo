// Working Tree visualizers — BST Insert, BST Search, Inorder Traversal
// Step format: { tree: { nodes: [{id, value, depth, order}], edges: [[parentId, childId]], current, visited, foundId, order }, ... }

function buildLayout(values) {
  // Build BST structure with ids
  let root = null;
  let nid = 0;
  const nodes = [];
  function insertNode(value) {
    const node = { id: nid++, value, left: null, right: null, parent: null, depth: 0 };
    nodes.push(node);
    if (!root) { root = node; return { node, path: [] }; }
    let cur = root;
    const path = [cur.id];
    while (true) {
      if (value < cur.value) {
        if (cur.left === null) { cur.left = node.id; node.parent = cur.id; node.depth = nodes[cur.left ? 0 : 0]?.depth ?? 0; node.depth = cur.depth + 1; return { node, path }; }
        cur = nodes[cur.left]; path.push(cur.id);
      } else {
        if (cur.right === null) { cur.right = node.id; node.parent = cur.id; node.depth = cur.depth + 1; return { node, path }; }
        cur = nodes[cur.right]; path.push(cur.id);
      }
    }
  }
  return { root, nodes, insertNode };
}

function layoutPositions(nodes, rootId) {
  // inorder index -> x, depth -> y
  const order = [];
  function inorder(id) {
    if (id === null || id === undefined) return;
    const n = nodes[id];
    inorder(n.left);
    order.push(id);
    inorder(n.right);
  }
  if (rootId !== null) inorder(rootId);
  const pos = {};
  order.forEach((id, i) => { pos[id] = { x: 40 + i * (240 / Math.max(1, order.length - 1 || 1)), y: 40 + nodes[id].depth * 70 }; });
  return pos;
}

function snapshot(nodes, rootId, extra = {}) {
  const pos = layoutPositions(nodes, rootId);
  return {
    nodes: nodes.map(n => ({ ...n, x: pos[n.id]?.x ?? 150, y: pos[n.id]?.y ?? 40 })),
    edges: nodes.filter(n => n.parent !== null).map(n => [n.parent, n.id]),
    rootId,
    ...extra,
  };
}

export function bstInsertSteps(input) {
  const values = [...input].slice(0, 9);
  const steps = [];
  const { nodes, insertNode } = buildLayout();
  let rootId = null;
  const push = (o) => steps.push({ tree: snapshot(nodes, rootId, { current: o.current ?? null, visited: o.visited ? [...o.visited] : [], order: o.order ? [...o.order] : [] }), variables: { inserted: o.inserted ?? "-", current: o.currentName ?? "-", comps: steps.filter(s=>s.type==="compare").length }, ...o });

  push({ type: "start", current: null, message: `BST Insert — [${values.join(", ")}] ko tree me dalo 🌳`, codeLine: 0 });
  const visited = [];
  values.forEach((v, vi) => {
    if (nodes.length === 0) {
      const { node } = insertNode(v);
      rootId = node.id;
      push({ type: "insert", current: node.id, currentName: v, inserted: v, message: `Root banao: ${v} 👑`, codeLine: 1, visited });
    } else {
      // walk path
      let curId = rootId;
      push({ type: "compare", current: curId, currentName: nodes[curId].value, inserted: v, message: `Insert ${v} — root ${nodes[curId].value} se compare`, codeLine: 2, visited });
      while (true) {
        const curNode = nodes[curId];
        if (v < curNode.value) {
          if (curNode.left === null) {
            const { node } = insertNode(v);
            push({ type: "insert", current: node.id, currentName: v, inserted: v, message: `${v} < ${curNode.value} → left lagao ✅`, codeLine: 3, visited });
            break;
          } else {
            curId = curNode.left;
            push({ type: "compare", current: curId, currentName: nodes[curId].value, inserted: v, message: `${v} < ${curNode.value} → left jao (${nodes[curId].value})`, codeLine: 2, visited });
          }
        } else {
          if (curNode.right === null) {
            const { node } = insertNode(v);
            push({ type: "insert", current: node.id, currentName: v, inserted: v, message: `${v} >= ${curNode.value} → right lagao ✅`, codeLine: 3, visited });
            break;
          } else {
            curId = curNode.right;
            push({ type: "compare", current: curId, currentName: nodes[curId].value, inserted: v, message: `${v} >= ${curNode.value} → right jao (${nodes[curId].value})`, codeLine: 2, visited });
          }
        }
      }
    }
    visited.push(v);
  });
  push({ type: "done", current: null, message: `BST ready! Left < parent < right ✨`, codeLine: 4 });
  return steps;
}

export function bstSearchSteps(input, targetOverride) {
  const values = [...input].slice(0, 9);
  const parsed = Number(targetOverride);
  const target = (targetOverride !== undefined && targetOverride !== null && targetOverride !== "" && !isNaN(parsed)) ? parsed : values[Math.floor(values.length / 2)];
  // build tree first (no steps for build, just structure)
  const { nodes, insertNode } = buildLayout();
  let rootId = null;
  values.forEach(v => { const { node } = insertNode(v); if (rootId === null) rootId = node.id; });
  const steps = [];
  const push = (o) => steps.push({ tree: snapshot(nodes, rootId, { current: o.current ?? null, visited: o.visited ? [...o.visited] : [], foundId: o.foundId ?? null }), variables: { target, current: o.currentName ?? "-", comps: steps.filter(s=>s.type==="compare").length }, ...o });
  push({ type: "start", current: rootId, currentName: nodes[rootId]?.value, message: `BST Search — ${target} dhoondo 🔍`, codeLine: 0, visited: [] });
  const visited = [];
  let curId = rootId;
  while (curId !== null && curId !== undefined) {
    const curNode = nodes[curId];
    visited.push(curNode.value);
    push({ type: "compare", current: curId, currentName: curNode.value, message: `Check ${curNode.value} == ${target}?`, codeLine: 1, visited });
    if (curNode.value === target) {
      push({ type: "mark_sorted", current: curId, foundId: curId, currentName: curNode.value, message: `Mil gaya! ${target} 🎯`, codeLine: 2, visited });
      push({ type: "done", current: curId, foundId: curId, message: `Found ${target} — O(h)`, codeLine: 2, visited });
      return steps;
    } else if (target < curNode.value) {
      push({ type: "pick", current: curId, currentName: curNode.value, message: `${target} < ${curNode.value} → left`, codeLine: 3, visited });
      curId = curNode.left;
      if (curId === null) break;
    } else {
      push({ type: "pick", current: curId, currentName: curNode.value, message: `${target} > ${curNode.value} → right`, codeLine: 3, visited });
      curId = curNode.right;
      if (curId === null) break;
    }
  }
  push({ type: "done", current: null, message: `${target} tree me nahi hai ✕`, codeLine: 4, visited });
  return steps;
}

export function inorderSteps(input) {
  const values = [...input].slice(0, 9);
  const { nodes, insertNode } = buildLayout();
  let rootId = null;
  values.forEach(v => { const { node } = insertNode(v); if (rootId === null) rootId = node.id; });
  const steps = [];
  const order = [];
  const push = (o) => steps.push({ tree: snapshot(nodes, rootId, { current: o.current ?? null, visited: [...order], order: [...order] }), variables: { visited: order.join(",") || "-", current: o.currentName ?? "-" }, ...o });
  push({ type: "start", current: rootId, currentName: nodes[rootId]?.value, message: `Inorder — Left → Root → Right 🌳`, codeLine: 0 });
  function traverse(id) {
    if (id === null || id === undefined) return;
    const n = nodes[id];
    if (n.left !== null) {
      push({ type: "pick", current: n.left, currentName: nodes[n.left].value, message: `${n.value} ka left (${nodes[n.left].value}) pehle`, codeLine: 1 });
      traverse(n.left);
    }
    order.push(n.value);
    push({ type: "mark_sorted", current: id, currentName: n.value, message: `Visit ${n.value} → [${order.join(", ")}]`, codeLine: 2 });
    if (n.right !== null) {
      push({ type: "pick", current: n.right, currentName: nodes[n.right].value, message: `Phir right (${nodes[n.right].value})`, codeLine: 3 });
      traverse(n.right);
    }
  }
  traverse(rootId);
  push({ type: "done", current: null, message: `Inorder: [${order.join(", ")}] — sorted! ✨`, codeLine: 4 });
  return steps;
}

export const bstInsertCode = [
  "def bst_insert(root, x):",
  "    if root is None: return Node(x)",
  "    if x < root.val: root.left = bst_insert(root.left, x)",
  "    else: root.right = bst_insert(root.right, x)",
  "    return root",
];
export const bstSearchCode = [
  "def bst_search(root, x):",
  "    while root:",
  "        if root.val == x: return root",
  "        elif x < root.val: root = root.left",
  "        else: root = root.right",
  "    return None",
];
export const inorderCode = [
  "def inorder(root):",
  "    if root:",
  "        inorder(root.left)",
  "        visit(root.val)",
  "        inorder(root.right)",
];
