import React from "react";
import SvgCanvas from "./Svgcanvas";
import { render } from '@testing-library/react';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const div1 = document.querySelector(".container");

        // 添加事件监听器
        div1.addEventListener("dragstart", this.handleDragStart);
    }

    componentWillUnmount() {
        const div1 = document.querySelector(".color1");

        // 移除事件监听器
        div1.removeEventListener("dragstart", this.handleDragStart);
    }

    handleDragStart = (event) => {
        const draggedDiv = event.target;
        console.log("拖动的是：", draggedDiv.textContent);
        this.props.sendDataToParent(draggedDiv.textContent);
        // send(draggedDiv.textContent)




        // 处理拖拽事件...
    }

    render() {
        return (

            <div className="container">
                <div draggable="true" className="color1">graphics1</div>
                <div draggable="true" className="color2">square</div>

            </div>

        )
    }
}

export default Sidebar;

function send(Data) {
    render(
        <SvgCanvas value={Data} />
    )
    console.log(Data)

}
