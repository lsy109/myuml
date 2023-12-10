import React from 'react';




class ClassTree extends React.Component {
    constructor(props) {
        super(props);
        this.unitRef = React.createRef();
        this.prevSelectedField = '';
        this.prevSelectedSubject = '';

        this.state = {
            submenuAExpanded: true,
            submenuBExpanded: false,
            submenuCExpanded: false,
        };
    }



    handleDragStart = (e) => {
        // e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.textContent);
        this.someEventHappens(e.target.textContent)
    };
    someEventHappens = (data) => {
        // 这是你想传递的数据
        console.log(data)
        this.props.onDataUpdate(data);
    }
    toggleSubmenu = (menu) => {
        this.setState(prevState => ({
            [menu]: !prevState[menu]
        }));
    };

    renderShapeItem(id, label) {
        return (
            <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                <div id={id} className='shapeImage'></div>
                <span>{label}</span>
            </div>
        );
    }


    //     render() {
    //         return (

    //             <div className="area" id="treeArea">
    //                 <p className="title">Shape:</p>
    //                 <div id="shape">
    //                     <div className='shapeContainer' id="shapeContainer">
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="class" class='shapeImage'></div>
    //                             <span>Class</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="actor" class='shapeImage'></div>
    //                             <span>Actor</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="Boundary" class='shapeImage'></div>
    //                             <span>Boundary</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="Control" class='shapeImage'></div>
    //                             <span>Control</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="text" class='shapeImage'></div>
    //                             <span>Shape</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="actor" class='shapeImage'></div>
    //                             <span>Actor</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="Boundary" class='shapeImage'></div>
    //                             <span>Boundary</span>
    //                         </div>
    //                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
    //                             <div id="Control" class='shapeImage'></div>
    //                             <span>Control</span>
    //                         </div>
    //                     </div>

    //                 </div>

    //             </div>
    //         );
    //     }
    // }
    render() {
        const { submenuAExpanded, submenuBExpanded, submenuCExpanded } = this.state;
        return (
            <div className="area" id="treeArea">
                <p className="title">SideBar:</p>
                <div id="shape">
                    <div className="menu" onClick={() => this.toggleSubmenu('submenuAExpanded')}>Nodes</div>
                    <div className={`submenu ${submenuAExpanded ? 'expanded' : ''}`}>
                        {/* 在这里添加子菜单项A */}
                        {this.renderShapeItem("class", "Class")}
                        {this.renderShapeItem("annotation", "Annotation")}
                        {this.renderShapeItem("entity", "Entity")}
                        {this.renderShapeItem("enum", "Enum")}
                        {this.renderShapeItem("exception", "Exception")}
                        {this.renderShapeItem("interface", "Interface")}
                        {this.renderShapeItem("metaclass", "Metaclass")}
                        {this.renderShapeItem("protocol", "Protocol")}
                        {this.renderShapeItem("Stereotype", "Stereotype")}
                        {this.renderShapeItem("struct", "Struct")}



                        {/* ... 其他项 ... */}
                    </div>


                </div>

            </div>
        );
    }
}

export default ClassTree;