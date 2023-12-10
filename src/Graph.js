import React, { useState } from 'react';
import { select as d3_select } from 'd3-selection';
import { selectAll as d3_selectAll } from 'd3-selection';
import 'd3-graphviz';
import * as d3 from 'd3';
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


import shapeJson from "./shape.json";
import DownloadButton from './DownLoad';
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
            ifElse: false,
            ifElseText: "",
            svgDom: [],
            closstLeft: null,
            closstRight: null,
            closstTop: null,
            closstBottom: null,

            showContextMenu: false,
            xPos: 0,
            yPos: 0
        };

        this.dragging = false;
        this.img = null;
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

            const svgAima = this.state.svgContent;

            const container = d3.select(this.containerRef.current);


            const tempContainer = d3.create("div").html(svgAima);
            const svgElement = tempContainer.select("svg");
            console.log(svgElement.node())
            container.on('contextmenu', (event) => {
                event.preventDefault();
                console.log({ event: event })
                this.setState({
                    showContextMenu: true,
                    xPos: event.pageX,
                    yPos: event.pageY
                });
                // 假設您的ContextMenuTrigger的id是'svg_context_menu'
                this.contextMenuTrigger.collect("svg_context_menu");
            });


            svgElement.attr("preserveAspectRatio", `xMidYMid meet`);
            let currentStyle = svgElement.attr("style") || "";

            currentStyle = currentStyle.replace(/width:\s*\d+\s*px;/, `width:${x};`);
            currentStyle = currentStyle.replace(/height:\s*\d+\s*px;/, `height: ${y};`);

            // Step 4: Set the modified style back to the SVG element
            svgElement.attr("style", currentStyle);
            this.interval = setInterval(() => {
                this.reMakeAllDom(container);
                this.getDomInEditor(container);
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
        this.setState({ svgDom: allElements.nodes() })
        const nodes = allElements.nodes();
        const EditorText = this.props.EditorText;
        let num = 1;
        for (var i = 3; i < nodes.length; i += num) {
            const node = nodes[i];
            if (node.nodeName.toLowerCase() === "line") {
                //自己指向自己的箭頭

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
                        else if ((nodes[i].nodeName.toLowerCase() === "line" && nodes[i + 1].nodeName.toLowerCase() === "line" && nodes[i + 2].nodeName.toLowerCase() === "line" && nodes[i + 3].nodeName.toLowerCase() === "polygon")) {
                            const numNode = this.nodeType()

                            if ((nodes[i].nodeName.toLowerCase() === "line" && nodes[i + 1].nodeName.toLowerCase() === "line" && nodes[i + 2].nodeName.toLowerCase() === "line" && nodes[i + 3].nodeName.toLowerCase() === "polygon" && nodes[i + 4].nodeName.toLowerCase() === "text")) {
                                num = 5;
                                d3_select(nodes[i])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 1])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 2])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 3])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 4])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")

                            } else {

                                num = 4
                                d3_select(nodes[i])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 1])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 2])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
                                d3_select(nodes[i + 3])
                                    .attr("id", `selfToself_${numNode}`)
                                    .attr("type", "selfToself")
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
                    console.log(error)
                }

            }

            //node
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
            //普通箭頭
            if (nodes[i].nodeName.toLowerCase() === "polygon") {

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

            //特殊node
            if (node.nodeName.toLowerCase() === "text") {

                const numNode = this.nodeType()

                try {
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

                } catch (error) {
                    console.log(error)
                }




            }
            else if (nodes[i].nodeName.toLowerCase() === "path" && nodes[i + 1].nodeName.toLowerCase() === "rect" && nodes[i + 2].nodeName.toLowerCase() === "text") {
                const numNode = this.nodeType()

                if (nodes[i + 2].textContent === "loop") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Loop")

                    d3_select(nodes[i + 1])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Loop")

                    d3_select(nodes[i + 2])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Loop")
                }
                else if (nodes[i + 2].textContent === "alt") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Alt")

                    d3_select(nodes[i + 1])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Alt")

                    d3_select(nodes[i + 2])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Alt")
                }
                else if (nodes[i + 2].textContent === "opt") {
                    num = 3
                    d3_select(nodes[i])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Opt")

                    d3_select(nodes[i + 1])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Opt")

                    d3_select(nodes[i + 2])
                        .attr("id", `altesle_${numNode}`)
                        .attr("type", "Opt")
                }
                else {
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

            else if (nodes[i].nodeName.toLowerCase() === "path" && nodes[i + 1].nodeName.toLowerCase() === "path" && nodes[i + 2].nodeName.toLowerCase() === "text") {
                const numNode = this.nodeType();


                if (nodes[i + 3].nodeName.toLowerCase() === "text") {
                    const Text = EditorText.split("\n")
                    const nodeIndex = Text.findIndex(line => line.includes("a note"));
                    const endNodeIndex = Text.findIndex(line => line.includes("end note"));

                    if (nodeIndex !== -1 && endNodeIndex !== -1 && endNodeIndex > nodeIndex) {
                        // 計算 "a note" 和 "end note" 之間的元素數量
                        const str = endNodeIndex - nodeIndex;

                        console.log(str);
                        num = str + 3;

                        d3_select(nodes[i])
                            .attr("id", `note_${numNode}`)
                            .attr("type", "note")

                        d3_select(nodes[i + 1])
                            .attr("id", `note_${numNode}`)
                            .attr("type", "note")

                        d3_select(nodes[i + 2])
                            .attr("id", `note_${numNode}`)
                            .attr("type", "note")

                        // 處理 "a note" 和 "end note" 之間的每個元素
                        for (var j = 0; j < str; j++) {
                            console.log("??")
                            d3_select(nodes[i + j + 3])  // 確保選擇正確的節點
                                .attr("id", `note_${numNode}`)
                                .attr("type", "note");
                        }
                    } else {
                        // "a note" 和 "end note" 沒有找到或者它們的順序不正確
                        console.log("未找到或順序不正確");
                    }



                } else {

                    num = 3;
                    d3_select(nodes[i])
                        .attr("id", `note_${numNode}`)
                        .attr("type", "note")

                    d3_select(nodes[i + 1])
                        .attr("id", `note_${numNode}`)
                        .attr("type", "note")

                    d3_select(nodes[i + 2])
                        .attr("id", `note_${numNode}`)
                        .attr("type", "note")
                }


            }


        }
        this.linkRectLineAndRect();
        this.interval1 = setInterval(() => {
            this.drawRect();
            this.test(container);
            clearInterval(this.interval1);
        }, 1);



    }
    getDomInEditor = (container) => {
        let container1 = container;
        let Dom = container.selectAll('*').nodes();
        let allDomId = [];
        for (var i = 0; i < Dom.length; i++) {
            const id = Dom[i].id;
            if (allDomId.includes(id)) {

            } else {
                allDomId.push(id)
            }

        }

    }
    createGroupNum = () => {
        this.setState(prevState => ({
            groupNum: prevState.groupNum + 1
        }));
        return this.state.groupNum;
    }




    linkRectLineAndRect = () => {
        const container = (d3.select(this.containerRef.current)).select('svg');
        const rectLines = container.selectAll("[type='rectLine']").nodes();
        const rectNodes = container.selectAll("rect[type='node']").nodes();


        for (var i = 0; i < rectLines.length; i++) {
            const line = rectLines[i].getAttribute("id")
            let rect1 = rectNodes[i * 2];
            let rect2 = rectNodes[i * 2 + 1];
            console.log(d3_select(rect1).node())
            d3_select(rect1).attr("Line", `${line}`)
            d3_select(rect2).attr("Line", `${line}`)

            // this.createGroup(rect1, rect2, line, container);

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




        }

    }
    //畫面上的監聽器
    test = (container) => {
        //雙擊
        container.selectAll("text").on("dblclick", this.textHandleDoubleClick.bind(this));
        container.selectAll('[type="Loop"]').on("dblclick", this.ifelsepDbClick.bind(this));
        container.selectAll('[type="Alt"]').on("dblclick", this.ifelsepDbClick.bind(this));
        container.selectAll('[type="Opt"]').on("dblclick", this.ifelsepDbClick.bind(this));
        //單擊

        container.on("click", this.resetAllBoolean.bind(this));
        container.selectAll("svg").on("wheel", this.mouseWheel.bind(this));
        container.selectAll("*").on("click", this.DomLine);

        //右鍵

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







    textHandleDoubleClick = (element) => {
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

    sendDataToParent = (e) => {
        const editortext = this.props.EditorText.split('\n');
        console.log(editortext)
        console.log(this.state.beforeText)
        console.log(e)
        //先找到位置
        for (var i = 0; i < editortext.length; i++) {
            const text  = editortext.split(':')


        }


    }
    //當輸入完后點擊enter
    inputHandleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.setState({
                textDoubleClick: false
            })
            if (event.target.value === "") {
                console.log("kongkong");
            } else if (this.state.ifElse) {
                this.props.IfElsefunction(this.state.ifElseText, ` ${event.target.value}`, 1)
            } else {

                console.log(event.target.value)
                this.sendDataToParent(event.target.value)
            }

        }
    }
    //





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

        if (data === "Arrow1") {
            let rects = this.state.dragRect;
            let text1 = rects[0]
            let text2 = rects[1]
            let str = this.props.EditorText.split('\n')

            if (str.includes(`participant ${text1}`)) {
                if (str.includes(`participant ${text2}`)) {
                    str = str.filter(item => item !== `participant ${text2}`);
                }


                let newStr = str.map(item => {
                    if (item === `participant ${text1}`) {
                        return `${text1} -> ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else if (str.includes(`participant ${text2}`)) {
                if (str.includes(`participant ${text1}`)) {
                    str = str.filter(item => item !== `participant ${text1}`);
                }
                let newStr = str.map(item => {
                    if (item === `participant ${text2}`) {
                        return `${text1} -> ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else {
                if (text1 != undefined || text2 != undefined) {

                    let text = `${text1} -> ${text2}: text${this.TextNum()}`
                    this.props.shapeText(text)
                }

            }


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
            let text1 = rects[0]
            let text2 = rects[1]
            let str = this.props.EditorText.split('\n')

            if (str.includes(`participant ${text1}`)) {
                if (str.includes(`participant ${text2}`)) {
                    str = str.filter(item => item !== `participant ${text2}`);
                }


                let newStr = str.map(item => {
                    if (item === `participant ${text1}`) {
                        return `${text1} <- ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else if (str.includes(`participant ${text2}`)) {
                if (str.includes(`participant ${text1}`)) {
                    str = str.filter(item => item !== `participant ${text1}`);
                }
                let newStr = str.map(item => {
                    if (item === `participant ${text2}`) {
                        return `${text1} <- ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else {
                if (text1 != undefined || text2 != undefined) {

                    let text = `${text1} <- ${text2}: text${this.TextNum()}`
                    this.props.shapeText(text)
                }

            }




        }
        else if (data === "Arrow3") {
            let rects = this.state.dragRect;
            let text1 = rects[0]
            let text2 = rects[1]
            let str = this.props.EditorText.split('\n')

            if (str.includes(`participant ${text1}`)) {
                if (str.includes(`participant ${text2}`)) {
                    str = str.filter(item => item !== `participant ${text2}`);
                }


                let newStr = str.map(item => {
                    if (item === `participant ${text1}`) {
                        return `${text1} --> ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else if (str.includes(`participant ${text2}`)) {
                if (str.includes(`participant ${text1}`)) {
                    str = str.filter(item => item !== `participant ${text1}`);
                }
                let newStr = str.map(item => {
                    if (item === `participant ${text2}`) {
                        return `${text1} --> ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else {
                if (text1 != undefined || text2 != undefined) {

                    let text = `${text1} --> ${text2}: text${this.TextNum()}`

                    this.props.shapeText(text)
                }

            }



        }
        else if (data === "Arrow4") {
            let rects = this.state.dragRect;
            let text1 = rects[0]
            let text2 = rects[1]
            let str = this.props.EditorText.split('\n')

            if (str.includes(`participant ${text1}`)) {
                if (str.includes(`participant ${text2}`)) {
                    str = str.filter(item => item !== `participant ${text2}`);
                }


                let newStr = str.map(item => {
                    if (item === `participant ${text1}`) {
                        return `${text1} <-- ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else if (str.includes(`participant ${text2}`)) {
                if (str.includes(`participant ${text1}`)) {
                    str = str.filter(item => item !== `participant ${text1}`);
                }
                let newStr = str.map(item => {
                    if (item === `participant ${text2}`) {
                        return `${text1} <-- ${text2}: text${this.TextNum()}`;
                    } else {
                        return item;
                    }
                });

                let newText = newStr.join("\n");
                this.props.witreToEdit(newText);
            } else {
                if (text1 != undefined || text2 != undefined) {

                    let text = `${text1} <-- ${text2}: text${this.TextNum()}`

                    this.props.shapeText(text)
                }

            }



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
        else if (data === "Actor") {
            const text = `actor Actor${this.TextNum()}`;
            this.props.shapeText(text)

        }
        else if (data === "Boundary") {
            const text = `boundary Boundary${this.TextNum()}`;
            this.props.shapeText(text)
        }
        else if (data === "Control") {
            const text = `control Control${this.TextNum()}`;
            this.props.shapeText(text)
        }
        else if (data === "Entity") {
            const text = `entity Entity${this.TextNum()}`;
            this.props.shapeText(text)
        }
        else if (data === "Database") {
            const text = `database Database${this.TextNum()}`;
            this.props.shapeText(text)
        }
        else if (data === "Collections") {
            const text = `collections Collections${this.TextNum()}`;
            this.props.shapeText(text)
        }
        else if (data === "Queue") {
            const text = `queue Queue${this.TextNum()}`;
            this.props.shapeText(text)
        }

        else {
            const text = shapeJson.shape[data].text
            this.props.shapeText(text)

        }


        // 在此處根據 `data` 做你想要的操作，例如將圖片加入到此組件中
    };

    //////
    //這裏處理箭頭托拽
    aaa = (e) => {
        console.log("zheli1")
        e.preventDefault();
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

    }

    /////////////////////////////////////////////////////////////////////////


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


    removeResizeHandles = () => {
        d3.selectAll('.resize-handle').remove();
    };

    //為元素添加虛綫框
    DomLine = (event) => {
        event.stopPropagation();
        const clickedElement = d3.select(event.currentTarget);
        const container = this.state.svgDom;
        let text = this.props.EditorText.split('\n')

        try {
            // 检查是否为 text 元素
            if (clickedElement.node().tagName === 'text') {
                return; // 如果是 text 元素，则不进行任何操作
            }

            const isHighlighted = clickedElement.classed('highlighted');


            if (isHighlighted) {
                // 如果元素已经被高亮，则移除高亮
                clickedElement.classed('highlighted', false);
                d3.select('#highlighted-border').remove();
                d3.selectAll('.resize-handle').remove();
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
                        .on("end", (e) => dragended(e)));



                const handleSize = 5; // 控制点的大小
                const handleRadius = handleSize / 2; // 控制点的半径

                // 确保控制点的中心位于边界框的角上
                const corners = [
                    { x: bbox.x - handleRadius - 1, y: bbox.y - handleRadius - 1, cursor: 'nwse-resize' }, // 左上角
                    { x: bbox.x + bbox.width - handleRadius + 1, y: bbox.y - handleRadius - 1, cursor: 'nesw-resize' }, // 右上角
                    { x: bbox.x - handleRadius - 1, y: bbox.y + bbox.height - handleRadius + 1, cursor: 'nesw-resize' }, // 左下角
                    { x: bbox.x + bbox.width - handleRadius + 1, y: bbox.y + bbox.height - handleRadius + 1, cursor: 'nwse-resize' } // 右下角
                ];

                corners.forEach((corner, index) => {
                    d3.select(clickedElement.node().parentNode)
                        .append('circle')
                        .attr('cx', corner.x + handleRadius) // 加上半径以定位中心
                        .attr('cy', corner.y + handleRadius)
                        .attr('r', handleRadius)
                        .style('opacity', 0)
                        .attr('class', `resize-handle resize-handle-${index}`)
                        .style('cursor', corner.cursor) // 使用指定的光标样式
                        .call(d3.drag()
                            // 这里可以添加拖拽事件处理
                            // ...
                        );
                });

                this.LineMove(clickedElement, bbox);
                function dragstarted(event) {
                    d3.select(this).raise(); // 提升层级以便拖拽
                }
                function makeLine(element, d, event) {
                    const bbox = d3.select(element).node().getBBox();
                    const currentX = bbox.x + bbox.width / 2;
                    const currentY = bbox.y + bbox.height / 2;
                    const elementType = d3.select(clickedElement.node()).attr('type');  // 获取自定义属性 'type'

                    // 获取 SVG 容器的尺寸
                    const svgWidth = d3.select('svg').node().clientWidth;
                    const svgHeight = d3.select('svg').node().clientHeight;

                    // 选择或创建辅助线
                    let line = d3.select('#auxiliary-line');
                    if (line.empty()) {
                        line = d3.select('svg')
                            .append('line')
                            .attr('id', 'auxiliary-line')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2);
                    }

                    // 根据 'type' 属性值绘制辅助线
                    if (elementType === 'node') {
                        line.attr('x1', currentX)
                            .attr('y1', -svgHeight)
                            .attr('x2', currentX)
                            .attr('y2', svgHeight);

                        // 查找左右两侧最近的元素

                    } else {
                        line.attr('x1', 0)
                            .attr('y1', currentY)
                            .attr('x2', svgWidth)
                            .attr('y2', currentY);

                        // 查找上下最近的元素

                    }
                }

                const findClosestElements = (positionX, positionY) => {

                    const elements = container; // 確保這裡的 container 是元素集合
                    let closestLeft = null, closestRight = null;
                    let closestTop = null, closestBottom = null;
                    let minLeftDistance = Infinity, minRightDistance = Infinity;
                    let minTopDistance = Infinity, minBottomDistance = Infinity;

                    elements.slice(3).forEach(el => {
                        // 檢查元素是否是 rect 類型且 type 屬性為 'node'

                        const bbox = el.getBBox();
                        const elXCenter = bbox.x + bbox.width / 2;
                        const elYCenter = bbox.y + bbox.height / 2;

                        // 水平方向判斷（竪線時）
                        if (positionX !== null) {

                            if (el.tagName.toLowerCase() === 'rect' && el.getAttribute('type') === 'node') {

                                if (elXCenter < positionX) { // 元素在輔助線左側

                                    const distance = positionX - elXCenter;
                                    if (distance < minLeftDistance) {
                                        minLeftDistance = distance;
                                        closestLeft = el;
                                    }

                                } else if (elXCenter > positionX) { // 元素在輔助線右側
                                    const distance = elXCenter - positionX;
                                    if (distance < minRightDistance) {
                                        minRightDistance = distance;
                                        closestRight = el;
                                    }


                                }
                            }
                        }

                        // 垂直方向判斷（橫線時）
                        if (positionY !== null) {


                            if (elYCenter < positionY) { // 元素在輔助線上方
                                const distance = positionY - elYCenter;
                                if (distance < minTopDistance) {
                                    minTopDistance = distance;
                                    closestTop = el;
                                }
                            } else if (elYCenter > positionY) { // 元素在輔助線下方
                                const distance = elYCenter - positionY;
                                if (distance < minBottomDistance) {
                                    minBottomDistance = distance;
                                    closestBottom = el;
                                }
                            }

                        }

                    });

                    // 輸出最近的元素
                    if (positionX !== null) {
                        this.setState({
                            closstLeft: closestLeft,
                            closstRight: closestRight
                        })




                    }

                    if (positionY !== null) {

                        this.setState({
                            closstTop: closestTop,
                            closstBottom: closestBottom,
                        })

                    }
                }





                // ... 其他函数保持不变

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

                    makeLine(this, { dx: event.dx, dy: event.dy }, event);
                }


                function removeHighlight() {
                    d3.selectAll('.highlighted').classed('highlighted', false);
                    d3.select('#highlighted-border').remove();
                    d3.selectAll('.resize-handle').remove();
                    // this.setState({ onclickElement: null })
                }

                const dragended = (event) => {
                    const dragBox = d3.select('#highlighted-border');
                    const boxX = parseFloat(dragBox.attr('x'));
                    const boxY = parseFloat(dragBox.attr('y'));
                    const boxWidth = parseFloat(dragBox.attr('width'));
                    const boxHeight = parseFloat(dragBox.attr('height'));
                    d3.select('#auxiliary-line').remove();

                    const isVertical = d3.select(clickedElement.node()).attr('type') === 'node';
                    const positionX = isVertical ? boxX + boxWidth / 2 : null;  // 如果是垂直辅助线，则计算 positionX
                    const positionY = !isVertical ? boxY + boxHeight / 2 : null; // 如果是水平辅助线，则计算 positionY
                    const id = clickedElement.node().getAttribute('id');
                    const dom = d3_select(`text[id=${id}]`).node().textContent;
                    const str = `participant ${dom}`


                    if (text.includes(str)) {
                        findClosestElements(positionX, positionY);
                    } else if (positionX == null) {
                        findClosestElements(positionX, positionY);
                    }


                    removeHighlight();
                    this.moveDom(str, clickedElement)
                }

            }


        } catch (error) {

        }

    }
    moveDom = (dom, clickNode) => {
        //竪綫輔助綫
        let str = this.props.EditorText.split("\n");
        console.log(this.state.closstLeft, this.state.closstRight, this.state.closstTop, this.state.closstBottom)
        if (this.state.closstLeft != null && this.state.closstRight != null) {

            const Dom1 = this.state.closstLeft.getAttribute("id")
            const Dom2 = this.state.closstRight.getAttribute("id")

            let nodeName1 = d3.select(`text[id = ${Dom1}]`).node().textContent
            let nodeName2 = d3.select(`text[id = ${Dom2}]`).node().textContent


            str = str.filter(item => item !== dom);
            let index1 = str.findIndex(item => item.includes(nodeName1));
            let index2 = str.findIndex(item => item.includes(nodeName2));

            if (index1 !== -1 && index2 !== -1 && index1 < index2) {
                // 在 text2 之前插入 text3
                str.splice(index2, 0, dom);
            }
            const newText = str.join("\n")
            this.props.witreToEdit(newText)
            this.setState({
                closstLeft: null,
                closstRight: null,
                closstTop: null,
                closstBottom: null
            })

        } else if (this.state.closstLeft != null && this.state.closstRight == null) {
            str = str.filter(item => item !== dom);
            str.splice(str.length - 1, 0, dom);
            const newText = str.join("\n")
            this.props.witreToEdit(newText)

            this.setState({
                closstLeft: null,
                closstRight: null,
                closstTop: null,
                closstBottom: null
            })
        }
        //橫向輔助綫
        else if (this.state.closstTop != null && this.state.closstBottom != null) {

            const Dom1 = this.state.closstTop.getAttribute("id")
            const Dom2 = this.state.closstBottom.getAttribute("id")

            let id = clickNode.node().getAttribute("id").split("_")
            let allNode = d3.selectAll(`[id^=${id[0]}]`).nodes()
            //找到帶有id帶有ClickNode的
            let node = [];
            allNode.forEach(e => {
                let id = e.getAttribute("id");
                if (!node.includes(id)) {
                    node.push(id)
                }

            })
            //然後判斷屬於第幾個
            let index = this.findIndexInArray(node, clickNode.node().getAttribute("id"));
            //然後去找

            let text = d3.select(`text[id="${clickNode.node().getAttribute("id")}"]`).node().textContent
            let indexOfText = this.findNthOccurrence(str, clickNode.node().getAttribute("id"), index);

            //獲取所有altrect元素
            let allAltRect = d3.selectAll(`[id^=altRect]`).nodes()
            //獲取所有altelse元素
            let allAltelse = d3.selectAll(`[id^=altesle]`).nodes()
            //過濾重複元素
            let newallAltelse = [];
            allNode.forEach(e => {
                let id = e.getAttribute("id");
                if (!newallAltelse.includes(id)) {
                    newallAltelse.push(id)
                }

            })



            if (text === "loop" || text === "alt" || text === "opt") {
                const x = this.findMatchingLoops(str, text, index, "end");
                const y = x[index - 1]



                if (this.state.closstTop.getAttribute("id").includes("altRect")) {
                    let index = this.findIndexInArray(allAltRect, newallAltelse);
                    console.log(index)

                } else if (this.state.closstBottom.getAttribute("id").includes("altRect")) {

                } else {
                    const x = this.findMatchingLoops(str, text, index, "end");
                    let text1 = d3.select(`text[id="${Dom1}"]`).node().textContent;
                    let text2 = d3.select(`text[id="${Dom2}"]`).node().textContent;
                    let arr = str

                    let start = x[index - 1].start;
                    let end = x[index - 1].end;


                    let index1 = arr.findIndex(item => item.includes(text1));
                    let index2 = arr.findIndex(item => item.includes(text2));

                    const maxIndex = Math.max(index1, index2);
                    const minIndex = Math.min(index1, index2);

                    // 先保存原本的值
                    const el1 = arr[start];
                    const el2 = arr[end];

                    // 從數組中刪除元素
                    if (start < end) {
                        arr.splice(end, 1);
                        arr.splice(start, 1);
                    } else {
                        arr.splice(start, 1);
                        arr.splice(end, 1);
                    }

                    // 調整索引
                    let newMaxIndex = maxIndex - (maxIndex > start) - (maxIndex > end);
                    let newMinIndex = minIndex - (minIndex > start) - (minIndex > end);

                    // 插入元素
                    if (newMaxIndex === newMinIndex) {
                        // 如果插入位置相同，則先插入 el2，然後是 el1
                        arr.splice(newMaxIndex + 1, 0, el2, el1);
                    } else {
                        // 插入 el2 到最大索引處
                        arr.splice(newMaxIndex, 0, el2);
                        // 插入 el1 到最小索引處
                        arr.splice(newMinIndex + 1, 0, el1);
                    }
                    let newStr = arr.join("\n")
                    this.props.witreToEdit(newStr)
                }

            } else {

                const x = this.findMatchingLoops(str, text, index, null);

            }

            let newStr = str;


            this.setState({
                closstLeft: null,
                closstRight: null,
                closstTop: null,
                closstBottom: null
            })

        }

    }

    ////
    findMatchingLoops(code, text1, num, text2) {
        const lines = code
        const loopStack = [];
        const loopEndPairs = [];

        lines.forEach((line, index) => {
            if (line.includes(text1)) {
                loopStack.push(index);
            } else if (text2 != null) {
                if (line.includes(text2) && loopStack.length > 0) {
                    const start = loopStack.pop();
                    loopEndPairs.push({ start: start, end: index });
                }


            }
        });

        return loopEndPairs;
    }


    ////////////
    //獲取字串在EditorText中的index
    findNthOccurrence(text, text1, num) {
        let count = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i].includes(text1)) {
                count++;
                if (count === num) {
                    return i;
                }
            }
        }
        return -1; // 或者可以根據需要返回其他錯誤提示
    }
    findIndexInArray(text, text1) {

        return text.indexOf(text1) + 1;
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
                })
                .on('end', dragEnded);
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
                .attr('class', 'drag-edge') // 修改这里
                .attr('x', x)
                .attr('y', y)
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'transparent')
                .style('cursor', cursor)
                .call(dragBehavior.on('end', dragEnded));

        }
        function removeHighlight() {
            d3.selectAll('.highlighted').classed('highlighted', false);
            d3.select('#highlighted-border').remove();
            // 移除拖拽边缘元素和事件处理器
            d3.selectAll('.drag-edge').remove();
        }

        function createCornerDragBehavior(cornerIndex) {
            return d3.drag()
                .on('drag', function (event) {
                    // 获取虚线框的新位置和尺寸
                    const border = d3.select('#highlighted-border');
                    let x = parseFloat(border.attr('x'));
                    let y = parseFloat(border.attr('y'));
                    let width = parseFloat(border.attr('width'));
                    let height = parseFloat(border.attr('height'));

                    // 根据拖动的角落圆点调整虚线框的位置和尺寸
                    if (cornerIndex === 0) { // 左上角
                        const newWidth = width - event.dx;
                        const newHeight = height - event.dy;
                        border.attr('x', x + event.dx).attr('y', y + event.dy)
                            .attr('width', newWidth > 0 ? newWidth : 0)
                            .attr('height', newHeight > 0 ? newHeight : 0);
                    } else if (cornerIndex === 1) { // 右上角
                        const newHeight = height - event.dy;
                        border.attr('y', y + event.dy)
                            .attr('width', width + event.dx)
                            .attr('height', newHeight > 0 ? newHeight : 0);
                    } else if (cornerIndex === 2) { // 左下角
                        const newWidth = width - event.dx;
                        border.attr('x', x + event.dx)
                            .attr('width', newWidth > 0 ? newWidth : 0)
                            .attr('height', height + event.dy);
                    } else if (cornerIndex === 3) { // 右下角
                        border.attr('width', width + event.dx)
                            .attr('height', height + event.dy);
                    }
                })
                .on('end', dragEnded);
        }

        // 为四个角落的圆点应用拖拽行为
        d3.selectAll('.resize-handle').each(function (_, i) {
            d3.select(this).call(createCornerDragBehavior(i));
        });


    }


    nodesName = (nodes) => {
        const element = nodes;
        const selectElement = this.state.onclickElement.node().id
        const nodesType = [];

        element.each(function () {
            const id = this.id
            if (!nodesType.includes(id)) {
                // 如果不存在，則添加到陣列中
                console.log(id.includes('altRect_'))
                if (!id.includes(`${selectElement}`)) {
                    if (id.includes('altRect_')) {

                    } else {
                        nodesType.push(id);
                    }

                }

            } else {

            }
        });
        //點擊的元素
        const clicknode = d3_selectAll(`#${selectElement}`).nodes().map(node => d3.select(node).text());
        const texts1 = [];

        //判斷有多少個altrect
        const altRect = d3_selectAll('[type="altRect"]').nodes();
        const ifelse = d3.selectAll('[id^="altesle_"]').nodes();
        console.log(altRect)
        console.log(ifelse)


        const editorText = this.props.EditorText.split("\n");
        this.EditorTextNode(selectElement, nodesType, editorText)
        // for (var i = 0; i < nodesType.length; i++) {
        //     const id = nodesType[i];
        //     console.log(id)
        //     if (id.includes("edge")) {
        //         const element = d3_selectAll(`#${id}`).nodes()
        //         const texts = element.map(node => d3.select(node).text());
        //         console.log(texts)
        //         const test1 = texts[2]

        //         texts1.push(test1);
        //         // this.props.graphzhuehyuyan2(test1, test2, test3, clicknode[2])
        //     } else if (id.includes("altesle")) {
        //         const element = d3_selectAll(`#${id}`).nodes()
        //         console.log(element)
        //         const texts = element.map(node => d3.select(node).text());
        //         console.log(texts)
        //         const test1 = texts[2]
        //         texts1.push(test1)
        //     }



        // }
        // this.props.graphzhuehyuyan2(texts1, clicknode[2])
        // console.log(texts1)
    }
    // fetchParsedData = async (data) => {
    //     try {
    //         const requestData = data;

    //         // 使用axios发送异步POST请求
    //         const response = await axios.post('http://localhost:3000/parse-plantuml', requestData, {
    //             headers: {
    //                 'Content-Type': 'text/plain'
    //             }
    //         });

    //         console.log({ result: response.data });
    //     } catch (error) {
    //         console.log({ error });
    //     }
    // }


    //判斷框内的元素要如何定義
    //點擊的元素，框内的元素，editor字串
    EditorTextNode = (clicknode, nodesType, editorText) => {
        let text = editorText;
        let ifElse = ["loop", "alt", "opt"];
        let end = ["end"];
        //判斷有多少個ifelse
        let totalCount = ifElse.reduce((count, targetString) => {
            return count + text.filter(item => item === targetString).length;
        }, 0);
        let totalCount1 = end.reduce((count, targetString) => {
            return count + text.filter(item => item === targetString).length;
        }, 0);
        //
        //////
        //判斷我點擊的是第幾個
        const ifelse = d3.selectAll('text[id^="altesle_"]').nodes();
        //這是我點擊的元素的index
        const index = ifelse.findIndex(element => element.id === clicknode);
        //
        const Dom = ifelse[index].textContent;
        console.log(Dom)

        console.log(clicknode)
        console.log(editorText)
        console.log(nodesType)
        //判斷editorText要如何變更
        const edittext = editorText;
        const num = 0;
        let edgecount = [];
        //判斷edge在text中的位置
        for (var i = 0; i < nodesType.length; i++) {
            let id = nodesType[i];

            if (id.includes("edge_")) {
                let Dom = d3.selectAll('polygon[id^="edge_"]').nodes();
                const index = Dom.findIndex(element => element.id === id) + 1;
                edgecount.push(index)
            } else if (id.includes("altesle_")) {
                let Dom = d3.selectAll('rect[id^="altesle_"]').nodes();
                const { index1, index2 } = this.indTextIndices();
                edgecount.push(index1, index2)
            }
        }

        //點擊的是第幾個
        console.log(index)
        //框住的元素
        console.log(edgecount)
        const { text1Index, text2Index } = this.findTextIndices(text, Dom, "end", index + 1);
        console.log(text, text1Index, text2Index, text1Index)
        const newStr = this.restructureArray(text, text1Index, text2Index, edgecount);
        console.log(newStr)
        this.props.witreToEdit(newStr)


        //
    }


    //根據框住的元素判斷Editor要怎麽寫
    //editor字串，位置，元素
    reWriteEditorText = (text, num, node) => {

    }


    ifelsepDbClick = (event) => {

        const id = event.target.id
        const element = d3_selectAll(`text[id="${id}"]`).node();
        const text = element.getAttribute("type")
        const x = event.offsetY;
        const y = event.offsetX;
        let text1 = "";

        if (text === "Loop") {
            // this.props.IfElsefunction("loop")
            text1 = "loop"

        } else if (text === "Alt") {
            text1 = "alt"

        } else if (text === "Opt") {
            text1 = "opt"
        }
        this.setState({
            inputPosition: { x, y },
            textDoubleClick: true,
            ifElse: true,
            ifElseText: text1
        });

    }


    handleItemClick = (e, data) => {
        console.log(data.foo);
    };

    //判斷框住的元素有什麽
    findTextIndices(text, text1, text2, num) {

        let text1Index = -1;
        let text2Index = -1;
        let currentNum = 0;
        let currentNum1 = 0;

        const lines = text;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(text1)) {
                currentNum += 1;
                if (currentNum === num) {
                    text1Index = i;
                    break;
                }
            }
        }

        let num1 = 0;
        for (var i = text1Index; i < lines.length; i++) {
            if (lines[i].includes(text2)) {
                break;
            } else if (lines[i].includes(text1)) {
                num1 += 1;

            }
        }
        console.log(num1)
        if (text1Index !== -1) {
            console.log(text1Index)
            for (let i = text1Index; i < lines.length; i++) {
                if (lines[i].includes(text2)) {
                    currentNum1 += 1;
                    if (currentNum1 === num1) {
                        text2Index = i;
                        break;
                    }
                }
            }
        }
        console.log(currentNum1)
        console.log(text1Index, text2Index)



        return { text1Index, text2Index }
    }
    restructureArray = (text, num1, num2, num3) => {
        // 獲取用戶輸入
        console.log(text, num1, num2, num3)
        let textArray = text;


        // 從textArray中提取num3指定的元素
        const elementsFromNum3 = num3.map(i => textArray[i]);

        // 從原始位置刪除num3指定的元素
        // 注意：從最大索引開始刪除，避免影響其他元素的索引


        // 在num1和num2之間插入elementsFromNum3
        const insertionIndex = num1 < num2 ? num1 + 1 : num2 + 1;
        textArray.splice(insertionIndex, 0, ...elementsFromNum3);
        for (let i = num3.length - 1; i >= 0; i--) {
            textArray.splice(num3[i], 1);
        }
        console.log(textArray)
        return textArray.join('\n');
        // 檢查索引有效性

    }
    findTextindices(text, text1, text2, num) {

    }

    downloadSvg = () => {
        const svgElement = this.containerRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-svg.svg';  // 自定義文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    downloadPng = () => {
        const svg = document.querySelector('svg');
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);

        // 創建一個Blob對象
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        // 創建一個臨時的canvas元素
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            // 創建一個臨時的下載鏈接
            const a = document.createElement('a');
            a.download = 'image.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
        };

        img.src = url;
    };


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
                {this.state.showContextMenu && (
                    <ContextMenu id="svg_context_menu" style={{ position: 'absolute', top: this.state.yPos, left: this.state.xPos }}>
                        <MenuItem data={{ item: 'item1' }} onClick={this.handleItemClick}>
                            菜单项1
                        </MenuItem>
                        <MenuItem data={{ item: 'item2' }} onClick={this.handleItemClick}>
                            菜单项2
                        </MenuItem>
                        {/* 其他菜单项 */}
                    </ContextMenu>
                )}
            </div>

        );
    }
}

export default Graph;









