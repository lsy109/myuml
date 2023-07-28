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
        this.state = {
            AceElement: null,
            canvasItem: [],
        }



    }


    componentDidMount() {

        const getDiv = this.AceRef.current;
        const divElement = getDiv.getBoundingClientRect();

        this.setState({ AceElement: divElement })
        this.state.AceElement = divElement;



    }

    getCanvasItem = (item) => {
        this.setState({ canvasItem: item });
        console.log(item)
    }





    render() {
        const AceElement = this.state;

        return (
            <div className="mainArea">

                <nav>
                    <label className="logo">myUml <label className="version">v20230717</label>
                    </label>
                </nav>
                <div ref={this.AceRef} className="aceEditor">
                    <Editor />
                </div>
                <div className="canvasPanel" ref={this.mainAreaRef}>
                    <SvgCanvas
                        AceElement={AceElement}
                        onCallback={this.getCanvasItem} />

                </div>
                <div className="sideBar">
                    <Sidebar />

                </div>






            </div>
        )
    }


}


export default MainArea;