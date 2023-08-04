import React from "react";
import Canvas from "./canvas";
import Editor from "./AceEditor";
import Sidebar from "./sidebar";
import SvgCanvas from "./Svgcanvas";
import { plantuml } from "./plantuml";
import './index.css';


class Text extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }



    }


    componentDidMount() {
        this.text();




    }
    text = () => {
        const test = plantuml();
    }











    render() {


        return (
            <div className="mainArea">







            </div>
        )
    }


}


export default Text;