import React from "react";
import { select as d3_select } from 'd3-selection';
import { selectAll as d3_selectAll } from 'd3-selection';
import { transition as d3_transition } from 'd3-transition';


import 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
import { encode } from "plantuml-encoder";
import * as d3 from 'd3';

class ClassDiagram extends React.Component {
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
            /////////
            myNode: [],
            svgContainer: null,
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
        clearInterval(this.interval);
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
                this.setState({ svgContainer: (d3.select(this.containerRef.current)).select('svg') })
                this.reMakeAllDom(container);
                this.setState({ nodeNum: 0 });
                clearInterval(this.interval);
            }, 1);


            container.html(tempContainer.node().innerHTML);

            // 在此進行您的 D3 操作
        }
    }

    reMakeAllDom = (container) => {
        const allElements = container.selectAll('*');
        const nodes = allElements.nodes();
        console.log(nodes)
        let mynodes = [];
        for (var i = 3; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeName.toLowerCase() === "g") {
                d3_select(node)
                    .on("mouseover", this.MouseOver)
                // .on("mouseout", this.MouseOut)
                const id = node.getAttribute("id");
                const ChildNodes = node.childNodes
                for (var j = 1; j < ChildNodes.length; j++) {
                    const Dom = ChildNodes[j];
                    d3_select(Dom).attr("id", `${id}`);
                }
                mynodes.push(ChildNodes);

            }

        }
        this.setState({ myNode: mynodes })
        this.addBinlk()
    }

    //添加閃爍效果
    addBinlk = () => {
        const nodes = this.state.myNode;
        for (var i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            let node1 = null;
            let node2 = null;
            let node3 = null;
            const container = this.state.svgContainer;
            console.log(node)
            //
            let textHeight = 0;
            let textwidth = 0;
            for (var j = 0; j < node.length; j++) {
                const e = node[j];
                if (e.nodeName === "line") {
                    if (node1 == null) {
                        node1 = e;
                    } else {
                        node2 = e;
                    }

                    if (node1 != null && node2 != null) {
                        let node1x1 = node1.getAttribute("x1");
                        let node1x2 = node1.getAttribute("x2");
                        let node1y1 = node1.getAttribute("y1");
                        let node1y2 = node1.getAttribute("y2");

                        let node2x1 = node2.getAttribute("x1");
                        let node2x2 = node2.getAttribute("x2");
                        let node2y1 = node2.getAttribute("y1");
                        let node2y2 = node2.getAttribute("y2");

                        const height = node2y1 - node1y1;
                        const width = node1x2 - node1x1;
                        textHeight = height
                        textwidth = width

                        console.log(textHeight)
                        //添加rect

                        container.append('rect')
                            .attr('id', `text1`)
                            .attr('x', node1x1)
                            .attr('y', node1y1)
                            .attr('height', height)
                            .attr('width', width)
                            .style('fill', 'red')




                    }
                    if (textHeight != 0 && textwidth != 0) {
                        console.log(node3)
                        let node3x = node3.getAttribute("x")
                        let node3y = node3.getAttribute("y")
                        let node3Height = node3.getAttribute("height") - textHeight
                        let node3Width = node3.getAttribute("width")

                        let rect = node3.getBoundingClientRect()
                        var leftBottom = { x: rect.left, y: rect.bottom };
                        console.log(leftBottom)
                        console.log(node3x, node3y, node3Height, node3Width)
                        container.append('rect')
                            .attr('id', `text1`)
                            .attr('x', node3x)
                            .attr('y', node3y)
                            .attr('height', node3Height)
                            .attr('width', node3Width)
                            .style('fill', 'black')


                    }


                } else if (e.nodeName === "rect") {
                    node3 = e

                }
                console.log(e)
            }
        }


    }

    MouseOver = (event) => {
        //判斷鼠標hover的是哪一個node的id
        // const id = event.target.id.normalize();
        // //分解id的值，找到特點的id
        // const nodes = this.state.myNode;
        // let list = nodes.map(function (element) {
        //     console.log(element)
        // })
        // const id = event.target.id;
        // const newId = id.split("elem_").join("")
        // const myRect = d3_select(`rect#${newId}`).node()
        // console.log(myRect)
        // const rectBBox = myRect.getBBox();

        // const arrowPositions = {
        //     up: { x: rectBBox.x + rectBBox.width / 2, y: rectBBox.y },
        //     down: { x: rectBBox.x + rectBBox.width / 2, y: rectBBox.y + rectBBox.height },
        //     left: { x: rectBBox.x, y: rectBBox.y + rectBBox.height / 2 },
        //     right: { x: rectBBox.x + rectBBox.width, y: rectBBox.y + rectBBox.height / 2 }
        // };

        // var svg = d3.select('svg');

        // // 定义正向箭头
        // // 定义正向箭头
        // svg.append('defs').append('marker')
        //     .attr('id', 'arrowhead')
        //     .attr('markerUnits', 'userSpaceOnUse')
        //     .attr('viewBox', '-0 -5 10 10')
        //     .attr('refX', 5)
        //     .attr('refY', 0)
        //     .attr('orient', 'auto')
        //     .attr('markerWidth', 13)
        //     .attr('markerHeight', 13)
        //     .attr('xoverflow', 'visible')
        //     .append('svg:path')
        //     .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        //     .attr('fill', '#000')
        //     .attr('id', `${newId}`)
        //     .on("mouseover", this.test)
        //     // .on("mouseout", this.MouseOut)
        //     .on("mousedown", this.MouseDown)
        // // .on("mousemove", this.MouseMove)
        // // .on("mouseup", this.MouseUp)

        // // 定义反向箭头
        // svg.append('defs').append('marker')
        //     .attr('id', 'arrowhead-reverse')
        //     .attr('markerUnits', 'userSpaceOnUse')
        //     .attr('viewBox', '0 -5 10 10')
        //     .attr('refX', 5) // Adjusted refX to reverse the arrowhead
        //     .attr('refY', 0)
        //     .attr('orient', 'auto')
        //     .attr('markerWidth', 13)
        //     .attr('markerHeight', 13)
        //     .attr('xoverflow', 'visible')
        //     .append('svg:path')
        //     .attr('d', 'M 10,-5 L 0 ,0 L 10,5')
        //     .attr('fill', '#000')
        //     .attr('id', `${newId}`)
        //     .on("mouseover", this.test)
        //     // .on("mouseout", this.MouseOut)
        //     .on("mousedown", this.MouseDown)
        // // .on("mousemove", this.MouseMove)
        // // .on("mouseup", this.MouseUp)



        // Object.entries(arrowPositions).forEach(([direction, pos]) => {
        //     let line;
        //     let arrowAttr = 'marker-end'; // 默认使用 marker-end
        //     let arrowId = 'arrowhead'; // 默认使用正向箭头

        //     switch (direction) {
        //         case 'up':
        //             line = { x1: pos.x, y1: pos.y - 10, x2: pos.x, y2: pos.y + 1 };
        //             arrowAttr = 'marker-start';
        //             arrowId = 'arrowhead-reverse';
        //             break;
        //         case 'down':
        //             line = { x1: pos.x, y1: pos.y - 1, x2: pos.x, y2: pos.y + 10 };
        //             break;
        //         case 'left':
        //             line = { x1: pos.x - 10, y1: pos.y, x2: pos.x + 1, y2: pos.y };
        //             arrowAttr = 'marker-start';
        //             arrowId = 'arrowhead-reverse';
        //             break;
        //         case 'right':
        //             line = { x1: pos.x - 1, y1: pos.y, x2: pos.x + 10, y2: pos.y };
        //             break;
        //     }

        //     // 创建路径并应用箭头标记
        //     svg.append('path')
        //         .classed('arrow-path', true)
        //         .attr('d', `M ${line.x1},${line.y1} L${line.x2},${line.y2}`)
        //         .attr('stroke', 'blue')
        //         .attr('stroke-width', 7)
        //         .attr('fill', 'none')
        //         .attr('id', `${newId}`)
        //         .attr(arrowAttr, `url(#${arrowId})`)
        //         .on("mouseover", this.test)
        //         // .on("mouseout", this.MouseOut)
        //         .on("mousedown", this.MouseDown)
        //     // .on("mousemove", this.MouseMove)
        //     // .on("mouseup", this.MouseUp)
        // });




    }
    test = () => {
        console.log("ll")
    }

    createArrow = (fromX, fromY, toX, toY) => {
        var svg = d3.select('svg');

    }
    MouseOut = (evant) => {
        var svg = d3.select('svg');
        svg.selectAll('.arrow-path').remove();
        console.log("oo")
    }
    MouseMove = (e) => {
        e.preventDefault()
        console.log("move")

    }
    MouseDown = (e) => {
        e.preventDefault()

        const x = e.target.id
        const rect1 = d3_select(`rect#${x}`).node()
        var svg = d3_select('svg');
        const component = this;
        svg.on('mousemove', function (event) {
            event.preventDefault();
            svg.on('mouseup', (function (e) {
                svg.on('mousemove', null);
                const id = e.target.id;
                const newId = id.split("elem_").join("");
                const myRect = d3.select(`rect#${newId}`).node();

                const text1 = rect1.getAttribute("id");
                const text2 = myRect.getAttribute("id");

                const text = `${text1}--${text2}`;

                component.props.shapeText(text);
                console.log(text);
            }));

        })

    }
    MouseUp = (e) => {
        e.preventDefault()
        console.log("up")
    }

    handleDragOver = (e) => {
        e.preventDefault(); // 防止預設的放置行為



    };

    handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');  // 獲取傳遞的字串
        let rect = d3.selectAll(".group");
        if (data === "Class") {
            const text = `class class09`
            this.props.shapeText(text)

        }
        console.log(data)
        // rect.classed("flash", false);
        // let line = d3.selectAll(".rectLine");
        // line.classed("flash", false);




        // 在此處根據 `data` 做你想要的操作，例如將圖片加入到此組件中
    };


    render() {
        return (
            <div
                id="editDiv"
                ref={this.containerRef}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}


            >


            </div>

        );
    }
}

export default ClassDiagram;