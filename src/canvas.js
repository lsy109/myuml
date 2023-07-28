import React from "react";
import { shape1 } from "./shapes";
import parser from './parser'; // 导入 parser 文件


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();



        this.state = {
            canvas: null,
            canvasItem: [],
            canvasW: 0,
            canvasH: 0,
            context: null,
            startX: null,
            startY: null,
            width: null,
            height: null,
            // width: 200 * devicePixelRatio,
            // height: 200 * devicePixelRati0,
        }
    }

    componentDidMount() {
        this.state.canvas = this.canvasRef.current;
        const canvas = this.state.canvas;
        this.state.context = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.setState({ canvasW: canvas.width });
        this.setState({ canvasH: canvas.height });

        // 添加事件监听器
        canvas.addEventListener("dragover", this.handleDragOver);
        canvas.addEventListener("drop", this.handleDrop);
        canvas.addEventListener("mousedown", this.mouseDown);
        canvas.addEventListener('mouseup', this.removeMouse);
    }
    removeMouse = () => {
        const canvas = this.canvasRef.current;
        canvas.removeEventListener('mousemove', this.dragSelect);

        this.state.context.clearRect(0, 0, canvas.width, canvas.height);



    }

    mouseDown = (e) => {
        console.log(e)
        const canvas = this.canvasRef.current;


        this.state.startX = e.clientX - canvas.offsetLeft;
        this.state.startY = e.clientY - canvas.offsetTop;
        console.log(this.state.startX)
        console.log(this.state.startX - 380)
        console.log(this.state.startY)
        console.log(this.state.startY - 50)


        canvas.addEventListener('mousemove', this.dragSelect);

    }
    dragSelect = (e) => {
        const canvas = this.canvasRef.current;
        this.state.width = e.clientX - canvas.offsetLeft - this.state.startX;
        this.state.height = e.clientY - canvas.offsetTop - this.state.startY;
        this.state.context.clearRect(0, 0, canvas.width, canvas.height);
        this.state.context.strokeRect(this.state.startX, this.state.startY, this.state.width, this.state.height)
    }

    componentWillUnmount() {
        const canvas = this.canvasRef.current;

        // 移除事件监听器
        canvas.removeEventListener("dragover", this.handleDragOver);
        canvas.removeEventListener("drop", this.handleDrop);
    }

    handleDragOver = (event) => {
        event.preventDefault();
    };

    handleDrop = (event) => {
        event.preventDefault();

        console.log(event.offsetX)
        console.log(event.offsetY)

        const canvas = this.canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.offsetX - rect.left + 350;
        const y = event.offsetY - rect.top;

        this.drawSquare(x, y);
    };

    drawtest = () => {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext("2d");


    }

    drogImg = () => {

    }

    drawSquare = (x, y) => {

        const context = this.state.context;


        // shape1(x, y, context);

        const shape = shape1(x, y, context);

        this.state.canvasItem.push(shape)
        console.log(this.state.canvasItem)

        parser.toEditor(this.state.canvasItem);


    };

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} />
            </div>
        );
    }
}

export default Canvas;
