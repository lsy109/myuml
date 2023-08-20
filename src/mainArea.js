import React, { Component } from 'react';
import './index.css';
import Editor from './aceEditor';
import SvgCanvas from './svgCanvas';
import Sidebar from './sidebar';
class App extends Component {
    constructor(props) {
        super(props);
        this.elementRef = React.createRef();
        this.konRef = React.createRef();
        this.EditorRef = React.createRef();
        this.sideBarRef = React.createRef();
        this.state = {
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,

            },
            AceElement: null,
            canvasItem: [],
            massagefromSidebar: '',
            dataFromEditor: null,
            Domparser: [{ text1: "Bob", lineTo: "->", text2: "Alice", lineText: "hello,", Domx: 250, Domy: 250, line: { movex: 250, movey: 250, linex: 100, liney: 25, }, width: 250, height: 250, fontsize: "24px Arial", textcolor: "black", textx: 250, texty: 250 },
            ],

        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        if (this.elementRef.current) {
            const elementWidth = this.elementRef.current.offsetWidth;
            const elementHeight = this.elementRef.current.offsetHeight;

            console.log('Element Width:', elementWidth);
            console.log('Element Height:', elementHeight);
            this.konRef.current.getDivElement(elementHeight, elementWidth);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({
            windowDimensions: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        });
    };
    handleDragStart = (data, isMousePressed) => {//取得sidebar拖拽的方块的值
        // 正确做法：使用函数形式的setState
        // 正确做法：使用函数形式的setState
        // 正确做法：在setState的回调函数中处理

        this.konRef.current.getSidebarValue(data, isMousePressed);

    }


    getEditorItem = (value) => {
        // this.setState({ dataFromEditor: value })
        // this.SvgRef.current.dataFromEditor(value);
        // console.log(value)
        console.log(value)
        this.konRef.current.EditorDrawShape(value);

    }

    render() {
        const AceElement = this.state;
        const { massagefromSidebar } = this.state;
        const { canvasItem } = this.state;
        const { dataFromEditor } = this.state;
        const { Domparser } = this.state;
        return (
            <div className="mainArea">
                <div className="bar">
                    Bar
                </div>
                <div className="contentContainer">
                    <div className="aceEditor">
                        <Editor
                            ref={this.EditorRef}
                            item={canvasItem}
                            sendDataToParent={this.getEditorItem}
                            startValue={Domparser} />

                    </div>
                    <div className='canvas'>
                        <div className="svgCanvas" ref={this.elementRef}>
                            <SvgCanvas
                                ref={this.konRef}

                            />


                        </div>
                        <div className="sidebar">
                            <Sidebar
                                sendDataToParent={this.handleDragStart}

                            />

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
