import React, { Component } from 'react';
import { shape1 } from "./shapes";
import parser from './parser'; // 导入 parser 文件
import MainArea from './mainArea';
import Sidebar from './sidebar';
class SvgCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      canvas: null,
      context: null,
      canvasItem: [],
      selectItem: [],
      rectX: 50,
      rectY: 50,
      moveImg: [],
      canvasSize: null,
      startX: 0,
      startY: 0,
      imgselect: false,
      select: false,
      AceElement: null,
      DomID: 0,
      text: "text",


    };
    this.canvasRef = React.createRef();
    this.testRef = React.createRef();
  }

  handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.setState((prevState) => ({
      scale: prevState.scale + delta,
    }));
  };

  componentDidMount() {
    // const AceElement = this.props;

    // this.state.AceElement = AceElement.AceElement.AceElement;

    // this.state.dongzuo = this.props.value;//获取sidebar拖拽图形的类型
    this.drawCanvas();

    this.state.canvas.addEventListener("dragover", this.handleDragOver);
    this.state.canvas.addEventListener("drop", this.handleDrop);
    this.state.canvas.addEventListener("mousedown", this.onMouseDown);
    this.state.canvas.addEventListener("mouseup", this.mouseUp);


  }

  mouseUp = () => {
    const canvas = this.state.canvas;
    this.state.canvas.removeEventListener("mousemove", this.moveImg);
    this.state.canvas.removeEventListener("mousemove", this.mouseSelect);
    this.state.canvas.removeEventListener('mousemove', this.mouseSelect);
    this.state.context.clearRect(0, 0, canvas.width, canvas.height);
    this.setState({ moveImg: [] });
    this.reDrawShape();
    this.setState({ imgselect: false, select: false });


  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas() {//初次加載canvas畫面
    const { scale } = this.state;
    this.state.canvas = this.canvasRef.current;
    const canvas = this.state.canvas;
    const ctx = canvas.getContext('2d');
    this.state.context = canvas.getContext("2d");


    this.state.canvasSize = 800 * scale;

    // 设置 Canvas 的尺寸
    canvas.width = this.state.canvasSize;
    canvas.height = this.state.canvasSize;



    // 绘制文字


    this.reDrawShape();
  }

  reDrawShape = () => {//重畫圖形（拖拽動畫）

    const item = this.state.canvasItem;
    const context = this.state.context;
    const lineWidth = 2;

    for (var i = 0; i < item.length; i++) {
      const shape = item[i]
      shape.forEach((e) => {
        if (e.type == "shape") {
          context.beginPath();
          context.fillStyle = e.color;
          context.fillRect(e.x, e.y, e.width, e.height);
          context.font = e.fontsize;
          context.fillStyle = e.textcolor;
          context.fillText(e.text, e.textX, e.textY);
          context.stroke();
          context.lineWidth = lineWidth;
        } else if (e.type == "line") {
          context.beginPath();
          context.moveTo(e.movex, e.movey);
          context.lineTo(e.linex, e.liney);
          context.stroke();
          context.lineWidth = lineWidth;
        }


      })



    }
  }
  handleDragOver = (event) => {

    event.preventDefault();
  };
  handleDrop = (event) => {
    event.preventDefault();


    const canvas = this.canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.offsetX - rect.left + 350;
    const y = event.offsetY - rect.top;


    this.drawSquare(x, y);
  };
  drawSquare = (x, y) => {

    const context = this.state.context;


    // shape1(x, y, context);


    const shape = shape1(x, y, context, this.props.massageSidebar, this.state.text);

    this.state.canvasItem.push(shape)
    this.props.onCallback(this.state.canvasItem)

    parser.toEditor(this.state.canvasItem);



  };
  returnToMain = () => {

  }

  onMouseDown = (e) => {

    const canvas = this.canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // console.log(rect)

    const mouseX = e.clientX - rect.left - 39;
    const mouseY = e.clientY - rect.top;

    const item = this.state.canvasItem;
    const index = 0;

    if (item.length != 0) {

      for (var i = 0; i < item.length; i++) {
        const shape = item[i];
        shape.forEach((event) => {
          if (mouseX >= event.x && mouseX <= event.x + event.width && mouseY >= event.y && mouseY <= event.y + event.height) {
            // const index = shape.findIndex(item => item.x === event.x && item.y === event.y);
            // console.log(event);

            this.state.moveImg.push(event);
            this.setState({ imgselect: true });

            this.state.canvas.addEventListener("mousemove", this.moveImg);

          } else {

            this.state.startX = e.clientX - rect.left;
            this.state.startY = e.clientY - rect.top;
            this.setState({ select: true });
            canvas.addEventListener("mousemove", this.mouseSelect);

          }





        })



      }
    } else {
      const canvas = this.canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      this.setState({ select: true });
      console.log(rect.left)
      this.state.startX = e.clientX - rect.left;
      this.state.startY = e.clientY - rect.top;
      canvas.addEventListener("mousemove", this.mouseSelect);



    }


  }

  moveImg = (e) => {
    if (this.state.imgselect) {
      const item = this.state.moveImg;

      const ctx = this.state.context;
      const rect = this.canvasRef.current.getBoundingClientRect();
      const movex = e.clientX - rect.left - 39;
      const movey = e.clientY - rect.top;


      const canvasitem = this.state.canvasItem;
      for (var i = 0; i < item.length; i++) {
        item[i].x = movex;
        item[i].y = movey;
        item[i].textX = movex;
        item[i].textY = movey + 25;
        ctx.clearRect(0, 0, this.state.canvasSize, this.state.canvasSize);
        this.reDrawShape();




      }



    }
  }

  //鼠標點擊到圖形時 觸發圖形拖動
  selectImg = () => {

  }
  //鼠標點擊到空白處 觸發選框
  selectNull = () => {

  }


  mouseSelect = (e) => {
    if (this.state.select) {

      const canvas = this.canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      this.state.width = e.clientX - rect.left - this.state.startX;
      this.state.height = e.clientY - rect.top - this.state.startY;
      this.state.context.clearRect(0, 0, canvas.width, canvas.height);
      this.reDrawShape();
      this.state.context.strokeRect(this.state.startX, this.state.startY, this.state.width, this.state.height)

    }
  }


  //处理editor返回的dom节点
  dataFromEditor = (value) => {
    const item = value;
    for (var i = 0; i < item.length; i++) {
      const shape = shape1(200, 200, this.state.context, "graphics1", this.state.text);

      this.state.canvasItem.push(shape)
    }
    console.log(value)
  }


  render() {


    const { scale } = this.state;
    const svgSize = 700 * scale;

    return (

      <div onWheel={this.handleWheel}>
        <svg

          xmlns="http://www.w3.org/2000/svg"

          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          <pattern
            id="gridPattern"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
          <rect
            width="100%"
            height="100%"
            fill="url(#gridPattern)"
            pointerEvents="none"
          />
          <foreignObject width="100%" height="100%">
            <canvas ref={this.canvasRef} />
          </foreignObject>
        </svg>
      </div>

    );
  }
}

export default SvgCanvas;
