import React from "react";
import Canvas from "./canvas";
import Editor from "./AceEditor";
import Sidebar from "./sidebar";
import SvgCanvas from "./Svgcanvas";
import './index.css';


class MainArea extends React.Component {

    constructor(props) {
        super(props);
        this.mainAreaRef = React.createRef();
        this.AceRef = React.createRef();
        this.EditorRef = React.createRef();
        this.SvgRef = React.createRef();
        this.state = {
            AceElement: null,
            canvasItem: [],
            massagefromSidebar: '',
            dataFromEditor: null,
        }



    }


    componentDidMount() {

        const getDiv = this.AceRef.current;
        const divElement = getDiv.getBoundingClientRect();

        this.setState({ AceElement: divElement })
        this.state.AceElement = divElement;




    }

    getCanvasItem = (item) => {//将SvgCanvas的item传入Editor
        this.setState({ canvasItem: item });
        this.EditorRef.current.trunToText(item);
    }

    getDataFromSidebar = () => {

    }
    handleDragStart = (data) => {//取得sidebar拖拽的方块的值
        // 正确做法：使用函数形式的setState
        // 正确做法：使用函数形式的setState
        // 正确做法：在setState的回调函数中处理
        this.setState({ massagefromSidebar: data });

    }
    getEditorItem = (value) => {
        this.setState({ dataFromEditor: value })
        this.SvgRef.current.dataFromEditor(value);
        console.log(value)

    }










    render() {
        const AceElement = this.state;
        const { massagefromSidebar } = this.state;
        const { canvasItem } = this.state;
        const { dataFromEditor } = this.state;



        return (
            <div className="mainArea">

                <nav>
                    <label className="logo">myUml <label className="version">v20230717</label>
                    </label>
                </nav>
                <div ref={this.AceRef} className="aceEditor">
                    <Editor
                        ref={this.EditorRef}
                        item={canvasItem}
                        sendDataToParent={this.getEditorItem}

                    />
                </div>
                <div className="canvasPanel" ref={this.mainAreaRef}>
                    <SvgCanvas
                        ref={this.SvgRef}
                        AceElement={AceElement}
                        onCallback={this.getCanvasItem}
                        massageSidebar={massagefromSidebar}
                        dataFromEditor={dataFromEditor}

                    />

                </div>
                <div className="sideBar">
                    <Sidebar
                        sendDataToParent={this.handleDragStart} />

                </div>






            </div>
        )
    }


}


export default MainArea;