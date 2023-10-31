
class Node {
    constructor(title, parent, attr) {
        this.title = title;
        if(attr !== null){
            this.attr = attr;
        }
        else{
            this.attr = [];
        }
        this.children = [];
        this.parent = parent;
    }
}

class Tree {

    constructor() {
        this.root = null;
    }

    //插入節點
    insert(value, parent, attr, duplicateNode, treeData) {
        let newNode = new Node(value, parent, attr);
        let current = this.find(parent);
        console.log(duplicateNode);
        console.log(treeData);
        //當起始點有兩個的時候
        if(duplicateNode.length !== 0){
            console.log("in 22222");
            // if(treeData !== null){//進不來~~
            //     for(let i = 0; i < treeData.length; i++){
            //         let node = findNodeInOtherTree(treeData[i], value);
            //         if(node !== null){
            //             return 2;//多個標記?
            //         }
            //     }
            // }
            for(let i = 0; i < treeData.length; i++){
                console.log(treeData[i]);
                let node = findNodeInOtherTree(treeData[i], duplicateNode[0]);
                console.log(node);
                if(node !== null){
                    this.root = new Node(parent, null, attr);
                    this.root.children.push(node);
                    return 3;
                }
            }
            // this.root = new Node(parent, null, attr);
            // this.root.children.push(duplicateNode);
            // return 3;
        }
        //沒有根節點與子節點
        if (current === null && this.root === null) {
            console.log("new root");
            this.root = new Node(parent, null, attr);
            this.root.children.push(newNode);
        }
        //有根節點、沒有parent且已經有子節點(=根節點)->需更換根節點
        else if (this.find(value) !== null && current === null && this.find(value) === this.root) {
            console.log("change parent/root");
            let oldRoot = this.root;
            this.root = new Node(parent, null, attr);
            this.root.children.push(oldRoot);
            oldRoot.parent = this.root.title;
        }
        //有根節點、沒有parent且已經有子節點(根節點和子節點並非同一個)
        else if(this.find(value) !== null && current === null){
            console.log("this.find(value) !== null && current === null");
            return 2;
        }
        //有根節點但沒有parent->需建一個新的tree
        else if (current === null) {
            console.log("new tree");
            return 1;
            //new a tree->becomes many trees
        }
        //有parent無子節點
        else {
            console.log("normal");
            current.children.push(newNode);
        }

    }

    //尋找節點
    find(value) {
        let data = [];
        let result = null;
        function traverse(node) {
            data.push(node);
            if (node.title === value) {
                result = node;
                return;
            }
            node.children.forEach(element => {
                traverse(element);
            });
        }
        if (this.root !== null) {
            traverse(this.root);
        }
        return result;
    }

}

function findNodeInOtherTree(treeRoot, targetNode) {
    let result = null;
    console.log(treeRoot);
    if (treeRoot.title === targetNode) {
        result = treeRoot;
        return result;
    }
    treeRoot.children.forEach(element => {
        result = findNodeInOtherTree(element, targetNode);
    });
    return result;
}

/*
class Graph {
    constructor() {
        this.adjacencyList = {};
        this.startVector = [];
    }

    addVertex(vertex){
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(from, to){
        if(!this.adjacencyList[from]){
            this.addVertex(from);
            this.startVector.push(from);
        }
        this.adjacencyList[from].push(to);
        if(!this.adjacencyList[to]){
            this.addVertex(to);
        }

        let start = this.startVector.indexOf(to);
        if(start > -1){//to有在startVector裡
            this.startVector[start] = from;
        }
        //this.adjacencyList[v2].push(v1);
    }

    removeEdge(v1,v2){
        this.adjacencyList[v1] = this.adjacencyList[v1].filter(
            v => v !== v2
        )
        // this.adjacencyList[v2] = this.adjacencyList[v2].filter(
        //     v => v !== v1
        // )
    }

    removeVertex(vertex){
        while (this.adjacencyList[vertex].length) {
            const adjacencyVertex = this.adjacencyList[vertex].pop();
            this.removeEdge(vertex,adjacencyVertex);
        }
        delete this.adjacencyList[vertex]; 
    }

    depthFirstRecursive(start){
        const result = [];
        const visited = {};
        const adjacencyList = this.adjacencyList;
        (function dfs(vertex) {
            if(!vertex) return null;
            visited[vertex] = true; 
            result.push(vertex);
            //console.log(adjacencyList[vertex]);
            adjacencyList[vertex].forEach(neighbor => {
                if(!visited[neighbor]) {
                    return dfs(neighbor);
                }
            });
        })(start);
        return result;
    }

}

function parseDot(dot){
    let digraph = new Graph();
    while(dot.length !== 0){
        
        for(let i =0; i < dot.length;i++){
            if(dot[i].type === 'edge_stmt'){
                let edge = dot[i].edge_list;
                digraph.addEdge(edge[0].id, edge[1].id);
            }
            else if(dot[i].type === 'node_stmt'){
                digraph.addVertex(dot[i].node_id.id);
            }
            dot.splice(i, 1);
            i--;
        }
        console.log(digraph);
    }
    let result = [];
    for(let i =0; i < digraph.startVector.length;i++){
        result.push(digraph.depthFirstRecursive(digraph.startVector[i]));
    }
    console.log(result);
    return result;
    //console.log(digraph.startVector);
}*/

//更新節點的屬性
function updateNodeAttr(node, newData, nodeAttr){
    console.log("update");
    nextAttr:
    for(let i =0; i < newData.attr_list.length;i++){
        if(node.attr.length === 0){
            node.attr = newData.attr_list;
            // if(nodeAttr !== null){
            //     console.log("insert node[]");
            //     node.attr.push(nodeAttr[0]);
            // }
        }
        for(let j =0; j< node.attr.length;j++){
            if(newData.attr_list[i].id === node.attr[j].id && newData.attr_list[i].eq === node.attr[j].eq){//無須更新
                continue nextAttr;
            }
            else if(newData.attr_list[i].id === node.attr[j].id && newData.attr_list[i].eq !== node.attr[j].eq){//要更新
                newData.attr_list[i].eq = node.attr[j].eq;
                //node.attr.push(newData.attr_list[i]);
                continue nextAttr;
            }
            else if(j === node.attr.length-1){//新增屬性
                //console.log(newData.attr_list[i]);
                node.attr.push(newData.attr_list[i]);
            }
            // else if(node.attr[j].id === nodeAttr.id && node.attr[j].eq !== nodeAttr.eq){//新增屬性->node[style=sth]
            //     node.attr.push(nodeAttr[0]);
            //     continue nextAttr;
            // }
        }
    }
    if(nodeAttr !== null){//why前兩個node會有兩個nodeAttr??
        let insertAttr = true;
        for(let i=0; i < node.attr.length;i++){
            if(node.attr[i].id === nodeAttr.id){
                insertAttr = false;
                break;
            }
        }
        if(insertAttr){
            console.log("insert node[]");
            console.log(nodeAttr[0]);
            node.attr.push(nodeAttr[0]);
        }
    }
    //node.attr = newData.attr_list;
    console.log(node);
}

//DOT to treeData (屬性需另外存)->edge屬性要存哪??
function parseDOT(children) {
    //console.log(children);
    let treeData = [];
    let nodeAttr = null;
    let edgeAttr = null;
    let duplicateNode = [];//兩點匯集的點
    while (children.length !== 0) {
        let tree = new Tree();
        for (let i = 0; i < children.length; i++) {
            if (children[i].type === 'edge_stmt') {
                let edge = children[i].edge_list;
                let check = tree.insert(edge[1].id, edge[0].id, children[i].attr_list, duplicateNode, treeData);
                if (check === 1) {//new tree
                    console.log(1);
                    continue;
                }
                else if(check === 2){//2 nodes to a same node
                    duplicateNode.push(edge[1].id);
                    // if(treeData !== null){
                    //     for(let i = 0; i < treeData.length; i++){
                    //         duplicateNode = findNodeInOtherTree(treeData[i], edge[1].id);
                    //         console.log(duplicateNode);
                    //         if(duplicateNode !== null){
                    //             console.log(duplicateNode);
                    //             break;
                    //             //tree.insert(edge[1].id, duplicateNode.title, children[i].attr_list, edgeAttr);
                    //         }
                    //     }
                    // }
                    console.log(2);
                    continue;
                }
                else if(check === 3){
                    duplicateNode.shift();
                    console.log(tree.root);
                    console.log(3);
                }
                children.splice(i, 1);
                i--;
            }
            else if(children[i].type === 'attr_stmt'){
                console.log("attr_list");
                if(children[i].target === 'node'){//node
                    nodeAttr = children[i].attr_list;
                    console.log(nodeAttr);
                }
                else{//edge
                    edgeAttr = children[i].attr_list;
                    console.log(edgeAttr);
                }
                children.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < children.length; i++) {
            if (children[i].type === 'node_stmt') {
                let node = children[i].node_id.id;
                // for (let j = 0; j < children[i].attr_list.length; j++) {
                //     if (children[i].attr_list[j].id === "label") {//使用label當名稱?
                //         console.log("label");
                //         node = children[i].attr_list[j].eq;
                //         break;
                //     }
                // }
                let check = tree.find(node);
                if (check === null && tree.root === null) {//new tree
                    let attribute = children[i].attr_list;
                    if(nodeAttr !== null){
                        attribute.push(nodeAttr);
                    }
                    //console.log(attribute);
                    tree.root = new Node(node, null, attribute);
                    children.splice(i, 1);
                    i--;
                }
                else if (check !== null) {//已經有該節點了
                    updateNodeAttr(check, children[i], nodeAttr);
                    children.splice(i, 1);
                    i--;
                }
                else {//new tree
                    continue;
                }
            }
        }
        console.log(tree);
        treeData.push(tree.root);
    }
    return treeData;
}

//遍歷樹
function DFS(node, dotString) {
    dotString += '"' + node.title + '"';
    //console.log(node.attr);
    if(node.attr.length !== 0){//添加屬性
        dotString += '[';
        if(node.attr[0].id ==='label' || node.attr[0].id ==='xlabel'){
            dotString += node.attr[0].id + '="' + node.attr[0].eq+'"';
        }
        else
            dotString += node.attr[0].id + '=' + node.attr[0].eq;
        for(let i = 1; i < node.attr.length; i++){
            if(node.attr[i].id ==='label' || node.attr[i].id ==='xlabel'){
                dotString += ', ' + node.attr[i].id + '="' + node.attr[i].eq+'"';
            }
            else{
                dotString += ', ' + node.attr[i].id + '=' + node.attr[i].eq;
            }
        }
        dotString += ']';
    }
    dotString += '\n\t';

    if (node.children.length !== 0) {

        node.children.forEach(element => {
            dotString += '"' + node.title + '" -> "' + element.title + '"\n\t';
            dotString = DFS(element, dotString);
        });
    }
    return dotString;
}

//treeData to DOT
function parseTreeData(treeData) {
    let dotString = 'digraph G {\n\t';
    for (let i = 0; i < treeData.length; i++) {
        dotString = DFS(treeData[i], dotString);
    }
    dotString += '}';
    return dotString;
}

export { parseDOT, parseTreeData };