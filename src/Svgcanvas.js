import React, { Component } from 'react';
import { Stage, Layer, Rect, Line, Text, Arrow as KonvaArrow } from 'react-konva';
import "./index.css";
import { square, line, line2, presetShape1 } from './shape';
import Sidebar from './sidebar';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draggedElement: null,
            sidebartext: "",
            shape: [],
            line: [],
            isMousePressed: false,
            generatedCoordinates: [],

        }
        this.stageRef = React.createRef();

    }
    state = {
        x: 50,
        y: 50,
        scale: 1, // 初始缩放比例
        parentHeight: 0,
        parentWidth: 0,
    };
    componentDidMount() {


    }
    handleDragEnd = (e) => {
        this.setState({
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    handleWheel = (e) => {
        e.evt.preventDefault(); // 阻止默认滚轮行为

        const scaleBy = 1.1; // 缩放增量
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        this.setState({
            scale: newScale,
        });

        // 应用缩放
        stage.scale({ x: newScale, y: newScale });
        stage.batchDraw();
    };

    renderGrid = () => {
        const grid = [];
        const gridSize = 25;
        const width = this.state.parentWidth;
        const height = this.state.parentHeight;

        // 绘制水平线条
        for (let y = 0; y < width; y += gridSize) {
            grid.push(
                <Line
                    points={[0, y, width, y]}
                    stroke="black"
                    key={`grid-line-y-${y}`} // 使用唯一的key
                />
            );
        }

        // 绘制垂直线条
        for (let x = 0; x < width; x += gridSize) {
            grid.push(
                <Line
                    points={[x, 0, x, width]}
                    stroke="black"
                    key={`grid-line-x-${x}`} // 使用唯一的key
                />
            );
        }

        return grid;
    };


    getDivElement = (height, width) => {
        this.setState({ parentHeight: height, parentWidth: width })

    }
    ////這裏取得sidebar拖拽的方塊種類
    getSidebarValue = (value, mousestate) => {
        this.setState({ sidebartext: value });
        this.setState({ isMousePressed: mousestate });
    }

    handleDragStart = (event, element) => {
        this.setState({ draggedElement: element });

    };

    handleDragEnd = (event) => {
        this.setState({ draggedElement: null });
        console.log(event)



    };


    //鼠標拖動sidebar到畫布產生圖形
    handleMouseMove = () => {
        const text1 = "text1";
        const text2 = "text2";
        const arrow = "->";
        const cursorPosition = this.stageRef.current.getPointerPosition();

        if (this.state.isMousePressed) {
            const x = cursorPosition.x;
            const y = cursorPosition.y;
            const drawshape = presetShape1(x, y, text1, text2);
            console.log(drawshape)
            console.log(this.state.shape)
            this.setState((prevState) => ({
                shape: [...prevState.shape, drawshape],
            }));
            this.setState({ isMousePressed: false })
        }
    };
    //這是拖動圖型 字串也跟著動的function
    handleElementDragMove = (elementId, e) => {
        const newx = e.target.x();
        const newy = e.target.y();

        const { shape } = this.state;

        for (var i = 0; i < shape.length; i++) {
            const item = shape[i];
            for (var j = 0; j < shape[i].length; j++) {
                if (item[j].type === 'rect') {
                    if (item[j].id === elementId) {

                        item[j].props.x = newx;
                        item[j].props.y = newy;
                    }
                }
                if (item.type === 'text') {
                    if (item.shapeID === elementId) {
                        item.centerX = newx;
                        item.centerY = newy;
                    }
                }

            }
        }

        this.setState({ shape: shape })


    };
    generateUniqueCoordinate = (xRange, yRange, generatedCoordinates) => {
        while (true) {
            const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
            const y = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
            const newCoordinate = [x, y];

            return newCoordinate
        }
    }




    //這是Editor畫圖的function
    EditorDrawShape = (value) => {
        const xRange = [0, this.state.parentWidth];
        const yRange = [0, this.state.parentHeight];
        const generatedCoordinates = this.state;

        const coordinate = this.generateUniqueCoordinate(xRange, yRange, generatedCoordinates);
        this.setState(prevState => ({
            generatedCoordinates: [...prevState.generatedCoordinates, coordinate],
        }));
        for (var i = 0; i < value.length; i++) {
            const drawshape = presetShape1(coordinate[0], coordinate[1], value[i].receiver, value[i].sender);

            this.setState((prevState) => ({
                shape: [...prevState.shape, drawshape],
            }));
        }

        // presetShape1(x, y, text1, text2)
    }

    render() {
        const { shape } = this.state;

        return (
            <div>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={this.handleDragEnd}
                >
                    <Stage
                        width={this.state.parentWidth}
                        height={this.state.parentHeight}
                        scaleX={this.state.scale}
                        scaleY={this.state.scale}
                        onWheel={this.handleWheel}
                        onMouseEnter={this.handleMouseMove}
                        ref={this.stageRef}
                    >
                        <Layer>
                            {/* 添加黑色网格 */}
                            {this.renderGrid()}

                            {/* 添加可拖拽的矩形和线条 */}
                            {shape.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    {group.map((shapeItem, shapeIndex) => {
                                        if (shapeItem.type === 'rect') {
                                            return (
                                                <Rect
                                                    key={shapeIndex}
                                                    {...shapeItem.props}
                                                    draggable
                                                    onDragMove={(e) => this.handleElementDragMove(shapeItem.shapeID, e)}
                                                />
                                            );
                                        } else if (shapeItem.type === 'line') {
                                            return (
                                                <Line
                                                    key={shapeIndex}
                                                    points={shapeItem.points}
                                                    stroke={shapeItem.stroke}
                                                    strokeWidth={shapeItem.strokeWidth}
                                                    draggable={shapeItem.draggable}
                                                    tension={0.5}
                                                    lineCap="round"
                                                />
                                            );
                                        } else if (shapeItem.type === 'text') {

                                            return (
                                                <Text
                                                    text={shapeItem.texts}
                                                    fontSize={20}
                                                    fontFamily="Arial"
                                                    fill="black"
                                                    width={70}
                                                    height={50}
                                                    x={shapeItem.centerX}
                                                    y={shapeItem.centerY}
                                                    align="center"
                                                    verticalAlign="middle"
                                                    draggable
                                                    onDragMove={(e) => this.handleElementDragMove(shapeItem.shapeID, e)}

                                                />)
                                        } else if (shapeItem.type === 'Dashline') {
                                            return (
                                                <KonvaArrow
                                                    points={shapeItem.points}
                                                    pointerLength={5}
                                                    pointerWidth={5}
                                                    fill="black"
                                                    stroke="black"
                                                    strokeWidth={shapeItem.strokeWidth}
                                                    draggable={shapeItem.draggable}
                                                    dash={[5, 5]} // 設定虛線的樣式，這裡的數字表示虛線和空白之間的長度
                                                />)
                                        }

                                        // 添加其他类型的图形处理逻辑
                                        return null;
                                    })}
                                </React.Fragment>
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }

}

export default Canvas;
