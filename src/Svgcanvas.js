import React, { Component } from 'react';
import { Stage, Layer, Rect, Line, Text, Arrow as KonvaArrow, Transformer, Group, Circle, Image } from 'react-konva';
import "./index.css";
import { square, line, line2, presetShape1, Actor, Databases, Boundary, Entity } from './shape';
import Sidebar from './sidebar';

class SvgCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draggedElement: null,
            sidebartext: "",
            shape: [],
            line: [],
            isMousePressed: false,
            generatedCoordinates: [],
            selectedShape: null,
            selectedGroups: [],
            images: null,

        }
        this.groupRefs = [];
        this.groupRef = React.createRef();
        this.stageRef = React.createRef();
        this.rectRef = React.createRef();
        this.textRef = React.createRef();
        this.transformerRef = React.createRef();
    }
    state = {
        x: 50,
        y: 50,
        scale: 1, // 初始缩放比例
        parentHeight: 0,
        parentWidth: 0,
    };
    componentDidMount() {
        const imageUrls = [
            'https://static.thenounproject.com/png/1021177-200.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShjHMI23e6JbrsnutMb2w2Zkcl2oCSY6xiq_ZFlsRr9INrLtdwn1RiworxWxDJqTO-MNw&usqp=CAU',

            // ... 加載其他圖片的網址
        ];

        this.loadImages(imageUrls)
            .then((images) => {
                console.log(images)
                this.setState({ images });
            })
            .catch(() => {
                console.error('Failed to load one or more images.');
            });

    }
    loadImages = (urls) => {
        const imagePromises = urls.map((url, index) => {
            return new Promise((resolve, reject) => {
                const image = new window.Image();
                image.onload = () => resolve({ index, image });
                image.onerror = () => reject();
                image.src = url;
            });
        });

        return Promise.all(imagePromises).then((images) => {
            const imagesMap = {};
            images.forEach((imageData) => {
                imagesMap[imageData.index] = imageData.image;
            });
            return imagesMap;
        });
    };
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


    };


    //鼠標拖動sidebar到畫布產生圖形
    handleMouseMove = () => {
        const text1 = "text1";
        const text2 = "text2";
        const arrow = ["->"];
        const cursorPosition = this.stageRef.current.getPointerPosition();
        console.log(this.state.sidebartext)

        if (this.state.isMousePressed) {
            const x = cursorPosition.x;
            const y = cursorPosition.y;
            let drawshape;
            if (this.state.sidebartext === "Actor") {
                drawshape = Actor(x, y, text1, text2, arrow);
            } else if (this.state.sidebartext === "square") {
                drawshape = presetShape1(x, y, text1, text2, arrow);
            } else if (this.state.sidebartext === "graphics1") {

            } else if (this.state.sidebartext === "Databases") {

                drawshape = Databases(x, y, this.state.images[0]);
            } else if (this.state.sidebartext === "Boundary") {

                drawshape = Boundary(x, y);
            }
            else if (this.state.sidebartext === "Entity") {

                drawshape = Entity(x, y);
            }


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
            const drawshape = presetShape1(coordinate[0], coordinate[1], value[i].receiver, value[i].sender, value[i].arrow);

            this.setState((prevState) => ({
                shape: [...prevState.shape, drawshape],
            }));
        }

        // presetShape1(x, y, text1, text2)
    }

    handleRectClick = (e) => {
        console.log(e.target)
        if (e.target instanceof window.Konva.Text) {

        }
        this.setState({ selectedShape: e.target });
    };

    text = (index, e) => {
        const { shape } = this.state;
        if (e.target instanceof window.Konva.Text) {
            for (var i = 0; i < shape.length; i++) {
                const item = shape[i];
                for (var j = 0; j < shape[i].length; j++) {
                    if (item[j].type === 'rect') {
                        if (item[j].id === index) {

                            console.log("ll")
                        }
                    }
                    if (item.type === 'text') {
                        if (item.shapeID === index) {
                            console.log("ll2")
                        }
                    }

                }
            }
        }

    }
    checkNode = () => {
        if (this.transformerRef.current && this.groupRef.current) {
            const groupNode = this.groupRef.current;
            if (this.transformerRef.current.nodes()[0] === groupNode) {
                // If the group is already selected, deselect it
                this.transformerRef.current.nodes([]);
            } else {
                // If the group is not selected, select it
                this.transformerRef.current.nodes([groupNode]);
            }
            this.transformerRef.current.getLayer().batchDraw();
            console.log("Group data:", groupNode);
        }
    };

    // handleElementClick = () => {
    //     if (this.transformerRef.current) {
    //         this.transformerRef.current.forceUpdate();
    //     }
    // };
    handleElementClick = (groupNode, e) => {

        const { selectedGroups } = this.state;

        const newSelectedGroups = []; // Create a new array to store the selected groups

        for (var i = 0; i < groupNode.length; i++) {
            if (groupNode[i] && groupNode[i].id) {
                const itemid = groupNode[i]._id;
                console.log(itemid)
                console.log(e.target.parent._id)
                if (itemid === e.target.parent._id) {

                    newSelectedGroups.push(groupNode[i]);
                }
            }
        }

        this.setState({ selectedGroups: newSelectedGroups }, () => {
            this.transformerRef.current.getLayer().batchDraw();
        });

    };




    render() {
        const { selectedShape } = this.state;
        const { shape } = this.state;
        const { selectedGroups } = this.state;

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
                                        console.log(group)
                                        if (shapeItem.type === 'rect') {

                                            return (
                                                <Group
                                                    ref={ref => this.groupRefs.push(ref)}
                                                    draggable
                                                    onClick={(e) => this.handleElementClick(this.groupRefs, e)}
                                                >
                                                    <Rect
                                                        key={shapeIndex}
                                                        {...shapeItem.props}
                                                    />
                                                    <Text
                                                        text={shapeItem.text.text}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={70}
                                                        height={50}
                                                        x={shapeItem.text.x}
                                                        y={shapeItem.text.y}
                                                        align="center"
                                                        verticalAlign="middle"



                                                    />
                                                </Group>

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

                                                    onClick={(e) => this.handleElementClick(this.groupRefs, e)}
                                                    lineCap="round"
                                                />
                                            );
                                        }
                                        else if (shapeItem.type === 'circle') {
                                            console.log(shapeItem.props.x)
                                            return (

                                                <Group
                                                    ref={ref => this.groupRefs.push(ref)}
                                                    draggable
                                                    onClick={(e) => this.handleElementClick(this.groupRefs, e)}
                                                >
                                                    <Circle
                                                        x={shapeItem.props.x}
                                                        y={shapeItem.props.y}
                                                        radius={30}
                                                        fill={shapeItem.props.fill}   // 白色底色
                                                        stroke={shapeItem.props.stroke}// 黑色邊框
                                                        strokeWidth={2}
                                                    />
                                                    <Line

                                                        points={shapeItem.LeftLeg.points}
                                                        stroke={shapeItem.LeftLeg.stroke}
                                                        strokeWidth={5}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    /><Line

                                                        points={shapeItem.Right.points}
                                                        stroke={5}
                                                        strokeWidth={shapeItem.RightstrokeWidth}

                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.body.points}
                                                        stroke={shapeItem.body.stroke}
                                                        strokeWidth={shapeItem.body.strokeWidth}

                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.hands.points}
                                                        stroke={shapeItem.hands.stroke}
                                                        strokeWidth={shapeItem.hands.strokeWidth}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.DashLine.points}
                                                        stroke={shapeItem.DashLine.stroke}
                                                        strokeWidth={shapeItem.DashLine.strokeWidth}
                                                        tension={0.5}
                                                        dash={shapeItem.DashLine.dash}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Text
                                                        text={"Actor"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={70}
                                                        height={50}
                                                        x={shapeItem.DashLine.points[0] - 38}
                                                        y={shapeItem.DashLine.points[1] - 38}
                                                        align="center"
                                                        verticalAlign="middle"



                                                    />



                                                    <Line
                                                        points={shapeItem.hands.points}
                                                        stroke={shapeItem.hands.stroke}
                                                        strokeWidth={shapeItem.hands.strokeWidth}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />


                                                    <Text
                                                        text={"Actor"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={70}
                                                        height={50}
                                                        x={shapeItem.DashLine.points[2] - 38}
                                                        y={shapeItem.DashLine.points[3] - 5}
                                                        align="center"
                                                        verticalAlign="middle"



                                                    />
                                                    <Circle
                                                        x={shapeItem.circle2.props.x}
                                                        y={shapeItem.circle2.props.y}
                                                        radius={30}
                                                        fill={shapeItem.circle2.props.fill}   // 白色底色
                                                        stroke={shapeItem.circle2.props.stroke}// 黑色邊框
                                                        strokeWidth={2}
                                                    />
                                                    <Line

                                                        points={shapeItem.circle2.LeftLeg.points}
                                                        stroke={shapeItem.circle2.LeftLeg.stroke}
                                                        strokeWidth={5}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    /><Line

                                                        points={shapeItem.circle2.Right.points}
                                                        stroke={5}
                                                        strokeWidth={shapeItem.circle2.RightstrokeWidth}

                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.circle2.body.points}
                                                        stroke={shapeItem.circle2.body.stroke}
                                                        strokeWidth={shapeItem.circle2.body.strokeWidth}

                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.circle2.hands.points}
                                                        stroke={shapeItem.circle2.hands.stroke}
                                                        strokeWidth={shapeItem.circle2.hands.strokeWidth}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Line

                                                        points={shapeItem.circle2.hands.points}
                                                        stroke={shapeItem.circle2.hands.stroke}
                                                        strokeWidth={shapeItem.circle2.hands.strokeWidth}
                                                        tension={0.5}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />


                                                </Group>
                                            );
                                        }
                                        else if (shapeItem.type === 'img') {
                                            console.log(shapeItem.Img.image)
                                            return (
                                                <Group
                                                    ref={ref => this.groupRefs.push(ref)}
                                                    draggable
                                                    onClick={(e) => this.handleElementClick(this.groupRefs, e)}
                                                >
                                                    <Rect
                                                        x={shapeItem.props.x}
                                                        y={shapeItem.props.y}
                                                        width={shapeItem.props.width}
                                                        height={shapeItem.props.height}
                                                        fill={shapeItem.props.fill}
                                                        stroke={shapeItem.props.stroke}
                                                        strokeWidth={shapeItem.props.strokeWidth}
                                                    />
                                                    <Image
                                                        x={shapeItem.Img.x}
                                                        y={shapeItem.Img.y}
                                                        width={shapeItem.Img.width}
                                                        height={shapeItem.Img.height}
                                                        image={shapeItem.Img.image}
                                                    />

                                                    <Text
                                                        text={"Databases"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={100}
                                                        height={50}
                                                        x={shapeItem.DashLine.points[0] - 50}
                                                        y={shapeItem.DashLine.points[1] - 38}
                                                        align="center"
                                                        verticalAlign="middle"



                                                    />

                                                    <Line

                                                        points={shapeItem.DashLine.points}
                                                        stroke={shapeItem.DashLine.stroke}
                                                        strokeWidth={shapeItem.DashLine.strokeWidth}
                                                        tension={0.5}
                                                        dash={shapeItem.DashLine.dash}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />
                                                    <Text
                                                        text={"Databases"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={100}
                                                        height={50}
                                                        x={shapeItem.DashLine.points[2] - 50}
                                                        y={shapeItem.DashLine.points[3] - 10}
                                                        align="center"
                                                        verticalAlign="middle"



                                                    />

                                                    <Rect
                                                        x={shapeItem.props.x}
                                                        y={shapeItem.props.y + 350}
                                                        width={shapeItem.props.width}
                                                        height={shapeItem.props.height}
                                                        fill={shapeItem.props.fill}
                                                        stroke={shapeItem.props.stroke}
                                                        strokeWidth={shapeItem.props.strokeWidth}
                                                    />
                                                    <Image
                                                        x={shapeItem.Img.x}
                                                        y={shapeItem.Img.y + 350}
                                                        width={shapeItem.Img.width}
                                                        height={shapeItem.Img.height}
                                                        image={shapeItem.Img.image}
                                                    />
                                                </Group>
                                            );
                                        }

                                        else if (shapeItem.type === 'Dashline') {
                                            return (
                                                <KonvaArrow
                                                    points={shapeItem.points}
                                                    pointerLength={5}
                                                    pointerWidth={5}
                                                    fill="black"
                                                    stroke="black"
                                                    strokeWidth={shapeItem.strokeWidth}
                                                    draggable={shapeItem.draggable}
                                                    onClick={this.handleRectClick}
                                                    dash={shapeItem.dash} // 設定虛線的樣式，這裡的數字表示虛線和空白之間的長度
                                                />)
                                        }
                                        else if (shapeItem.type === 'Boundary') {
                                            return (
                                                <Group
                                                    ref={ref => this.groupRefs.push(ref)}
                                                    draggable
                                                    onClick={(e) => this.handleElementClick(this.groupRefs, e)}
                                                >
                                                    <Circle
                                                        x={shapeItem.props.x}
                                                        y={shapeItem.props.y}
                                                        radius={30}
                                                        fill={shapeItem.props.fill}   // 白色底色
                                                        stroke={shapeItem.props.stroke}// 黑色邊框
                                                        strokeWidth={2}
                                                    />
                                                    <Line
                                                        points={shapeItem.line1.points}
                                                        stroke={shapeItem.line1.stroke}
                                                        strokeWidth={shapeItem.line1.strokeWidth}
                                                        tension={0.5}
                                                        lineCap="round"

                                                    />
                                                    <Line
                                                        points={shapeItem.line2.points}
                                                        stroke={shapeItem.line2.stroke}
                                                        strokeWidth={shapeItem.line2.strokeWidth}
                                                        tension={0.5}
                                                        lineCap="round"

                                                    />
                                                    <Text
                                                        text={"Boundary"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={100}
                                                        height={50}
                                                        x={shapeItem.text.x}
                                                        y={shapeItem.text.y}
                                                        align="center"
                                                        verticalAlign="middle"
                                                    />
                                                    <Text
                                                        text={"Boundary"}
                                                        fontSize={20}
                                                        fontFamily="Arial"
                                                        fill="black"
                                                        width={100}
                                                        height={50}
                                                        x={shapeItem.text.x1}
                                                        y={shapeItem.text.y1}
                                                        align="center"
                                                        verticalAlign="middle"
                                                    />

                                                    <Line

                                                        points={shapeItem.DashLine.points}
                                                        stroke={shapeItem.DashLine.stroke}
                                                        strokeWidth={shapeItem.DashLine.strokeWidth}
                                                        tension={0.5}
                                                        dash={shapeItem.DashLine.dash}
                                                        onClick={this.handleRectClick}
                                                        lineCap="round"

                                                    />

                                                    <Circle
                                                        x={shapeItem.Child.props.x}
                                                        y={shapeItem.Child.props.y}
                                                        radius={30}
                                                        fill={shapeItem.Child.props.fill}   // 白色底色
                                                        stroke={shapeItem.Child.props.stroke}// 黑色邊框
                                                        strokeWidth={2}
                                                    />
                                                    <Line
                                                        points={shapeItem.Child.line1.points}
                                                        stroke={shapeItem.Child.line1.stroke}
                                                        strokeWidth={shapeItem.Child.line1.strokeWidth}
                                                        tension={0.5}
                                                        lineCap="round"

                                                    />
                                                    <Line
                                                        points={shapeItem.Child.line2.points}
                                                        stroke={shapeItem.Child.line2.stroke}
                                                        strokeWidth={shapeItem.Child.line2.strokeWidth}
                                                        tension={0.5}
                                                        lineCap="round"

                                                    />
                                                </Group>

                                            )
                                        }

                                        // 添加其他类型的图形处理逻辑
                                        return null;
                                    })}
                                </React.Fragment>
                            ))}
                            {this.groupRefs.map((groupRef, index) => (
                                <Transformer
                                    key={index}
                                    ref={this.transformerRef}
                                    nodes={selectedGroups.includes(groupRef) ? [groupRef] : []}
                                />
                            ))}
                        </Layer>
                    </Stage>
                </div>
            </div>
        );
    }

}

export default SvgCanvas;
