import React from "react";
import axios from "axios";
import Editor from "./Editor";
import Graph from "./Graph";
import TreeArea from './Tree';
import parse from "dotparser";
import { convertJsonToDot } from "./DeleteNode";
import { parseTreeData } from './Parser';
import { encode } from "plantuml-encoder";

import UseCaseDiagram from "./UseCaseDiagram";
import ClassTree from "./Class_Tree";
// import * as data from './dot.json';
// const getBaseURL = "https://localhost/mykmap/getDot.php";
const getBaseURL = "https://cip.nknu.edu.tw/myKMap/react/build/getDot.php";
// const editBaseURL = "https://localhost/mykmap/editDot.php";
const editBaseURL = "https://cip.nknu.edu.tw/myKMap/react/build/editDot.php";

class MainArea extends React.Component {
    constructor(props) {
        super(props);
        let dotSrc = ``;
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
            dataFromTree: null,
            selectedComponent: ''
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
    zhuheyuyan = (text) => {
        this.ediRef.current.ifelseFunction(text, null, null)
    }
    zhuheyuyan2 = (text1, text2) => {
        this.ediRef.current.ifelseFunction2(text1, text2)
    }
    handleDataFromTree = (data) => {
        this.setState({ dataFromTree: data });
    }
    changeComponent = (componentName) => {
        this.setState({ selectedComponent: componentName });
    }

    //處理ifelse框的function
    getAltElse = (text1, text2, num) => {

        this.ediRef.current.updateAndPrintContent(text1, text2, num)
    }


    /////////
    //select改變畫面
    selectChangeDiv = (value) => {
        if (value === "SequenceDiagram") {
            let str = "Bob -> Alice : hello"
            this.setState({
                dotSrc: `@startuml
${str}
@enduml`}
            )
            this.setState({ ImgUrl: `//www.plantuml.com/plantuml/svg/${encode(str)}` })
        }
        else if (value === "UseCaseDiagram") {
            let str = `class class
class class01
class class02
`
            this.setState({
                dotSrc: `@startuml
${str}
@enduml`}
            )
            this.setState({ ImgUrl: `//www.plantuml.com/plantuml/svg/${encode(str)}` })

        }
        this.setState({ selectedComponent: value })

    }
    render() {
        let newNode = this.state.newNode;
        const { selectedComponent } = this.state;

        let componentToRender;
        let componentToRender1;

        switch (selectedComponent) {
            case 'SequenceDiagram':
                componentToRender = <Graph propA="valueA"
                    ref={this.graphRef}
                    ImgUrl={this.state.ImgUrl}
                    parentFunction={this.graphGettext.bind(this)}
                    shapeText={this.getShapeText.bind(this)}
                    graphzhuehyuyan={this.zhuheyuyan.bind(this)}
                    graphzhuehyuyan2={this.zhuheyuyan2.bind(this)}
                    data={this.state.dataFromTree}
                    EditorText={this.state.dotSrc}
                    IfElsefunction={this.getAltElse.bind(this)}
                />;

                componentToRender1 = <TreeArea
                    onDataUpdate={this.handleDataFromTree}
                />

                break;
            case 'UseCaseDiagram':
                componentToRender = < UseCaseDiagram
                    ref={this.graphRef}
                    ImgUrl={this.state.ImgUrl}
                    parentFunction={this.graphGettext.bind(this)}
                    shapeText={this.getShapeText.bind(this)}

                    data={this.state.dataFromTree} />
                componentToRender1 = <ClassTree
                    onDataUpdate={this.handleDataFromTree} />
                break;

            default:
                componentToRender = <div>Unknown Component</div>;
                break;
        }
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
                    </p>

                    {/* <Graph
                        dotSrc={this.state.dotSrc}
                        onStatusChange={this.props.onStatusChange}
                        onChangeNode={this.handleChangeNode}
                        onTextChange={this.handleTextChange}
                        onError={this.handleError}
                    /> */}
                    {/* <Graph
                        ref={this.graphRef}
                        ImgUrl={this.state.ImgUrl}
                        parentFunction={this.graphGettext.bind(this)}
                        shapeText={this.getShapeText.bind(this)}
                        data={this.state.dataFromTree}
                      
            
                    /> */}
                    {componentToRender}
                </div>

                {/* resizor2 */}
                <div id="resizor2" />

                {/* Tree */}
                {componentToRender1}
                {/* <TreeArea
                    onDataUpdate={this.handleDataFromTree}
               
                /> */}
            </div>
        );
    }
}

export default MainArea;