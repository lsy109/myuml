
function deleteNode(children, nodeId) {//刪除節點
  for (let i = 0; i < children.length; i++) {
    if (children[i].type === 'node_stmt') {
      if (children[i].node_id.id === nodeId) {
        children.splice(i, 1);
        deleteEdge(children, nodeId, null);
        return children;
      }
    }
  }
  deleteEdge(children, nodeId, null);
}

function deleteEdge(children, nodeId1, nodeId2) {//刪除含某個節點的邊
  if (nodeId2 === null) {//指定包含特定一個節點的所有邊
    checkEdge:
    for (let i = 0; i < children.length; i++) {
      let target;
      if (children[i].type === 'edge_stmt') {
        target = children[i].edge_list;
        for (let j = 0; j < target.length; j++) {
          if (target[j].id === nodeId1) {
            //console.log(children[i]);
            //target.splice(j, 1);
            if (target.length > 2) {//刪除點後相關的邊全都斷開
              if (j === 0 || j === target.length - 1) {
                target.splice(j, 1);
              }
              else {//拆成兩組edge_list
                let removeList = target.splice(j);//刪除包含j以後的點
                if (removeList.length === 2) {
                  //check exist node
                  if (!checkNode(children, removeList[1].id)) {
                    let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': removeList[1].id }, 'attr_list': [] };
                    children.push(newNode);
                  }
                }
                else {
                  removeList.splice(0, 1);
                  let remainingEdge = { 'type': 'edge_stmt', 'edge_list': removeList, 'attr_list': children[i].attr_list };
                  children.push(remainingEdge);
                }

                if (target.length === 1) {
                  //check exist node
                  if (!checkNode(children, target[0].id)) {//新增節點
                    let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': target[0].id }, 'attr_list': [] };
                    children.push(newNode);
                  }
                  else {//移除edge_list裡只有一個節點的邊
                    for (let k = 0; k < children.length; k++) {
                      if (children[k].type === 'edge_stmt') {
                        if (children[k].edge_list.length === 1) {
                          children.splice(k, 1);
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              //console.log(target[0]);
              if(target[0].id === nodeId1){//target[0]是要刪除的點
                if (!checkNode(children, target[1].id)) {//新增節點
                  let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': target[1].id }, 'attr_list': [] };
                  children.push(newNode);
                }
              }
              else{
                if (!checkNode(children, target[1].id)) {//新增節點
                  let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': target[0].id }, 'attr_list': [] };
                  children.push(newNode);
                }
              }
              children.splice(i, 1);//因為刪除後自動i-1故回到for又加一就會跳過一條邊
              i = i - 1;
            }
            continue checkEdge;
          }
        }
      }
    }
  }
  else {//指定邊
    for (let i = 0; i < children.length; i++) {
      let target;
      if (children[i].type === 'edge_stmt') {
        target = children[i].edge_list;
        for (let j = 0; j < target.length - 1; j++) {
          if (target[j].id === nodeId1 && target[j + 1].id === nodeId2) {

            for (let k = j; k < j + 2; k++) {//確認是否要新增節點
              if (!checkNode(children, target[k].id)) {
                let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': target[k].id }, 'attr_list': [] };
                children.push(newNode);
              }
            }

            if (target.length > 2) {//edge_list裡超過兩個點
              if (j === 0) {
                target.splice(j, 1);
              }
              else if (j + 1 === target.length - 1) {
                target.splice(j + 1, 1);
              }
              else {//拆成兩組edge_list
                let removeList = target.splice(j + 1);//刪除包含j+1以後的點
                let remainingEdge = { 'type': 'edge_stmt', 'edge_list': removeList, 'attr_list': children[i].attr_list };
                children.push(remainingEdge);
              }
            }

            else {//edge_list裡只有兩個點
              children.splice(i, 1);
            }
            return children;
          }
        }
      }
    }
  }
}

function checkNode(children, nodeId) {//檢查是否有存在此id的節點
  for (let i = 0; i < children.length; i++) {
    if (children[i].type === 'node_stmt') {
      if (children[i].node_id.id === nodeId) {
        return true;
      }
    }
  }
  return false;
}

function convertJsonToDot(children) {//把JSON轉換成Dot語法
  let dotString = "digraph G {\n\t";
  for (let i = 0; i < children.length; i++) {
    if(children[i].type === 'attr_stmt'){
      dotString += children[i].target;
    }
    else if (children[i].type === 'node_stmt') {
      dotString += '"' + children[i].node_id.id + '"';
    }
    else if (children[i].type === 'edge_stmt') {
      dotString += '"' + children[i].edge_list[0].id + '"';
      for (let j = 1; j < children[i].edge_list.length; j++) {
        dotString += ' -> "' + children[i].edge_list[j].id + '"';
      }
    }
    let attrList = children[i].attr_list;
    if (attrList.length >= 1) {
      if(attrList[0].id === "label" || attrList[0].id === "xlabel"){
        dotString += ' [' + attrList[0].id + '="' + attrList[0].eq + '"';
      }
      else{
        dotString += ' [' + attrList[0].id + '=' + attrList[0].eq;
      }
      for (let attr = 1; attr < attrList.length; attr++) {
        if(attrList[attr].id === "label" || attrList[attr].id === "xlabel"){
          dotString += ' ,' + attrList[attr].id + '="' + attrList[attr].eq + '"';
        }
        else{
          dotString += ' ,' + attrList[attr].id + '=' + attrList[attr].eq;
        }
      }
      dotString += ']';
    }
    dotString += '\n\t';
  }
  return dotString + '}';
}

export { deleteEdge, deleteNode, convertJsonToDot };