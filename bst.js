//bst.js

/*
t = makeTree(),
insert(12,"a",t,null,null),
insert(15, "b", t, null, null),
insert(15, "c", t, null, null),
insert(2, "f", t, null, null),
insert(18, "f", t, null, null),
insert(14, "c", t, null, null)

bstDelete(15,"b",t),
bstDelete(15,"c",t),
bstDelete(18,"f",t)


bstDelete(18, "f", t)
find(15,t)
find(12,t)
find(23,t)
*/

function makeTree() {
	return {"key": null, "value": null, "parent": null, "direction": null, "left": null, "right": null};
}

function insert(k, v, t) {
	if(t.key === null) {
		t.key = k;
		t.value = [v];
	} else if(k === t.key) {
		t.value.push(v); 
	} else {
		var direction = k < t.key ? "left" : "right";
		if(t[direction] === null)
			t[direction] = {"key": k, "value": [v], "parent": t, "direction": direction, "left": null, "right": null};
		else
			insert(k, v, t[direction]);
	}
}

function find(k, t) {
	if(k === t.key) {
		return t.value;
	} else {
		var direction = k < t.key ? "left" : "right";
		return t[direction] === null ? false : find(k, t[direction]);
	}
}


function bstDelete(k, v, t) {
	if(k === t.key) {
		var iov = v === null || t.value.indexOf(v);
		if(iov === -1) {
			return false;
		} else {
			if(v === null) { t.value = [] } else { t.value.splice(iov, 1) };
			if(t.value.length === 0) {
				if(t.left === null && t.right === null) {
					if(t.parent === null) { 
						t.key = null;
						t.value = null;
					} else { 
						t.parent[t.direction] = null;
					}
				} else if(t.left === null || t.right === null) {
					var child = t.left || t.right;
					child.parent = t.parent;
					child.direction = t.direction;
					if(t.parent === null) { 
						t.key = child.key;
						t.value = child.value;
						t.left = child.left;
						t.right = child.right;
					} else {
						t.parent[t.direction] = child;
					} 
				} else {  //two children
					var child = t.right;
					var min = child.left || child;

					t.key = min.key;
					t.value = min.value;

					if(min === child) {
						t.right = child.right;
					}

					if(min === child.left) {
						bstDelete(child.left.key, null, child.left);
					}
				}
			}
			return true;
		}
	} else {
		var direction = k < t.key ? "left" : "right";
		if(t[direction] === null)
			return false;
		else
			bstDelete(k, v, t[direction]);
	}
} 

function ftoString(t,indent) {
	console.log(indent + (t ? t.key : null) + ":" + (t ? t.value : []));
	if(t && (t.left || t.right)) {
		ftoString(t.left, indent + " ");
		ftoString(t.right, indent + " ");
	}
}

function bstTraverseInOrder(t, fn) {
	if(t !== null) {
		bstTraverseInOrder(t.left);
		fn(t.key);
		bstTraverseInOrder(t.right);
	}
}

