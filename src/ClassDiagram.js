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
            num: 0,
            inputPosition: { x: 0, y: 0 },
            textDoubleClick: false,
            clickNode: "",
            clickNodeType: "",
            editortext: "",
            mouseLeave: false,
        };
        this.dragging = false;
        this.zoomScale = 1;
        this.translate = { x: 0, y: 0 };

        this.line = null; // 用於儲存線條元素
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
        const svg = (d3.select(this.containerRef.current)).select('svg');
        // 假設 containerRef 是你的 SVG 容器的引用
        this.line = svg.append("line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5")
            .style("visibility", "hidden");

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
                this.setState({
                    svgContainer: (d3.select(this.containerRef.current)).select('svg'),
                    editortext: this.props.EditorText.split("\n")
                })
                this.reMakeAllDom(container);
                this.setState({ num: 0 });

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

    //獲取數字id
    nodeType = () => {
        this.setState(prevState => ({ num: prevState.num + 1 }))
        return this.state.num
    }
    //添加rect範圍
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
            //

            let node1Y1 = 0;
            let hh = 0;
            const nodeNum = this.nodeType()
            for (var j = 0; j < node.length; j++) {
                const e = node[j];
                const id = e.getAttribute("id")

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
                        textHeight = node1y1
                        textwidth = width
                        node1Y1 = node2y1;

                        hh = height
                        //添加rect

                        container.append('rect')
                            .attr('id', `${id}:var:${nodeNum}`)
                            .attr('x', node1x1)
                            .attr('y', node1y1)
                            .attr('height', height)
                            .attr('width', width)
                            .style('fill-opacity', 0)
                            .on('mouseenter', this.getMouseMoveOver.bind(this))
                            .on('mouseleave', this.getMouseLeave.bind(this))
                            .on('dblclick', this.getNodeDBclick.bind(this))



                    }
                    if (textHeight != 0 && textwidth != 0) {
                        console.log(node3)
                        let node3x = node3.getAttribute("x")
                        let node3y = node3.getAttribute("y")
                        let node3Height = textHeight - node3y
                        let node3Width = node3.getAttribute("width")

                        let rect = node3.getBoundingClientRect()
                        var leftBottom = { x: rect.left, y: rect.bottom };
                        console.log(leftBottom)
                        console.log(node3x, node3y, node3Height, node3Width)
                        container.append('rect')
                            .attr('id', `${id}:title:${nodeNum}`)
                            .attr('x', node3x)
                            .attr('y', node3y)
                            .attr('height', node3Height)
                            .attr('width', node3Width)
                            .style('fill-opacity', 0)
                            .on('mouseenter', this.getMouseMoveOver.bind(this))
                            .on('mouseleave', this.getMouseLeave.bind(this))
                            .on('dblclick', this.getNodeDBclick.bind(this))

                        let x1 = node3x;
                        let y1 = node1Y1;
                        let hei = node3.getAttribute("height") - node3Height - hh

                        container.append('rect')
                            .attr('id', `${id}:methods:${nodeNum}`)
                            .attr('x', x1)
                            .attr('y', y1)
                            .attr('height', hei)
                            .attr('width', node3Width)
                            .style('fill-opacity', 0)
                            .on('mouseenter', this.getMouseMoveOver.bind(this))
                            .on('mouseleave', this.getMouseLeave.bind(this))
                            .on('dblclick', this.getNodeDBclick.bind(this))
                    }


                } else if (e.nodeName === "rect") {
                    node3 = e

                }
                console.log(e)
            }
        }


    }

    dragstarted(event) {
        const svgRect = this.containerRef.current.getBoundingClientRect();
        const svg = this.state.svgContainer

        // 计算鼠标在SVG容器中的位置
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top * 2 - window.scrollY;
        console.log(x, y)

        // 创建线条元素
        this.line = svg.append("line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5")
            .style("visibility", "visible")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x)
            .attr("y2", y);

        // 添加 mousemove 监听器
        svg.on("mousemove", this.mousemoved);
    }

    mousemoved = (event) => {

        const svgRect = this.containerRef.current.getBoundingClientRect();

        // 计算鼠标在SVG容器中的位置
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top * 2 - window.scrollY;
        this.line
            .attr("x2", x)
            .attr("y2", y);
    }

    dragended(event) {
        // 隱藏線條
        this.state.svgContainer.on("mousemove", null);

        // 隐藏线条
        if (this.line) {
            this.line.style("visibility", "hidden");
        }
    }

    //鼠標移入格子時的fucntion
    getMouseMoveOver = (event, d) => {
        const id = event.currentTarget.getAttribute("id").split(':')
        const rectid = id[0].split("_")

        d3.select(event.currentTarget)
            .style('animation', 'blink 2s infinite')
            .on("mousedown", this.dragstarted.bind(this))
            .on("mouseup", this.dragended.bind(this))

    }
    //鼠標移出時取消閃爍
    getMouseLeave = (event) => {
        d3.select(event.currentTarget)
            .style('animation', 'none');
        this.setState({ mouseLeave: false })
        if (!this.state.mouseLeave) {
            var svg = d3.select('svg');
            svg.selectAll('.arrow-path').remove()
        };

    }    //添加閃爍效果



    //雙擊時判斷位置
    getNodeDBclick = (event) => {
        const nodeid = (event.currentTarget.getAttribute("id")).split(":")
        const id = nodeid[0]
        const type = nodeid[1]
        const x = event.offsetY;
        const y = event.offsetX;
        this.setState({
            inputPosition: { x, y },
            textDoubleClick: true,

        });
        console.log(nodeid)
        const nodes = this.getClickNodeClass(id);
        console.log(nodes)
        if (type === 'title') {
            this.setState({ clickNodeType: type, clickNode: nodes })
        } else if (type === 'var') {
            this.setState({ clickNodeType: type, clickNode: nodes })
        } else if (type === 'methods') {
            this.setState({ clickNodeType: type, clickNode: nodes })
        }

    }
    //var的function
    getClickNodeVar = (text, inputValue) => {
        //點擊的node的text
        const nodeText = text;
        //輸框輸入的值
        const input = inputValue;
        //獲取index
        const { index, str } = this.findIndex1(nodeText);
        console.log(this.state.editortext)
        console.log(index, str)
        if (str === 'no') {
            let newText = `{
${inputValue}
}`
            this.insertTextDown(newText, index)
        } else {
            this.insertTextDown(input, index);
        }



    }
    //methods的function
    getClickNodeMethods = (text, inputValue) => {
        const nodeText = text;
        //輸框輸入的值
        const input = inputValue;
        //獲取index
        const { index, str } = this.findIndex2(nodeText);
        if (str === "no") {
            let newText = `{
${inputValue}()
}`
            this.insertTextUp(newText, index);
        } else {

            let newText = `${inputValue}()`
            this.insertTextUp(newText, index);
        }



    }
    //
    findIndex1 = (text) => {
        const text1 = this.state.editortext
        const Editortext = text1;
        console.log(Editortext)
        let index = 0;
        let str = "";


        let findText = 0;
        for (var x = 0; x < Editortext.length; x++) {
            console.log(Editortext[x].split(' ').length)
            if (Editortext[x].split(' ').length > 1) {
                let str = Editortext[x].split(' ');
                console.log(str[1])
                if (str[1].includes("{")) {

                    let newStr = str[1].split('{')

                    if (newStr[0] === text) {
                        findText = x;
                        break;
                    }

                } else {
                    if (str[1] === text) {
                        findText = x;
                        break;
                    }
                }
            }

        }
        const nodeName = Editortext[findText].split(' ')[0]
        console.log(nodeName)

        for (var i = 0; i < Editortext.length; i++) {
            const nodetext = Editortext[i]

            if (nodetext === (`${nodeName} ${text}{`) || nodetext === (`${nodeName} ${text}`)) {
                if (nodetext === (`${nodeName} ${text}{`)) {
                    index = i;
                    str = "Has"

                } else if (Editortext[i + 1] === ("{")) {
                    index = i + 2;
                    str = "Has"
                }
                else if (nodetext === (`${nodeName} ${text}`)) {
                    index = i + 1;
                    str = "no"
                }

                break;

            }

        }

        console.log(str)
        return { index, str };
    }
    findIndex2 = (text) => {
        const Editortext = this.state.editortext;
        let index = 0;
        let index2 = 0;
        let str = "";

        let findText = 0;
        for (var x = 0; x < Editortext.length; x++) {
            console.log(Editortext[x].split(' ').length)
            if (Editortext[x].split(' ').length > 1) {
                let str = Editortext[x].split(' ');
                console.log(str[1])
                if (str[1].includes("{")) {

                    let newStr = str[1].split('{')

                    if (newStr[0] === text) {
                        findText = x;
                        break;
                    }

                } else {
                    if (str[1] === text) {
                        findText = x;
                        break;
                    }
                }
            }

        }
        const nodeName = Editortext[findText].split(' ')[0]
        console.log(nodeName)

        for (var i = 0; i < Editortext.length; i++) {
            const nodetext = Editortext[i]
            if (nodetext === (`${nodeName} ${text}{`) || nodetext === (`${nodeName} ${text}`)) {
                if (nodetext === (`${nodeName} ${text}{`)) {
                    index = i;

                } else if (nodetext === (`${nodeName} ${text}`)) {
                    index = i + 1;
                }

                break;

            }
        }
        for (var j = index; j < Editortext.length; j++) {

            if (Editortext[j] === "}") {
                index2 = j
                break;
            }
        }
        console.log(index, index2)

        if (index2 === 0) {
            str = "no"
            return { index, str };
        } else {
            str = "Has"
            index = index2
            return { index, str }
        }


    }


    //尋找點擊的是哪一個class
    getClickNodeClass = (event) => {

        const node = d3.select(`g#${event}`);
        const nodes = node.selectAll("*").nodes();
        console.log(node.node())
        console.log(nodes)
        return nodes

    }


    MouseOver = (event) => {
        // 判斷鼠標hover的是哪一個node的id
        // const id = event.target.id.normalize();
        //分解id的值，找到特點的id
        if (this.state.mouseLeave) {


            const nodes = this.state.myNode;
            let list = nodes.map(function (element) {
                console.log(element)
            })
            // const id = event.target.id;
            const newId = event
            const myRect = d3_select(`rect#${newId}`).node()
            console.log(myRect)
            const rectBBox = myRect.getBBox();

            const arrowPositions = {
                up: { x: rectBBox.x + rectBBox.width / 2, y: rectBBox.y },
                down: { x: rectBBox.x + rectBBox.width / 2, y: rectBBox.y + rectBBox.height },
                left: { x: rectBBox.x, y: rectBBox.y + rectBBox.height / 2 },
                right: { x: rectBBox.x + rectBBox.width, y: rectBBox.y + rectBBox.height / 2 }
            };

            var svg = d3.select('svg');

            // 定义正向箭头
            // 定义正向箭头
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('markerUnits', 'userSpaceOnUse')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 5)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 13)
                .attr('markerHeight', 13)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#000')
                .attr('id', `${newId}`)
                .on("mouseover", this.test)
                .on("mouseout", this.MouseOut)
                .on("mousedown", this.MouseDown)
            // .on("mousemove", this.MouseMove)
            // .on("mouseup", this.MouseUp)

            // 定义反向箭头
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead-reverse')
                .attr('markerUnits', 'userSpaceOnUse')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 5) // Adjusted refX to reverse the arrowhead
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 13)
                .attr('markerHeight', 13)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 10,-5 L 0 ,0 L 10,5')
                .attr('fill', '#000')
                .attr('id', `${newId}`)
                .on("mouseover", this.test)
                // .on("mouseout", this.MouseOut)
                .on("mousedown", this.MouseDown)
            // .on("mousemove", this.MouseMove)
            // .on("mouseup", this.MouseUp)



            Object.entries(arrowPositions).forEach(([direction, pos]) => {
                let line;
                let arrowAttr = 'marker-end'; // 默认使用 marker-end
                let arrowId = 'arrowhead'; // 默认使用正向箭头

                switch (direction) {
                    case 'up':
                        line = { x1: pos.x, y1: pos.y - 10, x2: pos.x, y2: pos.y + 1 };
                        arrowAttr = 'marker-start';
                        arrowId = 'arrowhead-reverse';
                        break;
                    case 'down':
                        line = { x1: pos.x, y1: pos.y - 1, x2: pos.x, y2: pos.y + 10 };
                        break;
                    case 'left':
                        line = { x1: pos.x - 10, y1: pos.y, x2: pos.x + 1, y2: pos.y };
                        arrowAttr = 'marker-start';
                        arrowId = 'arrowhead-reverse';
                        break;
                    case 'right':
                        line = { x1: pos.x - 1, y1: pos.y, x2: pos.x + 10, y2: pos.y };
                        break;
                }

                // 创建路径并应用箭头标记
                svg.append('path')
                    .classed('arrow-path', true)
                    .attr('d', `M ${line.x1},${line.y1} L${line.x2},${line.y2}`)
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 7)
                    .attr('fill', 'none')
                    .attr('id', `${newId}`)
                    .attr(arrowAttr, `url(#${arrowId})`)
                    .on("mouseover", this.test)
                    .on("mouseout", this.MouseOut)
                    .on("mousedown", this.MouseDown)
                // .on("mousemove", this.MouseMove)
                // .on("mouseup", this.MouseUp)
            });

        }


    }
    test = () => {
        this.setState({ mouseLeave: true })
        console.log("ll")
    }

    createArrow = (fromX, fromY, toX, toY) => {
        var svg = d3.select('svg');

    }
    MouseOut = (evant) => {
        var svg = d3.select('svg');
        svg.selectAll('.arrow-path').remove();
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
        const num = this.nodeType()
        if (data === "Class") {
            const text = `class class${num}`
            this.props.shapeText(text)

        } else if (data === "Annotation") {
            const text = `annotation Annotation${num}`
            this.props.shapeText(text)
        }
        else if (data === "Entity") {
            const text = `entity Entity${num}`
            this.props.shapeText(text)
        }
        else if (data === "Enum") {
            const text = `enum Enum${num}`
            this.props.shapeText(text)
        }
        else if (data === "Exception") {
            const text = `exception Exception${num}`
            this.props.shapeText(text)
        }
        else if (data === "Interface") {
            const text = `interface Interface${num}`
            this.props.shapeText(text)
        }
        else if (data === "Metaclass") {
            const text = `metaclass Metaclass${num}`
            this.props.shapeText(text)
        }
        else if (data === "Protocol") {
            const text = `protocol Protocol${num}`
            this.props.shapeText(text)
        }
        else if (data === "Stereotype") {
            const text = `stereotype Stereotype${num}`
            this.props.shapeText(text)
        }
        else if (data === "Struct") {
            const text = `struct Struct${num}`
            this.props.shapeText(text)
        }
        console.log(data)
        // rect.classed("flash", false);
        // let line = d3.selectAll(".rectLine");
        // line.classed("flash", false);




        // 在此處根據 `data` 做你想要的操作，例如將圖片加入到此組件中
    };

    //尋找text在ediotrtext中的位置
    findTextInEditor = (text, inputValue) => {
        const Editortext = this.state.editortext;
        let findText = 0;
        for (var x = 0; x < Editortext.length; x++) {
            console.log(Editortext[x].split(' ').length)
            if (Editortext[x].split(' ').length > 1) {
                let str = Editortext[x].split(' ');
                console.log(str[1])
                if (str[1].includes("{")) {

                    let newStr = str[1].split('{')

                    if (newStr[0] === text) {
                        findText = x;
                        break;
                    }

                } else {
                    if (str[1] === text) {
                        findText = x;
                        break;
                    }
                }
            }

        }
        const nodeName = Editortext[findText].split(' ')[0]
        console.log(nodeName)
        for (var i = 0; i < Editortext.length; i++) {
            const nodetext = Editortext[i]
            if (nodetext === (`${nodeName} ${text}{`) || nodetext === (`${nodeName} ${text}`)) {
                const classText = nodetext;
                let spaceIndex = classText.indexOf(' ')
                let firstPart = classText.substring(0, spaceIndex); // 获取第一个空格前的部分
                let secondPart = classText.substring(spaceIndex + 1); // 获取第一个空格后的部分
                let str = "";
                if (secondPart.includes("{")) {
                    str = `${inputValue} {`;
                } else {
                    str = `${inputValue}`
                }
                let newText = `${firstPart} ${str}`;
                Editortext[i] = newText
                break;

            }
        }
        this.props.witreToEdit(Editortext.join("\n"))

    }
    //將text插入在index的下方
    insertTextDown = (text, index) => {
        const EditorText = this.state.editortext;
        EditorText.splice(index, 0, text);
        this.props.witreToEdit(EditorText.join("\n"))


        // 如果找到匹配的元素



    }

    //將text插入在index的上方
    insertTextUp = (text, index) => {
        const EditorText = this.state.editortext;
        EditorText.splice(index, 0, text);
        this.props.witreToEdit(EditorText.join("\n"))
        console.log(EditorText)
    }

    //input框enter后的function
    enterKeyInput = (input) => {
        const EditorText = this.state.editortext;
        const clicknode = this.state.clickNode;

        let index = [];
        for (var i = 0; i < clicknode.length; i++) {
            const id = clicknode[i]
            if (id.nodeName === "line") {
                break;
            } else if (id.nodeName === "text") {
                index.push(i)
            }
        }
        if (this.state.clickNodeType === "title") {
            let classtext = clicknode[index[0]].textContent;
            this.findTextInEditor(classtext, input)
        } else if (this.state.clickNodeType === "var") {
            let classtext = clicknode[index[0]].textContent;
            this.getClickNodeVar(classtext, input)

        } else if (this.state.clickNodeType === "methods") {
            let classtext = clicknode[index[0]].textContent;
            this.getClickNodeMethods(classtext, input)

        }




    }



    inputHandleKeyDown = (event) => {
        const input = event.target.value
        if (event.key === 'Enter') {
            this.setState({
                textDoubleClick: false
            })

            if (event.target.value === "") {
                console.log("kongkong");
            } else {
                this.enterKeyInput(input)
            }

        }
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

export default ClassDiagram;