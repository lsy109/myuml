import React, { Component } from 'react';
import * as d3 from 'd3';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

class UseCase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: 0,
                height: 0
            },
            visibleSubMenu: null,
        }
        this.containerRef = React.createRef();
        this.editRef = React.createRef();
        this.resizeObserver = null; // 添加 resizeObserver 作为组件实例的属性
        this.state = { svgElement: null };
    }

    componentDidMount() {

        this.observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // console.log(entry.contentRect)
                const { width, height } = entry.contentRect;
                this.loadSvg(this.props.ImgUrl, width, height);
            }
        });

        if (this.editRef.current) {
            this.observer.observe(this.editRef.current);
        }
        this.containerRef.current.addEventListener('contextmenu', this.handleSvgContextMenu);

    }

    componentWillUnmount() {
        // 清理 resizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.containerRef.current) {
            this.containerRef.current.removeEventListener('contextmenu', this.handleSvgContextMenu);
        }
    }

    loadSvg = (ImgUrl, width, height) => {
        d3.xml(ImgUrl).then(data => {
            if (this.containerRef.current) {
                const svgEl = data.documentElement;
                svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
                console.log(width, height)
                svgEl.style.width = width;
                svgEl.style.height = height;
                console.log(svgEl)
                this.containerRef.current.appendChild(svgEl);
                // 在状态更新后调用 modifySvg

            }
        })
            .catch(error => {
                console.error('Error loading the SVG: ', error);
            });
    }
    handleSvgContextMenu = (event) => {
        // 检查是否点击了特定的 SVG text 元素
        if (event.target.tagName === 'text') {
            // 更新状态以改变上下文菜单的项目
            this.setState({
                contextMenuForText: true,
                selectedElement: event.target // 储存被点击的元素
            });
        } else {
            // 重置菜单状态
            this.setState({
                contextMenuForText: false,
                selectedElement: null
            });
        }
    };

    handleMouseEnter = (menuName) => {
        this.setState({ visibleSubMenu: menuName });
    };

    handleMouseLeave = () => {
        this.setState({ visibleSubMenu: null });
    };




    handleContextMenuClick = (e, data) => {
        console.log(data);
    }
    renderContextMenuItems() {
        const { contextMenuForText, visibleSubMenu } = this.state;
        if (contextMenuForText) {
            return (
                <>
                    {/* 主菜单项 */}
                    <MenuItem className='MenuItem' data={{ action: 'textAction1' }} onClick={this.handleContextMenuClick}>
                        Text Menu Item 1
                        <SubMenu title="子菜单"
                            onMouseEnter={this.handleMouseEnterSubMenu}
                            onMouseLeave={this.handleMouseLeaveSubMenu}>
                            <MenuItem data={{ action: 'subAction1' }} onClick={this.handleContextMenuClick}>
                                子菜单项 1
                            </MenuItem>
                            <MenuItem data={{ action: 'subAction2' }} onClick={this.handleContextMenuClick}>
                                子菜单项 2
                            </MenuItem>
                        </SubMenu>
                    </MenuItem>
                    <MenuItem className='MenuItem' data={{ action: 'textAction2' }} onClick={this.handleContextMenuClick}>
                        Text Menu Item 2
                    </MenuItem>
                    {/* 子菜单 */}

                </>
            );
        } else {
            return (
                <>
                    <MenuItem className='MenuItem' data={{ action: 'action1' }} onClick={this.handleContextMenuClick}>
                        Menu Item 1
                    </MenuItem>
                    <MenuItem className='MenuItem' data={{ action: 'action2' }} onClick={this.handleContextMenuClick}>
                        Menu Item 2
                    </MenuItem>
                    {/* 其他条件下的子菜单 */}
                </>
            );
        }
    }


    render() {
        return (
            <div id="editDiv" ref={this.editRef}>
                <ContextMenuTrigger id="svgContextMenu">
                    <div ref={this.containerRef}></div>
                </ContextMenuTrigger>

                <ContextMenu id="svgContextMenu" className="customContextMenu">
                    {this.renderContextMenuItems()}
                </ContextMenu>
            </div>
        );
    }
}

export default UseCase;
