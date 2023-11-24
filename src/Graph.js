import React, { useState } from 'react';
import { select as d3_select } from 'd3-selection';
import { selectAll as d3_selectAll } from 'd3-selection';
import 'd3-graphviz';
import * as d3 from 'd3';
import shapeJson from "./shape.json"
class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            svgContent: null,
            nodeNum: 0,
            textNum: 0,
            textDoubleClick: false,
            inputPosition: { x: 0, y: 0 },
            textLength: 0,
            inputext: "",
            doubleClickNode1: "",
            doubleClickNode2: "",
            arrow: "",
            beforeText: "",
            arrowClick: true,
            contextMenuX: 0,
            contextMenuY: 0,
            //獲取Edit Panel的實時大小
            dimensions: {
                width: 0,
                height: 0
            },
            dragStartX: 0,
            dragStartY: 0,
            dragLine: null,
            dragRect: [],
            onclickElement: null,
            groupNum: 0,

        };

        this.dragging = false;
        this.zoomScale = 1;
        this.translate = { x: 0, y: 0 };

        this.containerRef = React.createRef();
        this.inputRef = React.createRef();

    }
    componentDidMount() {
        this.fetchSvg(this.props.ImgUrl);

        // document.getElementById("editDiv").addEventListener('mouseClick', this.resetAllBoolean());

        //渲染時獲取editDiv的大小
        this.observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // console.log(entry.contentRect)
                const { width, height } = entry.contentRect;
                this.setState({ dimensions: { width, height } });

            }
        });

        if (this.containerRef.current) {
            this.observer.observe(this.containerRef.current);

        }

        // this.setupDragBehavior();
    }
    componentWillUnmount() {
        // 当组件卸载前，清除计时器
        clearInterval(this.interval);
        clearInterval(this.interval1);

        if (this.observer && this.containerRef.current) {
            this.observer.unobserve(this.containerRef.current);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.svgUrl !== prevProps.svgUrl) {
            this.fetchSvg();
        }

        if (this.state.svgContent !== prevState.svgContent) {
            this.updateSvg();

        }
        if (this.state.beforeText !== "" && this.state.inputext !== "") {

            this.props.parentFunction(this.state.beforeText, this.state.inputext, this.state.arrow);

        }
        if (!prevState.textDoubleClick && this.state.textDoubleClick && this.inputRef.current) {
            // 如果之前的状态是 false 并且现在的状态是 true，那么聚焦输入框
            this.inputRef.current.focus();
        }
        const { width, height } = this.state.dimensions;
        const { width: prevWidth, height: prevHeight } = prevState.dimensions;

        if (width !== prevWidth || height !== prevHeight) {
            this.updateSvg();
            console.log("hh")
        }
        // this.setupDragBehavior();

    }
    inputImg = (imgUrl) => {

        this.fetchSvg(imgUrl)

    }
    fetchSvg(imgUrl) {
        fetch(imgUrl)
            .then(response => response.text())
            .then(data => {
                this.setState({ svgContent: data });

            });
    }

    mouseUpdateSvg = () => {

    }
    updateSvg() {
        if (this.state.svgContent) {
            //editpanel的大小
            const x = this.state.dimensions.width;
            const y = this.state.dimensions.height;


            const container = d3.select(this.containerRef.current);
            const tempContainer = d3.create("div").html(this.state.svgContent);
            const svgElement = tempContainer.select("svg");
            svgElement.attr("preserveAspectRatio", `xMidYMid meet`);
            let currentStyle = svgElement.attr("style") || "";

            currentStyle = currentStyle.replace(/width:\s*\d+\s*px;/, `width:${x};`);
            currentStyle = currentStyle.replace(/height:\s*\d+\s*px;/, `height: ${y};`);

            // Step 4: Set the modified style back to the SVG element
            svgElement.attr("style", currentStyle);
            this.interval = setInterval(() => {
                this.reMakeAllDom(container);
                this.setState({ nodeNum: 0 });
                clearInterval(this.interval);
            }, 1);

            container.html(tempContainer.node().innerHTML);

            // 在此進行您的 D3 操作
        }
    }

    reMakeAllDom = (container) => {
        // console.log(d3.select(this.containerRef.current).selectAll("*"))
        const allElements = container.selectAll('*');
        console.log(allElements.nodes());
        const nodes = allElements.nodes();
        let num = 1;
        for (var i = 3; i < nodes.length; i += num) {
            const node = nodes[i];
            // console.log(node)
            if (node.nodeName.toLowerCase() === "line") {
                try {
                    if (node.getAttribute('style') === "stroke:#181818;stroke-width:0.5;stroke-dasharray:5.0,5.0;") {
                        num = 1
                        const numNode = this.nodeType()
                        d3_select(nodes[i])
                            .attr("id", `rectLine_${numNode}`)
                            .attr("type", "rectLine")
                    } else {
                        num = 3
                        let node1 = nodes[i];
                        let node2 = nodes[i + 1];
                        const line1x1 = node1.getAttribute("x1");
                        const line1x2 = node1.getAttribute("x2");
                        const line1y1 = node1.getAttribute("y1");
                        const line1y2 = node1.getAttribute("y2");

                        const line2x1 = node2.getAttribute("x1");
                        const line2x2 = node2.getAttribute("x2");
                        const line2y1 = node2.getAttribute("y1");
                        const line2y2 = node2.getAttribute("y2");

                        //箭頭->x
                        if (line1x1 === line2x1 & line1x2 === line2x2 & line1y1 === line2y2 & line1y2 === line2y1) {
                            const numNode = this.nodeType()
                            if (nodes[i + 2].nextSibling.nodeName.toLowerCase() === "text") {
                                num = 4
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                                d3_select(nodes[i + 2])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                                d3_select(nodes[i + 3])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                            }
                            // else if (nodes[i].nodeName.toLowerCase() === "line" && nodes[i + 1].nodeName.toLowerCase() === "line" && nodes[i + 2].nodeName.toLowerCase() !== "line") {
                            //     num = 2
                            //     d3_select(nodes[i])
                            //         .attr("id", `arrow_${numNode}`)
                            //         .attr("type", "false-X")
                            //     d3_select(nodes[i] + 1)
                            //         .attr("id", `arrow_${numNode}`)
                            //         .attr("type", "false-X")
                            // }
                            else if (nodes[i + 1].nextSibling.nodeName.toLowerCase() !== "text") {
                                num = 2
                            }

                            else if (nodes[i + 2].nextSibling.nodeName.toLowerCase() !== "text") {

                                num = 3
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                                d3_select(nodes[i + 2])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-X")
                            }



                        }
                        //箭頭->
                        else if (line1x1 === line2x1 &
                            line1x2 === line2x2 &
                            line1y1 === line2y1 &
                            line1y2 != line2y2) {
                            const numNode = this.nodeType()
                            if (nodes[i + 2].nextSibling.nodeName.toLowerCase() === "text") {
                                num = 4
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                                d3_select(nodes[i + 2])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                                d3_select(nodes[i + 3])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                            } else {
                                num = 3
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                                d3_select(nodes[i + 2])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow->")
                            }
                        }
                        //箭頭-//
                        else if (line1x1 != line2x1 &
                            line1x2 != line2x2 &
                            line1y1 == line2y1 &
                            line1y2 != line2y2) {
                            const numNode = this.nodeType()
                            if (nodes[i + 1].nextSibling.nodeName.toLowerCase() === "text") {
                                num = 3
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-//")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-//")
                                d3_select(nodes[i + 2])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-//")

                            } else {
                                num = 2
                                d3_select(nodes[i])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-//")
                                d3_select(nodes[i + 1])
                                    .attr("id", `arrow_${numNode}`)
                                    .attr("type", "arrow-//")

                            }


                        }
                        else if (nodes[i].nodeName.toLowerCase() === "line" && nodes[i + 1].nodeName.toLowerCase() === "text") {
                            const numNode = this.nodeType()
                            if (nodes[i + 1].innerHTML.replace(/\s/g, '').includes('[') && nodes[i + 1].innerHTML.replace(/\s/g, '').includes(']')) {
                                num = 2
                                d3_select(nodes[i])
                                    .attr("id", `elseLine_${numNode}`)
                                    .attr("type", "else")
                                d3_select(nodes[i + 1])
                                    .attr("id", `elseTest_${numNode}`)
                                    .attr("type", "else")
                            }
                        }


                    }
                } catch (error) {

                }

            }


            if (node.nodeName.toLowerCase() === "rect") {
                const numNode = this.nodeType()
                num = 2
                try {
                    if (nodes[i + 1].nodeName.toLowerCase() === "rect" && nodes[i + 2].nodeName.toLowerCase() === "text") {
                        num = 3
                        d3_select(nodes[i])
                            .attr("id", `collections_${numNode}`)
                            .attr("type", "Collections")

                        d3_select(nodes[i + 1])
                            .attr("id", `collections_${numNode}`)
                            .attr("type", "Collections")

                        d3_select(nodes[i + 2])
                            .attr("id", `collections_${numNode}`)
                            .attr("type", "Collections")


                    } else if (nodes[i].nodeName.toLowerCase() === "rect" && nodes[i + 1].nodeName.toLowerCase() === "text") {
                        if (nodes[i + 1].nodeName.toLowerCase() === "text" && nodes[i + 2 < node.length]) {
                            if (nodes[i + 1] < node.length & nodes[i + 2].nodeName.toLowerCase() === "text" & nodes[i + 3].nodeName.toLowerCase() === "rect") {
                                const num1 = this.nodeType();
                                num = 6
                                d3_select(nodes[i])
                                    .attr("id", `node_${numNode}`)
                                    .attr("type", "node");
                                d3_select(nodes[i + 1])
                                    .attr("id", `node_${numNode}`)
                                    .attr("type", "node");
                                d3_select(nodes[i + 2])
                                    .attr("id", `node_${numNode}`)
                                    .attr("type", "node");
                                d3_select(nodes[i + 3])
                                    .attr("id", `node_${num1}`)
                                    .attr("type", "node");
                                d3_select(nodes[i + 4])
                                    .attr("id", `node_${num1}`)
                                    .attr("type", "node");
                                d3_select(nodes[i + 5])
                                    .attr("id", `node_${num1}`)
                                    .attr("type", "node");
                            } else {
                                d3_select(nodes[i])
                                    .attr("id", `node_${numNode}`)
                                    .attr("type", "node")

                                d3_select(nodes[i + 1])
                                    .attr("id", `node_${numNode}`)
                                    .attr("type", "node");
                            }



                        } else {
                            d3_select(nodes[i])
                                .attr("id", `node_${numNode}`)
                                .attr("type", "node")

                            d3_select(nodes[i + 1])
                                .attr("id", `node_${numNode}`)
                                .attr("type", "node");
                        }

                    }
                    else {
                        num = 1
                        d3_select(nodes[i])
                            .attr("id", `altRect_${numNode}`)
                            .attr("type", "altRect");
                    }
                } catch (error) {
                    d3_select(nodes[i])
                        .attr("id", `altRect_${numNode}`)
                        .attr("type", "altRect");
                }
            }

            if (node.nodeName.toLowerCase() === "polygon") {
                try {
                    const numNode = this.nodeType()
                    if (nodes[i + 1].nextSibling.nodeName.toLowerCase() === "text") {
                        num = 3

                        d3_select(nodes[i])
                            .attr("id", `edge_${numNode}`)
                            .attr("type", "edge");
                        d3_select(nodes[i + 1])
                            .attr("id", `edge_${numNode}`)
                            .attr("type", "edge");
                        d3_select(nodes[i + 2])
                            .attr("id", `edge_${numNode}`)
                            .attr("type", "edge");
                    }
                    else if (nodes[i + 1].nodeName.toLowerCase() === "polygon") {
                        if (nodes[i + 2].nextSibling.nodeName.toLowerCase() === "text") {
                            num = 4
                            d3_select(nodes[i])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 1])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 2])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 3])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                        } else {
                            num = 3
                            d3_select(nodes[i])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 1])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 2])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");

                        }
                    }
                    else if (nodes[i + 1].nodeName.toLowerCase() === "ellipse" &
                        nodes[i + 2].nodeName.toLowerCase() === "polygon" &
                        nodes[i + 3].nodeName.toLowerCase() === "line"
                    ) {
                        if (nodes[i + 3].nextSibling.nodeName.toLowerCase() === "text") {
                            num = 5
                            d3_select(nodes[i])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 1])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 2])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 3])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 4])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                        } else {
                            num = 4
                            d3_select(nodes[i])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 1])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 2])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");
                            d3_select(nodes[i + 3])
                                .attr("id", `edge_${numNode}`)
                                .attr("type", "edge");

                        }
                    }
                    else {
                        num = 2

                    }

                } catch (error) {
                    const numNode = this.nodeType()
                    d3_select(nodes[i])
                        .attr("id", `edge_${numNode}`)
                        .attr("type", "edge");
                    d3_select(nodes[i + 1])
                        .attr("id", `edge_${numNode}`)
                        .attr("type", "edge");

                }

            }
            if (node.nodeName.toLowerCase() === "ellipse") {
                const numNode = this.nodeType()
                if (nodes[i + 2].nextSibling.nodeName.toLowerCase() === "text") {
                    num = 4

                    d3_select(nodes[i])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                    d3_select(nodes[i + 1])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                    d3_select(nodes[i + 2])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                    d3_select(nodes[i + 3])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                } else {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                    d3_select(nodes[i + 1])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                    d3_select(nodes[i + 2])
                        .attr("id", `arrow_${numNode}`)
                        .attr("type", "arrow_ellipse");
                }


            }
            if (node.nodeName.toLowerCase() === "text") {

                const numNode = this.nodeType()

                if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "ellipse" & nodes[i + 2].nodeName.toLowerCase() === "path") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `actor_${numNode}`)
                        .attr("type", "Actor")

                    d3_select(nodes[i + 1])
                        .attr("id", `actor_${numNode}`)
                        .attr("type", "Actor")

                    d3_select(nodes[i + 2])
                        .attr("id", `actor_${numNode}`)
                        .attr("type", "Actor")
                }

                else if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "path" & nodes[i + 2].nodeName.toLowerCase() === "ellipse") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `boundary_${numNode}`)
                        .attr("type", "Boundary")

                    d3_select(nodes[i + 1])
                        .attr("id", `boundary_${numNode}`)
                        .attr("type", "Boundary")

                    d3_select(nodes[i + 2])
                        .attr("id", `boundary_${numNode}`)
                        .attr("type", "Boundary")

                } else if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "ellipse" & nodes[i + 2].nodeName.toLowerCase() === "polygon") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `control_${numNode}`)
                        .attr("type", "Control")

                    d3_select(nodes[i + 1])
                        .attr("id", `control_${numNode}`)
                        .attr("type", "Control")

                    d3_select(nodes[i + 2])
                        .attr("id", `control_${numNode}`)
                        .attr("type", "Control")

                }
                else if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "ellipse" & nodes[i + 2].nodeName.toLowerCase() === "line") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `entity_${numNode}`)
                        .attr("type", "Entity")

                    d3_select(nodes[i + 1])
                        .attr("id", `entity_${numNode}`)
                        .attr("type", "Entity")

                    d3_select(nodes[i + 2])
                        .attr("id", `entity_${numNode}`)
                        .attr("type", "Entity")

                } else if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "path" & nodes[i + 2].nodeName.toLowerCase() === "path") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `database_${numNode}`)
                        .attr("type", "Database")

                    d3_select(nodes[i + 1])
                        .attr("id", `database_${numNode}`)
                        .attr("type", "Database")

                    d3_select(nodes[i + 2])
                        .attr("id", `database_${numNode}`)
                        .attr("type", "Database")

                }

                else if (nodes[i].nodeName.toLowerCase() === "text" & nodes[i + 1].nodeName.toLowerCase() === "ellipse" & nodes[i + 2].nodeName.toLowerCase() === "line") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `queue_${numNode}`)
                        .attr("type", "Queue")

                    d3_select(nodes[i + 1])
                        .attr("id", `queue_${numNode}`)
                        .attr("type", "Queue")

                    d3_select(nodes[i + 2])
                        .attr("id", `queue_${numNode}`)
                        .attr("type", "Queue")

                }
                else {

                    if (nodes[i].innerHTML.replace(/\s/g, '').includes('[') && nodes[i].innerHTML.replace(/\s/g, '').includes(']')) {
                        num = 1
                        d3_select(nodes[i])
                            .attr("id", `altText_${numNode}`)
                            .attr("type", "altText")

                    }

                }




            }
            else if (nodes[i].nodeName.toLowerCase() === "path" && nodes[i + 1].nodeName.toLowerCase() === "rect" && nodes[i + 2].nodeName.toLowerCase() === "text") {
                const numNode = this.nodeType()
                num = 3
                d3_select(nodes[i])
                    .attr("id", `altesle_${numNode}`)
                    .attr("type", "IfElse")

                d3_select(nodes[i + 1])
                    .attr("id", `altesle_${numNode}`)
                    .attr("type", "IfElse")

                d3_select(nodes[i + 2])
                    .attr("id", `altesle_${numNode}`)
                    .attr("type", "IfElse")
            }
        }
        this.linkRectLineAndRect();
        this.interval1 = setInterval(() => {
            this.drawRect();
            this.test(container);
            clearInterval(this.interval1);
        }, 1);



    }

    createGroupNum = () => {
        this.setState(prevState => ({
            groupNum: prevState.groupNum + 1
        }));
        return this.state.groupNum;
    }


    createGroup = (rect1, rect2, Line, container) => {
        const svg = container
        const rectOne = rect1;
        const recttwo = rect2;
        const rectLine = Line;

        const num = this.createGroupNum();
        const group = svg.append('g').attr('id', `nodesGroup_${num}`)
        group.node().append(rect1);
        group.node().append(rect2);
        group.node().append(Line);
        console.log(group.nodes())


    }

    linkRectLineAndRect = () => {
        const container = (d3.select(this.containerRef.current)).select('svg');
        const rectLines = container.selectAll("[type='rectLine']").nodes();
        const rectNodes = container.selectAll("rect[type='node']").nodes();
        console.log(rectLines)
        console.log(rectNodes)

        for (var i = 0; i < rectLines.length; i++) {
            const line = rectLines[i].getAttribute("id")
            let rect1 = rectNodes[i * 2];
            let rect2 = rectNodes[i * 2 + 1];
            console.log(d3_select(rect1).node())
            d3_select(rect1).attr("Line", `${line}`)
            d3_select(rect2).attr("Line", `${line}`)

            this.createGroup(rect1, rect2, line, container);

        }

        this.drawRectLine(rectLines, container);


    }

    drawRectLine = (rectLines, container) => {
        for (var i = 0; i < rectLines.length; i++) {
            let line = rectLines[i];
            var x1 = parseFloat(line.getAttribute("x1"));
            var y1 = parseFloat(line.getAttribute("y1"));
            var x2 = parseFloat(line.getAttribute("x2"));
            var y2 = parseFloat(line.getAttribute("y2"));


            console.log(x1, y1, x2, y2)

            var rectWidth = 10;  // 这是框的宽度，您可以根据需要调整
            var rectHeight = Math.abs(y2 - y1);
            var rectX = x1 - rectWidth / 2;  // 使矩形框居中于线
            var rectY = Math.min(y1, y2);

            container
                .append("rect")
                .attr("x", rectX)
                .attr("y", rectY)
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("stroke", "black")
                .attr("opacity", 0)
                .attr('class', 'rectLine')
                .attr('Line', `${line.getAttribute("id")}`)
                .on('drop', this.bbb)


            // .attr("stroke", "red");

        }

    }
    //畫面上的監聽器
    test = (container) => {
        //雙擊
        container.selectAll("text").on("dblclick", this.textHandleDoubleClick.bind(this));
        // container.selectAll("line").on("dblclick", this.handleLineClick.bind(this))
        // container.selectAll("polygon").on("dblclick", this.handleLineClick.bind(this));


        //單擊
        container.selectAll("line").on("contextmenu", this.contextMenu.bind(this));
        // container.selectAll("text").on("click", this.handleLeftClick.bind(this));
        container.on("click", this.resetAllBoolean.bind(this));
        container.selectAll("svg").on("wheel", this.mouseWheel.bind(this));
        container.selectAll("*").on("click", this.DomLine);
        // container.select("svg").on("click", function (event) {
        //     console.log(event)
        //     var coordinates = d3.pointer(event);
        //     var x = coordinates[0];
        //     var y = coordinates[1];
        //     console.log(x, y);
        // });
        // container.selectAll("svg").on("drag", this.mouseDrag.bind(this));

        //取消預設


    }



    mouseWheel = (e) => {
        e.preventDefault();
        let width = this.state.dimensions.width;
        let height = this.state.dimensions.height;
        let newWidth;
        let newHeight;

        if (e.deltaY < 0) {
            // Zoom in
            newWidth = parseInt(width) + 50;
            newHeight = parseInt(height) + 50;
            console.log(newHeight)
        } else {
            // Zoom out
            newWidth = parseInt(width) - 50;
            newHeight = parseInt(height) - 50;
            console.log(newHeight)
        }
        const intervalId = setInterval(() => {
            console.log("Tick...");
            this.setState({ dimensions: { width: newWidth, height: newHeight } });

            clearInterval(intervalId);
        }, 1); // 每 1000 毫秒 (1 秒) 執行一次

        // 當需要停止計時器時




    }



    contextMenu = (event) => {
        if (event.currentTarget.nodeName === 'g' || event.currentTarget.nodeName === 'svg') {


        } else {

            //點擊到綫條或者箭頭
            if (event.currentTarget.nodeName === "line" || event.currentTarget.nodeName === "polygon") {
                console.log(event.currentTarget.id)
                // this.setState({ arrowClick: true })
                const clickedLine = d3.select(event.currentTarget);
                const isHighlighted = clickedLine.classed("highlighted");

                // 为该元素设置红色的边框和边框宽度
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedLine.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x1 = parseFloat(clickedLine.attr("x1"));
                    const y1 = parseFloat(clickedLine.attr("y1"));
                    const x2 = parseFloat(clickedLine.attr("x2"));
                    const y2 = parseFloat(clickedLine.attr("y2"));

                    const minX = Math.min(x1, x2) - 2;
                    const minY = Math.min(y1, y2) - 5;
                    const width = Math.abs(x2 - x1) + 4;
                    const height = Math.abs(y2 - y1) + 10;

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", minX)
                        .attr("y", minY)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .lower(); // 确保新的rect在原始line下方

                    clickedLine.classed("highlighted", true);
                }
                this.Whicharrow(event.currentTarget.id)

            }
            //點擊到node圖形
            else if (event.currentTarget.nodeName === 'text' && event.currentTarget.getAttribute("type") === "node") {
                if (event.currentTarget.nodeName === 'text' || event.currentTarget.nodeName === 'rect') {
                    const getid = event.currentTarget.id;

                    const clickedRect = d3_select("[id=" + `${getid}` + "]")

                    const isHighlighted = clickedRect.classed("highlighted");
                    if (isHighlighted) {
                        // 移除之前的高亮
                        d3.select("#highlighted-border").remove();
                        clickedRect.classed("highlighted", false);
                    } else {
                        // 添加高亮
                        const x = parseFloat(clickedRect.attr("x")) - 2; //根据需要调整偏移量
                        const y = parseFloat(clickedRect.attr("y")) - 2;
                        const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                        const height = parseFloat(clickedRect.attr("height")) + 4;

                        const container = d3.select(event.currentTarget.parentNode);
                        container.append("rect")
                            .attr("id", "highlighted-border")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .style("fill", "none")
                            .style("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("stroke-dasharray", "5,5")
                            .lower(); // 确保新的rect在原始rect下方

                        clickedRect.classed("highlighted", true);
                    }

                } else {
                    const clickedRect = d3.select(event.currentTarget);

                    const isHighlighted = clickedRect.classed("highlighted");

                    // 为该元素设置红色的边框和边框宽度
                    if (isHighlighted) {
                        // 移除之前的高亮
                        d3.select("#highlighted-border").remove();
                        clickedRect.classed("highlighted", false);
                    } else {
                        // 添加高亮
                        const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                        const y = parseFloat(clickedRect.attr("y")) - 2;
                        const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                        const height = parseFloat(clickedRect.attr("height")) + 4;

                        const container = d3.select(event.currentTarget.parentNode);
                        container.append("rect")
                            .attr("id", "highlighted-border")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .style("fill", "none")
                            .style("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("stroke-dasharray", "5,5")
                            .lower(); // 确保新的rect在原始rect下方

                        clickedRect.classed("highlighted", true);
                    }
                }


                //如果點擊的是edge
            } else if (event.currentTarget.nodeName === 'text' && event.currentTarget.getAttribute("type") === "edge") {
                const getid = event.currentTarget.id;


                const clickedRect = d3_select(`text#${getid}`)


                const isHighlighted = clickedRect.classed("highlighted");
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedRect.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x = parseFloat(clickedRect.attr("x")) - 5; //根据需要调整偏移量
                    const y = parseFloat(clickedRect.attr("y")) - 10;

                    const width = (Number(event.currentTarget.getAttribute('textLength')) + 10).toString(); // 增加的大小，这里我加了4
                    const height = (Number(event.currentTarget.getAttribute('font-size')) + 2).toString();

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .lower(); // 确保新的rect在原始rect下方

                    clickedRect.classed("highlighted", true);
                }

            } else {
                const clickedRect = d3.select(event.currentTarget);

                const isHighlighted = clickedRect.classed("highlighted");

                // 为该元素设置红色的边框和边框宽度
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedRect.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                    const y = parseFloat(clickedRect.attr("y")) - 2;
                    const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                    const height = parseFloat(clickedRect.attr("height")) + 4;

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .lower(); // 确保新的rect在原始rect下方

                    clickedRect.classed("highlighted", true);
                }

            }

        }
    }

    //判斷箭頭的種類
    Whicharrow = (arrowId) => {
        const line = (d3_selectAll(`#${arrowId}`))._groups[0];
        console.log(line)
        let text;

        if (line[0].getAttribute("type") === "arrow-X") {

            let x1 = parseFloat(line[2].getAttribute("x1")); // "-"線的起點x坐標
            let x2 = parseFloat(line[2].getAttribute("x2")); // "-"線的終點x坐標
            let y = parseFloat(line[2].getAttribute("y1"));  // "-"線的y坐標（由於它是水平的，所以y1和y2都是相同的）

            let cx = (x1 + x2) / 2; // 中心點的x坐標

            d3.selectAll(`#${arrowId}`).attr("transform", function (d, i) {
                // 檢查當前的transform屬性
                let currentTransform = d3.select(this).attr("transform");

                let newTransform = `translate(${cx},${y}) scale(-1,1) translate(${-cx},-${y})`;
                return currentTransform ? currentTransform + " " + newTransform : newTransform;
            });

            console.log(x1, x2, y)


            console.log("arrow-X");

        }
        else if (line[0].getAttribute("type") === "edge") {
            let x1 = parseFloat(line[1].getAttribute("x1")); // "-"線的起點x坐標
            let x2 = parseFloat(line[1].getAttribute("x2")); // "-"線的終點x坐標
            let y = parseFloat(line[1].getAttribute("y1"));  // "-"線的y坐標（由於它是水平的，所以y1和y2都是相同的）

            let cx = (x1 + x2) / 2; // 中心點的x坐標

            d3.selectAll(`#${arrowId}`).attr("transform", function (d, i) {
                // 檢查當前的transform屬性
                let currentTransform = d3.select(this).attr("transform");

                let newTransform = `translate(${cx},${y}) scale(-1,1) translate(${-cx},-${y})`;
                return currentTransform ? currentTransform + " " + newTransform : newTransform;
            });
            console.log("edge")
        }
        else if (line[0].getAttribute("type") === "arrow->") {
            let x1 = parseFloat(line[2].getAttribute("x1")); // "-"線的起點x坐標
            let x2 = parseFloat(line[2].getAttribute("x2")); // "-"線的終點x坐標
            let y = parseFloat(line[2].getAttribute("y1"));  // "-"線的y坐標（由於它是水平的，所以y1和y2都是相同的）

            let cx = (x1 + x2) / 2; // 中心點的x坐標

            d3.selectAll(`#${arrowId}`).attr("transform", function (d, i) {
                // 檢查當前的transform屬性
                let currentTransform = d3.select(this).attr("transform");

                let newTransform = `translate(${cx},${y}) scale(-1,1) translate(${-cx},-${y})`;
                return currentTransform ? currentTransform + " " + newTransform : newTransform;
            });
            console.log("arrow->")
        }
        else if (line[0].getAttribute("type") === "arrow-//") {
            let x1 = parseFloat(line[1].getAttribute("x1")); // "-"線的起點x坐標
            let x2 = parseFloat(line[1].getAttribute("x2")); // "-"線的終點x坐標
            let y = parseFloat(line[1].getAttribute("y1"));  // "-"線的y坐標（由於它是水平的，所以y1和y2都是相同的）

            let cx = (x1 + x2) / 2; // 中心點的x坐標

            d3.selectAll(`#${arrowId}`).attr("transform", function (d, i) {
                // 檢查當前的transform屬性
                let currentTransform = d3.select(this).attr("transform");

                let newTransform = `translate(${cx},${y}) scale(-1,1) translate(${-cx},-${y})`;
                return currentTransform ? currentTransform + " " + newTransform : newTransform;
            });
            console.log("arrow-//")
        }
        else if (line[0].getAttribute("type") === "arrow_ellipse") {
            let x1 = parseFloat(line[2].getAttribute("x1")); // "-"線的起點x坐標
            let x2 = parseFloat(line[2].getAttribute("x2")); // "-"線的終點x坐標
            let y = parseFloat(line[2].getAttribute("y1"));  // "-"線的y坐標（由於它是水平的，所以y1和y2都是相同的）

            let cx = (x1 + x2) / 2; // 中心點的x坐標

            d3.selectAll(`#${arrowId}`).attr("transform", function (d, i) {
                // 檢查當前的transform屬性
                let currentTransform = d3.select(this).attr("transform");

                let newTransform = `translate(${cx},${y}) scale(-1,1) translate(${-cx},-${y})`;
                return currentTransform ? currentTransform + " " + newTransform : newTransform;
            });
            console.log("arrow_ellispe")
        }


    }
    dragStarted = (event) => {
        // this.state.dragStartX = event.x;
        // this.state.dragStartY = event.y;

        // this.state.dragLine = container.append("line")
        //     .attr("x1", this.state.dragStartX)
        //     .attr("y1", this.state.dragStartY)
        //     .attr("x2", this.state.dragStartX)
        //     .attr("y2", this.state.dragStartY)
        //     .style("stroke", "black")
        //     .style("stroke-width", "2px");
    }

    dragging = (event) => {
        // this.state.dragLine
        //     .attr("x2", event.x)
        //     .attr("y2", event.y);
    }

    dragEnded(event) {
        this.state.dragLine.remove();  // 刪除拖拽線
    }

    //左鍵雙擊的判斷function
    handleLeftClick = (event, d) => {


        if (event.currentTarget.nodeName === 'g' || event.currentTarget.nodeName === 'svg') {


        } else {

            //點擊到綫條或者箭頭
            if (event.currentTarget.nodeName === "line" || event.currentTarget.nodeName === "polygon") {
                console.log(event.currentTarget.id)
                // this.setState({ arrowClick: true })
                const clickedLine = d3.select(event.currentTarget);
                const isHighlighted = clickedLine.classed("highlighted");

                // 为该元素设置红色的边框和边框宽度
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedLine.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x1 = parseFloat(clickedLine.attr("x1"));
                    const y1 = parseFloat(clickedLine.attr("y1"));
                    const x2 = parseFloat(clickedLine.attr("x2"));
                    const y2 = parseFloat(clickedLine.attr("y2"));

                    const minX = Math.min(x1, x2) - 2;
                    const minY = Math.min(y1, y2) - 5;
                    const width = Math.abs(x2 - x1) + 4;
                    const height = Math.abs(y2 - y1) + 10;

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", minX)
                        .attr("y", minY)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .on("mouseenter", function () {
                            d3.select(this).style("cursor", "crosshair")

                        })
                        .on("mouseleave", function () {
                            d3.select(this).style("cursor", "default");
                        })


                        .lower(); // 确保新的rect在原始line下方

                    clickedLine.classed("highlighted", true);
                }


            }
            //點擊到node圖形
            else if (event.currentTarget.nodeName === 'text' && event.currentTarget.getAttribute("type") === "node") {
                if (event.currentTarget.nodeName === 'text' || event.currentTarget.nodeName === 'rect') {
                    const getid = event.currentTarget.id;

                    const clickedRect = d3_select("[id=" + `${getid}` + "]")

                    const isHighlighted = clickedRect.classed("highlighted");
                    if (isHighlighted) {
                        // 移除之前的高亮
                        d3.select("#highlighted-border").remove();
                        clickedRect.classed("highlighted", false);
                    } else {
                        // 添加高亮
                        const x = parseFloat(clickedRect.attr("x")) - 2; //根据需要调整偏移量
                        const y = parseFloat(clickedRect.attr("y")) - 2;
                        const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                        const height = parseFloat(clickedRect.attr("height")) + 4;

                        const container = d3.select(event.currentTarget.parentNode);
                        container.append("rect")
                            .attr("id", "highlighted-border")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .style("fill", "none")
                            .style("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("stroke-dasharray", "5,5")
                            .lower(); // 确保新的rect在原始rect下方

                        clickedRect.classed("highlighted", true);
                    }

                } else {
                    const clickedRect = d3.select(event.currentTarget);

                    const isHighlighted = clickedRect.classed("highlighted");

                    // 为该元素设置红色的边框和边框宽度
                    if (isHighlighted) {
                        // 移除之前的高亮
                        d3.select("#highlighted-border").remove();
                        clickedRect.classed("highlighted", false);
                    } else {
                        // 添加高亮
                        const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                        const y = parseFloat(clickedRect.attr("y")) - 2;
                        const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                        const height = parseFloat(clickedRect.attr("height")) + 4;

                        const container = d3.select(event.currentTarget.parentNode);
                        container.append("rect")
                            .attr("id", "highlighted-border")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", width)
                            .attr("height", height)
                            .style("fill", "none")
                            .style("stroke", "black")
                            .style("stroke-width", "2px")
                            .style("stroke-dasharray", "5,5")
                            .lower(); // 确保新的rect在原始rect下方

                        clickedRect.classed("highlighted", true);
                    }
                }


                //如果點擊的是edge
            } else if (event.currentTarget.nodeName === 'text' && event.currentTarget.getAttribute("type") === "edge") {
                const getid = event.currentTarget.id;


                const clickedRect = d3_select(`text#${getid}`)


                const isHighlighted = clickedRect.classed("highlighted");
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedRect.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x = parseFloat(clickedRect.attr("x")) - 5; //根据需要调整偏移量
                    const y = parseFloat(clickedRect.attr("y")) - 10;

                    const width = (Number(event.currentTarget.getAttribute('textLength')) + 10).toString(); // 增加的大小，这里我加了4
                    const height = (Number(event.currentTarget.getAttribute('font-size')) + 2).toString();

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .lower(); // 确保新的rect在原始rect下方

                    clickedRect.classed("highlighted", true);
                }

            } else {
                const clickedRect = d3.select(event.currentTarget);

                const isHighlighted = clickedRect.classed("highlighted");

                // 为该元素设置红色的边框和边框宽度
                if (isHighlighted) {
                    // 移除之前的高亮
                    d3.select("#highlighted-border").remove();
                    clickedRect.classed("highlighted", false);
                } else {
                    // 添加高亮
                    const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                    const y = parseFloat(clickedRect.attr("y")) - 2;
                    const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                    const height = parseFloat(clickedRect.attr("height")) + 4;

                    const container = d3.select(event.currentTarget.parentNode);
                    container.append("rect")
                        .attr("id", "highlighted-border")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .style("stroke-dasharray", "5,5")
                        .lower(); // 确保新的rect在原始rect下方

                    clickedRect.classed("highlighted", true);
                }

            }

        }

    }
    //點擊別的地方時重置變數
    resetAllBoolean = () => {
        this.setState({
            textDoubleClick: false,

        })
        // console.log("ll")

    }
    nodeType = () => {
        this.setState(prevState => ({ nodeNum: prevState.nodeNum + 1 }))
        return this.state.nodeNum
    }
    TextNum = () => {
        this.setState(prevState => ({ textNum: prevState.textNum + 1 }))
        return this.state.textNum
    }


    // eventHandel = () => {

    //     d3.select(this.containerRef.current).selectAll("[type='node']").on("click", this.handleRightClick.bind(this));
    // }
    // handleTextClick(event, d) {
    //     console.log()

    // }
    handleEdgeDoubleClick(event, d) {
        const clickedLineId = event.currentTarget.id;
        console.log(clickedLineId)
        const element = d3.select(`#${clickedLineId}`);
        const element2 = d3.selectAll('line').filter(`#${clickedLineId}`);

        // 1. 获取line的起点和终点坐标
        const x1 = parseFloat(element2.attr("x1"));
        const y1 = parseFloat(element2.attr("y1"));
        const x2 = parseFloat(element2.attr("x2"));
        const y2 = parseFloat(element2.attr("y2"));
        console.log(x1)
        // 2. 交换line的起点和终点坐标
        element2.attr("x1", x2)
            .attr("y1", y2)
            .attr("x2", x1)
            .attr("y2", y1);

        // 3. 将箭头移动到原始的line起点
        // 假设箭头是一个polygon或path，您需要根据具体情况修改这一部分
        // const transform = `translate(${x1}, ${y1})`;
        // element.attr("transform", transform);


        // 如果元素是多邊形，計算其中心
        if (element.node().tagName === 'polygon') {
            const points = element.attr("points").split(" ").map(d => d.split(",").map(Number));
            const centerX = d3.mean(points, d => d[0]);
            const centerY = d3.mean(points, d => d[1]);


            // 在中心點上進行反轉
            element.attr("transform", `translate(${centerX},${centerY}) scale(-1, 1) translate(-${centerX},-${centerY})`);
        } else {
            element.attr("transform", "scale(-1, 1)");
        }
        if (element.node().tagName === "line") {
        }

        console.log(element);


    }
    handleEdgeClick(event, d) {
        if (event.currentTarget.nodeName === "line" || event.currentTarget.nodeName === "polygon") {
            const clickedLine = d3.select(event.currentTarget);


            const isHighlighted = clickedLine.classed("highlighted");

            // 为该元素设置红色的边框和边框宽度
            if (isHighlighted) {
                // 移除之前的高亮
                d3.select("#highlighted-border").remove();
                clickedLine.classed("highlighted", false);
            } else {
                // 添加高亮
                const x1 = parseFloat(clickedLine.attr("x1"));
                const y1 = parseFloat(clickedLine.attr("y1"));
                const x2 = parseFloat(clickedLine.attr("x2"));
                const y2 = parseFloat(clickedLine.attr("y2"));

                const minX = Math.min(x1, x2) - 2;
                const minY = Math.min(y1, y2) - 5;
                const width = Math.abs(x2 - x1) + 4;
                const height = Math.abs(y2 - y1) + 10;

                const container = d3.select(event.currentTarget.parentNode);
                container.append("rect")
                    .attr("id", "highlighted-border")
                    .attr("x", minX)
                    .attr("y", minY)
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("stroke-dasharray", "5,5")
                    .lower(); // 确保新的rect在原始line下方

                clickedLine.classed("highlighted", true);
            }

        }
        console.log("line")

    }

    handleRightClick(event, d) {

        if (event.currentTarget.nodeName === "text") {

            const getid = event.currentTarget.id;
            const clickedRect = d3_select("[id=" + `${getid}` + "]")

            const isHighlighted = clickedRect.classed("highlighted");
            if (isHighlighted) {
                // 移除之前的高亮
                d3.select("#highlighted-border").remove();
                clickedRect.classed("highlighted", false);
            } else {
                // 添加高亮
                const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                const y = parseFloat(clickedRect.attr("y")) - 2;
                const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                const height = parseFloat(clickedRect.attr("height")) + 4;

                const container = d3.select(event.currentTarget.parentNode);
                container.append("rect")
                    .attr("id", "highlighted-border")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("stroke-dasharray", "5,5")
                    .lower(); // 确保新的rect在原始rect下方

                clickedRect.classed("highlighted", true);
            }

        } else {
            const clickedRect = d3.select(event.currentTarget);

            const isHighlighted = clickedRect.classed("highlighted");

            // 为该元素设置红色的边框和边框宽度
            if (isHighlighted) {
                // 移除之前的高亮
                d3.select("#highlighted-border").remove();
                clickedRect.classed("highlighted", false);
            } else {
                // 添加高亮
                const x = parseFloat(clickedRect.attr("x")) - 2; // 你可以根据需要调整偏移量
                const y = parseFloat(clickedRect.attr("y")) - 2;
                const width = parseFloat(clickedRect.attr("width")) + 4; // 增加的大小，这里我加了4
                const height = parseFloat(clickedRect.attr("height")) + 4;

                const container = d3.select(event.currentTarget.parentNode);
                container.append("rect")
                    .attr("id", "highlighted-border")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("stroke-dasharray", "5,5")
                    .lower(); // 确保新的rect在原始rect下方

                clickedRect.classed("highlighted", true);
            }
        }




    }
    textHandleDoubleClick = (element) => {
        console.log(element)
        // if (element.currentTarget.getAttribute("type") === "node") { }
        const point = d3.pointer(element)

        this.setState({ inputext: "" })
        const container = d3.select(this.containerRef.current);
        // const x = element.target.y.animVal[0].value;
        // const y = element.target.x.animVal[0].value;

        const x = element.offsetY;
        const y = element.offsetX;
        console.log(x, y)
        const textlength = element.target.textLength.animVal.value
        if (element.target.nodeName === "text") {

            if (element.currentTarget.getAttribute("type") === "node") {

                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                let nodeText1 = (container.select(`text#${`node_${num}`}`)).text();
                let nodeText2;
                try {
                    // 這裡可能會拋出錯誤 
                    nodeText2 = (container.select(`text#${`node_${num + 1}`}`)).text();
                } catch (error) {
                    console.log("kk")
                    nodeText2 = null;
                    // 或者處理錯誤
                }


                console.log(nodeText1, nodeText2)
                if (nodeText1 === nodeText2) {

                    console.log("aa")
                    node1 = `node_${num}`;
                    node2 = `node_${num + 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })


                } else {
                    node1 = `node_${num}`;
                    node2 = `node_${num - 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })

                }



                // 如果你需要更改node2的文本，你可以这样做：
                // node2.text("Your Text Here");
            }
            else if (element.currentTarget.getAttribute("type") === "edge") {
                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                node1 = `edge_${num}`;

                const nodes1 = container.select(`text#${node1}`);
                // let arrow1 = this.arrow(element)

                // console.log(arrow1)
                this.setState({
                    doubleClickNode1: nodes1,
                    doubleClickNode2: null,
                    // arrow: arrow1,
                    beforeText: nodes1.text()
                })
            }
            else if (element.currentTarget.getAttribute("type") === "Actor") {

                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                let nodeText1 = (container.select(`text#${`actor_${num}`}`)).text();
                let nodeText2;
                try {
                    // 這裡可能會拋出錯誤 
                    nodeText2 = (container.select(`text#${`actor_${num + 1}`}`)).text();
                } catch (error) {

                    nodeText2 = null;
                    // 或者處理錯誤
                }


                console.log(nodeText1)
                if (nodeText1 === nodeText2) {

                    node1 = `actor_${num + 1}`;
                    node2 = `actor_${num}`;
                    console.log(`text#${node1}`)
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);

                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                    // nodes1.text("hhhh")

                } else {

                    node1 = `actor_${num}`;
                    node2 = `actor_${num - 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                }
            }
            else if (element.currentTarget.getAttribute("type") === "Boundary") {

                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                if (num % 2 === 0) {
                    node1 = `boundary_${num - 1}`;
                    node2 = `boundary_${num}`;
                    console.log(`text#${node1}`)
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    console.log(node1)
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                    // nodes1.text("hhhh")

                } else {
                    node1 = `boundary_${num}`;
                    node2 = `boundary_${num + 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                }
            }
            else if (element.currentTarget.getAttribute("type") === "Control") {

                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                if (num % 2 === 0) {
                    node1 = `control_${num - 1}`;
                    node2 = `control_${num}`;
                    console.log(`text#${node1}`)
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    console.log(node1)
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                    // nodes1.text("hhhh")

                } else {
                    node1 = `control_${num}`;
                    node2 = `control_${num + 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                }
            }

            else if (element.currentTarget.getAttribute("type") === "Entity") {

                const num = Number(element.target.id.split('_')[1]);  // 使用split('_')更安全地获取数字
                let node1, node2;

                if (num % 2 === 0) {
                    node1 = `entity_${num - 1}`;
                    node2 = `entity_${num}`;
                    console.log(`text#${node1}`)
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    console.log(node1)
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                    // nodes1.text("hhhh")

                } else {
                    node1 = `entity_${num}`;
                    node2 = `entity_${num + 1}`;
                    const nodes1 = container.select(`text#${node1}`);
                    const nodes2 = container.select(`text#${node2}`);
                    this.setState({
                        doubleClickNode1: nodes1,
                        doubleClickNode2: nodes2,
                        arrow: null,
                        beforeText: nodes1.text()
                    })
                }
            }


            this.setState({
                inputPosition: { x, y },
                textDoubleClick: true,
                textLength: textlength
            });
        }
    }

    //判斷箭頭的方向
    // arrow = (event) => {
    //     let text = "";
    //     const arrow = d3_select(`polygon#${event.currentTarget.id}`)
    //     const point = arrow._groups[0][0].getAttribute("points").split(",")
    //     const x1 = point[0];
    //     const x2 = point[2];
    //     if (x1 - x2 < 0) {
    //         text = "->";

    //     }
    //     else if (x1 - x2 > 0) {
    //         text = "<-"
    //     }
    //     return text


    // }

    //當輸入完后點擊enter
    inputHandleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.setState({
                textDoubleClick: false
            })

            if (event.target.value === "") {
                console.log("kongkong");
            } else {
                this.sendDataToParent(event)


            }

        }
    }
    //
    sendDataToParent = (event) => {
        console.log(event.target.value)
        if (this.state.doubleClickNode1 != null && this.state.doubleClickNode2 != null) {

            this.state.doubleClickNode1.text(event.target.value);
            this.state.doubleClickNode2.text(event.target.value);
            this.setState({
                inputext: event.target.value
            })
        } else {
            this.state.doubleClickNode1.text(event.target.value);
            this.setState({
                inputext: event.target.value
            })

        }
    }
    handleMenuItemClick = (e, data) => {
        console.log(data.foo); // 這裡會印出 "example"
    }
    handleRightClick = (e) => {
        e.preventDefault();
        console.log(e.clientX)

        this.setState({
            arrowClick: true,
            contextMenuX: e.clientX,
            contextMenuY: e.clientY
        });
    };




    /////////////////////////////////////////////////////////////////////////
    //處理拖拽的地方
    handleDragOver = (e) => {
        e.preventDefault(); // 防止預設的放置行為

        const text = this.props.data;
        if (text === "Arrow1") {

            let container = (d3.select(this.containerRef.current)).select('svg');
            let rect = container.selectAll(".group");
            rect.attr("pointer-events", "auto");
            // let rect = d3_selectAll("rect.group")
            rect.classed("flash", true)
        }
        else if (text === "Arrow2" || text === "Arrow3" || text === "Arrow4") {
            let container = (d3.select(this.containerRef.current)).select('svg');
            let rect = container.selectAll(".group");
            rect.attr("pointer-events", "auto");
            // let rect = d3_selectAll("rect.group")
            rect.classed("flash", true)
        }
        else if (text === "activate") {
            let container = (d3.select(this.containerRef.current)).select('svg');
            let line = container.selectAll(".rectLine");
            line.attr("pointer-events", "auto");
            line.classed("flash", true)
        }
        else if (text === "destroy") {
            let container = (d3.select(this.containerRef.current)).select('svg');
            let line = container.selectAll(".rectLine");
            line.attr("pointer-events", "auto");
            line.classed("flash", true)
        }
        console.log(this.props.data)

    };

    handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');  // 獲取傳遞的字串
        let rect = d3.selectAll(".group");
        rect.classed("flash", false);
        let line = d3.selectAll(".rectLine");
        line.classed("flash", false);


        console.log(data)
        if (data === "Arrow1") {

            let rects = this.state.dragRect;
            console.log(rects)
            let text1 = rects[0]
            let text2 = rects[1]

            let text = `${text1} -> ${text2}: text${this.TextNum()}`

            this.props.shapeText(text)

        }
        else if (data === "Shape") {
            const text = `text${this.TextNum()} -> text${this.TextNum() + 1} `
            this.props.shapeText(text)
        } else if (data === "Participant") {
            const text = shapeJson.shape[data].text
            this.props.shapeText(`${text}${this.TextNum()}`)
        }
        else if (data === "Arrow2") {
            let rects = this.state.dragRect;
            console.log(rects)
            let text1 = rects[0]
            let text2 = rects[1]

            let text = `${text1} <- ${text2}: text${this.TextNum()}`

            this.props.shapeText(text)

        }
        else if (data === "Arrow3") {
            let rects = this.state.dragRect;
            console.log(rects)
            let text1 = rects[0]
            let text2 = rects[1]

            let text = `${text1} --> ${text2}: text${this.TextNum()}`

            this.props.shapeText(text)

        }
        else if (data === "Arrow4") {
            let rects = this.state.dragRect;
            console.log(rects)
            let text1 = rects[0]
            let text2 = rects[1]

            let text = `${text1} <-- ${text2}: text${this.TextNum()}`

            this.props.shapeText(text)

        }
        else if (data === "activate") {
            const text = `activate ${this.state.dragRect}
deactivate ${this.state.dragRect}`
            this.props.shapeText(text)
        }
        else if (data === "destroy") {
            const text = `activate ${this.state.dragRect}
destroy ${this.state.dragRect}`
            this.props.shapeText(text)
        }
        else if (data === "Loop") {
            const text = `loop
end`
            this.props.graphzhuehyuyan(text)

        }
        else if (data === "Alt") {
            const text = `alt
end`
            this.props.graphzhuehyuyan(text)
        }
        else if (data === "Opt") {
            const text = `opt
end`
            this.props.graphzhuehyuyan(text)
        }
        else {
            const text = shapeJson.shape[data].text
            this.props.shapeText(text)
            console.log(text)
        }


        // 在此處根據 `data` 做你想要的操作，例如將圖片加入到此組件中
    };
    aaa = (e) => {
        e.preventDefault();
        console.log("pp")
        const bigRect = d3.select(e.target).node();
        const Text = [];

        let line1 = bigRect.getAttribute("line1");
        let line2 = bigRect.getAttribute("line2");

        const rectline1 = d3.select(`[Line = '${line1}']`).node()
        const rectline2 = d3.select(`[Line = '${line2}']`).node()

        console.log(rectline1.getAttribute("id"))

        const text1 = d3.select(`text[id = '${rectline1.getAttribute("id")}']`).text()
        const text2 = d3.select(`text[id = '${rectline2.getAttribute("id")}']`).text()

        Text.push(text1);
        Text.push(text2);

        this.setState({ dragRect: Text })
        console.log(Text)


    }

    bbb = (e) => {
        const bigRect = d3.select(e.target).node();
        const rect = d3.select(`[Line = ${bigRect.getAttribute("Line")}]`).node();
        const text1 = d3.select(`text[id =${rect.getAttribute('id')} ]`).text()

        const Text = [];
        Text.push(text1);
        this.setState({ dragRect: Text })
        // const text1 = d3.select(`text[id = ${bigRect.getAttribute('')}]`)



    }

    /////////////////////////////////////////////////////////////////////////

    //偵測鼠標的位置
    whereMouse = (lines, x, y, rects) => {

        for (var i = 0; i < lines.length; i += 2) {
            let line1 = parseFloat(lines[i].getAttribute('x1'));
            let line2 = parseFloat(lines[i + 1].getAttribute('x1'));
            let line3 = parseFloat(lines[i].getAttribute('y1'));
            let line4 = parseFloat(lines[i].getAttribute('y2'));




            if (x > line1 && x < line2 && y > line3 && y < line4) {


                let rect1;
                let rect2;
                for (var j = 0; j < rects.length; j += 4) {
                    let ret1 = parseFloat(rects[j].getAttribute('x'));
                    let ret2 = parseFloat(rects[j + 1].getAttribute('x'));
                    let ret3 = parseFloat(rects[j + 2].getAttribute('x'));
                    let ret4 = parseFloat(rects[j + 3].getAttribute('x'));


                    if (line1 > ret1 && line2 > ret3) {
                        // console.log("dd")
                        // console.log(line1, line2)
                        // console.log(ret1, ret2, ret3, ret4)
                    }


                }
                // for (var j = 0; j < rects.length; j += 2) {
                //     console.log(j)
                //     let rect1 = rects[j].getAttribute('x');
                //     let rect2 = rects[j + 1].getAttribute('x');
                //     console.log(rect1, rect2)
                // }

            }

        }
    }

    //偵測元素的位置
    drawRect = () => {
        let container = (d3.select(this.containerRef.current)).select('svg');
        let rects = container.selectAll('rect').nodes();
        let lines = container.selectAll("[type='rectLine']").nodes();



        for (var i = 0; i < lines.length; i++) {
            if (i + 1 === lines.length) {

            } else {
                let line1 = d3.select(lines[i]);
                let line2 = d3.select(lines[i + 1]);


                let id1 = line1.attr("id")
                let id2 = line2.attr("id")

                // 獲取線條的坐標
                let x1 = parseFloat(line1.attr("x1"));
                let x2 = parseFloat(line2.attr("x1"));
                let y1 = Math.min(parseFloat(line1.attr("y1")), parseFloat(line2.attr("y1")));
                let y2 = Math.max(parseFloat(line1.attr("y2")), parseFloat(line2.attr("y2")));

                // 計算矩形的屬性
                let rectX = x1;
                let rectY = y1;
                let rectWidth = x2 - x1;
                let rectHeight = y2 - y1;

                // 在SVG中添加rect
                container.append('rect')
                    .attr('x', rectX)
                    .attr('y', rectY)
                    .attr('width', rectWidth)
                    .attr('height', rectHeight)
                    .attr('fill', '#808080')
                    // .attr('fill', 'red')
                    .attr("opacity", 0)
                    .attr('class', 'group')
                    .attr("line1", `${id1}`)
                    .attr("line2", `${id2}`)
                    .attr("pointer-events", "none")
                    .on('drop', this.aaa)

            }

        }

    }



    //為元素添加虛綫框
    DomLine = (event) => {
        event.stopPropagation();
        const clickedElement = d3.select(event.currentTarget);

        // 检查是否为 text 元素
        if (clickedElement.node().tagName === 'text') {
            return; // 如果是 text 元素，则不进行任何操作
        }
        console.log(d3_selectAll(`#rectLine_1`).node())
        const isHighlighted = clickedElement.classed('highlighted');


        if (isHighlighted) {
            // 如果元素已经被高亮，则移除高亮
            clickedElement.classed('highlighted', false);
            d3.select('#highlighted-border').remove();
            this.setState({ onclickElement: null })
        } else {
            // 添加高亮
            this.setState({ onclickElement: clickedElement })
            clickedElement.classed('highlighted', true);

            const bbox = clickedElement.node().getBBox();
            const highlightRect = d3.select(clickedElement.node().parentNode)
                .append('rect')
                .attr('id', 'highlighted-border')
                .attr('x', bbox.x - 2)
                .attr('y', bbox.y - 2)
                .attr('width', bbox.width + 4)
                .attr('height', bbox.height + 4)
                .style('fill', 'none')
                .style('stroke', 'black')
                .style('stroke-width', '2px')
                .style('stroke-dasharray', '5,5')
                .style('pointer-events', 'all') // 确保虚线框响应鼠标事件
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
            this.LineMove(clickedElement, bbox);
            function dragstarted(event) {
                d3.select(this).raise(); // 提升层级以便拖拽
            }

            function dragged(event, d) {
                // 检查d是否定义，并为其提供一个默认值
                d = d || { x: 0, y: 0 }; // 如果d是undefined，使用默认值

                const dx = event.dx;
                const dy = event.dy;
                const transform = d.transform || { x: 0, y: 0 }; // 再次检查transform属性
                transform.x += dx;
                transform.y += dy;

                // 更新元素的transform属性
                clickedElement.attr("transform", `translate(${transform.x},${transform.y})`);

                // 更新虚线框的位置
                d3.select(this).attr("x", parseFloat(d3.select(this).attr("x")) + dx)
                    .attr("y", parseFloat(d3.select(this).attr("y")) + dy);
            }
            function removeHighlight() {
                d3.selectAll('.highlighted').classed('highlighted', false);
                d3.select('#highlighted-border').remove();
                this.setState({ onclickElement: null })
            }

            function dragended(event) {
                const dragBox = d3.select('#highlighted-border');
                const boxX = parseFloat(dragBox.attr('x'));
                const boxY = parseFloat(dragBox.attr('y'));
                const boxWidth = parseFloat(dragBox.attr('width'));
                const boxHeight = parseFloat(dragBox.attr('height'));

                // const elementsInside = d3.select('svg').selectAll('*').filter(function () {
                //     // 排除 rectLine 和 node 类型的元素
                //     if (this.classList.contains('rectLine') || this.classList.contains('node') || this.classList.contains('altRect') || this.classList.contains('group')) {
                //         return false;
                //     }

                //     const bbox = this.getBBox();
                //     const insideX = bbox.x + bbox.width > boxX && bbox.x < boxX + boxWidth;
                //     const insideY = bbox.y + bbox.height > boxY && bbox.y < boxY + boxHeight;
                //     return insideX && insideY;
                // });

                // elementsInside.each(function (d, i) {
                //     console.log('框内符合条件的元素:', this);
                //     // 这里可以进行更多的操作
                // });
                removeHighlight();
            }
        }
    }


    LineMove = (clickedElement, bbox) => {
        // 边缘拖拽区域的厚度
        const edgeThickness = 6;

        const dragEnded = (event) => {
            // 获取虚线框的新位置和尺寸
            const border = d3.select('#highlighted-border');

            if (!border.empty()) {
                const x = parseFloat(border.attr('x'));
                const y = parseFloat(border.attr('y'));
                const width = parseFloat(border.attr('width'));
                const height = parseFloat(border.attr('height'));

                // 在检测虚线框内的元素之前，先移除虚线框
                border.remove();

                // 检测虚线框内的元素，同时排除没有type属性的元素、具有特定type值的元素以及点击生成虚线框的元素本身
                const elementsInside = d3.select(clickedElement.node().parentNode)
                    .selectAll('*')
                    .filter(function () {
                        // 排除没有type属性、具有特定type值的元素以及点击生成虚线框的元素
                        const typeAttr = this.getAttribute('type');
                        if (this === clickedElement.node() ||
                            typeAttr === 'node' ||
                            typeAttr === 'rectLine' ||
                            typeAttr === 'group' ||
                            typeAttr === null) {
                            return false;
                        }

                        // 检查元素是否在虚线框内
                        const elBBox = this.getBBox ? this.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
                        const insideX = elBBox.x + elBBox.width > x && elBBox.x < x + width;
                        const insideY = elBBox.y + elBBox.height > y && elBBox.y < y + height;
                        return insideX && insideY;
                    });

                // 对虚线框内的元素进行处理
                // elementsInside.each(function () {
                //     // 在这里可以对找到的元素进行处理
                //     console.log('虚线框内的元素:', this);
                // });
                console.log(elementsInside.nodes())
                this.nodesName(elementsInside)
                // 这里也可以添加移除其他拖拽相关的元素的代码
                // ...
            }


        }


        // 创建拖拽行为生成函数
        function createDragBehavior(updateFunction) {
            return d3.drag()
                .on('drag', function (event) {
                    updateFunction(event.dx, event.dy);
                });
        }

        // 为上边缘创建拖拽行为
        const dragTop = createDragBehavior(function (dx, dy) {
            const newY = parseFloat(d3.select('#highlighted-border').attr('y')) + dy;
            const newHeight = parseFloat(d3.select('#highlighted-border').attr('height')) - dy;
            if (newHeight > 0) {
                d3.select('#highlighted-border').attr('y', newY).attr('height', newHeight);
            }
        });

        // 为下边缘创建拖拽行为
        const dragBottom = createDragBehavior(function (dx, dy) {
            const newHeight = parseFloat(d3.select('#highlighted-border').attr('height')) + dy;
            if (newHeight > 0) {
                d3.select('#highlighted-border').attr('height', newHeight);
            }
        });

        // 为左边缘创建拖拽行为
        const dragLeft = createDragBehavior(function (dx, dy) {
            const newX = parseFloat(d3.select('#highlighted-border').attr('x')) + dx;
            const newWidth = parseFloat(d3.select('#highlighted-border').attr('width')) - dx;
            if (newWidth > 0) {
                d3.select('#highlighted-border').attr('x', newX).attr('width', newWidth);
            }
        });

        // 为右边缘创建拖拽行为
        const dragRight = createDragBehavior(function (dx, dy) {
            const newWidth = parseFloat(d3.select('#highlighted-border').attr('width')) + dx;
            if (newWidth > 0) {
                d3.select('#highlighted-border').attr('width', newWidth);
            }
        });

        // 应用拖拽行为到四个边缘
        applyDragBehavior('top', dragTop);
        applyDragBehavior('bottom', dragBottom);
        applyDragBehavior('left', dragLeft);
        applyDragBehavior('right', dragRight);

        // 为边缘应用拖拽行为的函数
        function applyDragBehavior(edge, dragBehavior) {
            const parent = d3.select(clickedElement.node().parentNode);
            let x = 0, y = 0, width = 0, height = 0, cursor = '';

            switch (edge) {
                case 'top':
                    x = bbox.x;
                    y = bbox.y - edgeThickness / 2;
                    width = bbox.width;
                    height = edgeThickness;
                    cursor = 'ns-resize';
                    break;
                case 'bottom':
                    x = bbox.x;
                    y = bbox.y + bbox.height - edgeThickness / 2;
                    width = bbox.width;
                    height = edgeThickness;
                    cursor = 'ns-resize';
                    break;
                case 'left':
                    x = bbox.x - edgeThickness / 2;
                    y = bbox.y;
                    width = edgeThickness;
                    height = bbox.height;
                    cursor = 'ew-resize';
                    break;
                case 'right':
                    x = bbox.x + bbox.width - edgeThickness / 2;
                    y = bbox.y;
                    width = edgeThickness;
                    height = bbox.height;
                    cursor = 'ew-resize';
                    break;
            }

            parent.append('rect')
                .attr('className', 'drag-edge')
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'transparent')
                .style('cursor', cursor)
                .call(dragBehavior.on('end', dragEnded));// 添加拖拽结束的事件处理器
        }
        function removeHighlight() {
            d3.selectAll('.highlighted').classed('highlighted', false);
            d3.select('#highlighted-border').remove();
            // 移除拖拽边缘元素和事件处理器
            d3.selectAll('.drag-edge').remove();
        }




    }

    nodesName = (nodes) => {
        const element = nodes;
        const selectElement = this.state.onclickElement.node().id
        console.log(selectElement)
        const nodesType = [];

        element.each(function () {
            const id = this.id
            if (!nodesType.includes(id)) {
                // 如果不存在，則添加到陣列中
                if (!id.includes(`${selectElement}`)) {
                    nodesType.push(id);
                }

            } else {

            }
        });
        const clicknode = d3_selectAll(`#${selectElement}`).nodes().map(node => d3.select(node).text());

        const texts1 = [];
        for (var i = 0; i < nodesType.length; i++) {
            const id = nodesType[i];

            if (id.includes("edge")) {
                const element = d3_selectAll(`#${id}`).nodes()
                const texts = element.map(node => d3.select(node).text());
                console.log(texts)
                const test1 = texts[2]

                texts1.push(test1);
                // this.props.graphzhuehyuyan2(test1, test2, test3, clicknode[2])
            }



        }
        this.props.graphzhuehyuyan2(texts1, clicknode[2])
        console.log(texts1)
    }









    render() {
        return (
            <div
                id="editDiv"
                ref={this.containerRef}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            >
                {this.state.textDoubleClick && (
                    <input
                        ref={this.inputRef}
                        type="text"
                        style={{
                            position: 'absolute',
                            top: `${this.state.inputPosition.x}px`,
                            left: `${this.state.inputPosition.y}px`,
                            width: '41px'
                        }}
                        onKeyDown={this.inputHandleKeyDown}
                    ></input>
                )

                }
            </div>

        );
    }
}

export default Graph;









