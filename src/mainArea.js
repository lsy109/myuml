import React from "react";
import axios from "axios";
import Editor from "./Editor";
import Graph from "./Graph";
import TreeArea from './Tree';
import parse from "dotparser";
import { convertJsonToDot } from "./DeleteNode";
import { parseTreeData } from './Parser';
import { encode } from "plantuml-encoder";
// import * as data from './dot.json';
// const getBaseURL = "https://localhost/mykmap/getDot.php";
const getBaseURL = "https://cip.nknu.edu.tw/myKMap/react/build/getDot.php";
// const editBaseURL = "https://localhost/mykmap/editDot.php";
const editBaseURL = "https://cip.nknu.edu.tw/myKMap/react/build/editDot.php";

class MainArea extends React.Component {
    constructor(props) {
        super(props);
        let dotSrc = `@startuml
Bob -> Alice : hellos
@enduml`;
        this.oldNode = "";
        this.treeRef = React.createRef();
        this.graphRef = React.createRef();
        this.ediRef = React.createRef();
        this.selectedSubject = "";
        this.isTreeChange = false;
        this.state = {
            dotSrc: dotSrc,
            newNode: '',
            error: null,
            showNameInput: false,
            showErrorMsg: false,
            ImgUrl: "//www.plantuml.com/plantuml/svg/ur800gVy90LTEmN7dCpaL0KhXOpKd9pyOYu0",
            dataFromTree: null
        };
    }

    handleTextChange = (text) => {//這裏改變字串
        // 呼叫dotToParser parser
        if (this.isTreeChange || text === this.state.dotSrc) {
            this.isTreeChange = false;
            return;
        } else {
            // this.treeRef.current.connentUnitTree(text)
        }

        console.log("text change");
        console.log(text)
        this.setState({
            dotSrc: text,
        });
        this.codeinput()

        // localStorage.setItem(this.selectedSubject, text)
        // axios.post(editBaseURL, {
        //     dot: text,
        //     selectedSubject: this.selectedSubject,
        // }).then((response) => {
        //     console.log(response);
        // }).catch(err => {
        //     console.log(err);
        // })
    }

    handleError = (error) => {
        if (error) {
            error.numLines = this.state.dotSrc.split('\n').length;
        }
        if (JSON.stringify(error) !== JSON.stringify(this.state.error)) {
            this.setState({
                error: error,
            });
        }
    }

    //選擇Subject Tree
    handleChangeDot = (selectedSubject) => {
        // let dot = data.default[selectedSubject];
        // this.handleTextChange(dot);
        this.selectedSubject = selectedSubject;

        // let text = localStorage.getItem(selectedSubject);
        // if(text !== null){
        //     this.handleTextChange(text);
        // } else {
        axios.post(getBaseURL, {
            selectedSubject: selectedSubject
        }).then((response) => {
            console.log(response);
            this.handleTextChange(response.data);
        }).catch(err => {
            console.log(err);
        })
        // }
    }

    //Tree改變時parse成dot
    handleChangeTree = (treeData) => {
        console.log("TreeData To Dot");
        this.isTreeChange = true;
        let tree = parseTreeData(treeData);
        this.setState({
            dotSrc: tree,
        });

        // localStorage.setItem(this.selectedSubject, tree)
        axios.post(editBaseURL, {
            dot: tree,
            selectedSubject: this.selectedSubject,
        }).then((response) => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        })
    }

    //編輯Graph
    handleChangeNode = (oldNode) => {

        console.log(oldNode)
        this.oldNode = oldNode;
        this.setState({
            newNode: oldNode,
            showNameInput: true,
        })
    }

    //編輯node
    handleEditNode() {
        let oldNode = this.oldNode;
        let newNode = this.state.newNode;

        let ast = parse(this.state.dotSrc);
        let children = ast[0].children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].type === 'node_stmt') {
                if (children[i].node_id.id === oldNode) {
                    children[i].node_id.id = newNode;
                }
            }
            if (children[i].type === 'edge_stmt') {
                for (let j = 0; j < children[i].edge_list.length; j++) {
                    if (children[i].edge_list[j].id === oldNode) {
                        children[i].edge_list[j].id = newNode;
                    }
                }
            }
        }
        let newSrc = convertJsonToDot(children);
        this.props.onStatusChange(`modify node ${oldNode} to ${newNode}`);
        this.handleTextChange(newSrc);
    }

    //新增node
    handleInsertNode() {
        let nodeName = this.state.newNode;

        let ast = parse(this.state.dotSrc);
        let children = ast[0].children;
        let newNode = { 'type': 'node_stmt', 'node_id': { 'type': 'node_id', 'id': nodeName }, 'attr_list': [] };
        children.push(newNode);
        let newSrc = convertJsonToDot(children);
        this.props.onStatusChange(`add node ${nodeName}`);
        this.handleTextChange(newSrc);
    }

    //node確認輸入
    handleEnterClick(event) {
        event.preventDefault();
        event.stopPropagation();
        //如果輸入為空
        if (this.state.newNode === "") {
            this.setState({
                showErrorMsg: true,
            })
            return;
        }

        if (this.oldNode !== "") {
            this.handleEditNode();
        } else {
            this.handleInsertNode();
        }

        this.setState({
            showNameInput: false,
            showErrorMsg: false,
        });
    }
    codeinput = () => {
        const cod = this.state.dotSrc
        let x = cod.replace("@startuml", "")
        let y = x.replace("@enduml", "")

        let ecode = encode(y)
        console.log(ecode)
        this.setState({ ImgUrl: "//www.plantuml.com/plantuml/svg/" + ecode })

        this.graphRef.current.inputImg("//www.plantuml.com/plantuml/svg/" + ecode)

    }
    //給graph回傳改變node的text的function
    graphGettext = (value1, value2, value3) => {
        this.ediRef.current.graphChangeText(value1, value2, value3);

    }
    getShapeText = (text) => {
        this.ediRef.current.insertStringAboveFirstSymbol(text)
        console.log(text)

    }
    handleDataFromTree = (data) => {
        this.setState({ dataFromTree: data });
    }

    render() {
        let newNode = this.state.newNode;

        return (
            <div className="main-area">
                {/* Source */}
                <div className="area" id="sourceArea">
                    <p className="title">Source:</p>
                    <Editor
                        ref={this.ediRef}
                        dotSrc={this.state.dotSrc}
                        onTextChange={this.handleTextChange}
                        error={this.state.error}

                    />
                </div>

                {/*  resizor1  */}
                <div id="resizor1" />

                {/* Edit Panel */}
                <div className="area" id="editPanelArea">
                    <p className="title">Edit Panel:
                        {/* 輸入node名稱區塊 */}
                        <span style={{ display: `${this.state.showNameInput ? 'inline' : 'none'}` }}>
                            <input
                                id="titleInput"
                                type="text"
                                placeholder="Enter the node name"
                                value={newNode}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        this.handleEnterClick(event);
                                    }
                                }}
                                onChange={(event) => {
                                    this.setState({
                                        newNode: event.target.value,
                                    });
                                }}
                            />
                            <button label='confirm' id="confirmBtn" className='btn'
                                onClick={this.handleEnterClick.bind(this)
                                }>Enter</button>
                            <button label='cancel' id="cancelBtn" className='btn'
                                onClick={(event) => {
                                    this.setState({
                                        showNameInput: false,
                                        showErrorMsg: false,
                                    })
                                }}>Cancel</button>

                            {/* 錯誤訊息 */}
                            <span
                                className='errorMsg'
                                style={{ display: `${this.state.showErrorMsg ? 'inline' : 'none'}` }}
                            >Input cannot be empty.</span>
                        </span></p>

                    {/* <Graph
                        dotSrc={this.state.dotSrc}
                        onStatusChange={this.props.onStatusChange}
                        onChangeNode={this.handleChangeNode}
                        onTextChange={this.handleTextChange}
                        onError={this.handleError}
                    /> */}
                    <Graph
                        ref={this.graphRef}
                        ImgUrl={this.state.ImgUrl}
                        parentFunction={this.graphGettext.bind(this)}
                        shapeText={this.getShapeText.bind(this)}
                        data={this.state.dataFromTree}
                    // dotSrc={this.state.dotSrc}



                    />
                </div>

                {/* resizor2 */}
                <div id="resizor2" />

                {/* Tree */}
                <TreeArea
                    onDataUpdate={this.handleDataFromTree}
                // ref={this.treeRef}
                // onStatusChange={this.props.onStatusChange}
                // onChangeDot={this.handleChangeDot}
                // onChangeTree={this.handleChangeTree}
                // dotSrc={this.state.dotSrc}
                />
            </div>
        );
    }
}

export default MainArea;