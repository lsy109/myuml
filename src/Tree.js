// import React from 'react';
// import * as data from './TreeList.json';
// import UnitTree from './UnitTree';



// class TreeArea extends React.Component {
//     constructor(props) {
//         super(props);
//         this.unitRef = React.createRef();
//         this.prevSelectedField = '';
//         this.prevSelectedSubject = '';

//         this.state = {
//             selectField: '',
//             selectSubject: '',
//         };
//     }



//     handleDragStart = (e) => {
//         // e.preventDefault();
//         e.dataTransfer.setData('text/plain', e.target.textContent);
//         this.someEventHappens(e.target.textContent)
//     };
//     someEventHappens = (data) => {
//         // 这是你想传递的数据
//         console.log(data)
//         this.props.onDataUpdate(data);
//     }

//     render() {
//         return (

//             <div className="area" id="treeArea">
//                 <p className="title">Shape:</p>
//                 <div id="shape">
//                     <div className='shapeContainer' id="shapeContainer">
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
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Entity" class='shapeImage'></div>
//                             <span>Entity</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Database" class='shapeImage'></div>
//                             <span>Database</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Collections" class='shapeImage'></div>
//                             <span>Collections</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Queue" class='shapeImage'></div>
//                             <span>Queue</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Arrow1" class='shapeImage'></div>
//                             <span>Arrow1</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Arrow2" class='shapeImage'></div>
//                             <span>Arrow2</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Arrow3" class='shapeImage'></div>
//                             <span>Arrow3</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Arrow4" class='shapeImage'></div>
//                             <span>Arrow4</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="Participant" class='shapeImage'></div>
//                             <span>Participant</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="activate" class='shapeImage'></div>
//                             <span>activate</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="destroy" class='shapeImage'></div>
//                             <span>destroy</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="loop" class='shapeImage'></div>
//                             <span>Loop</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="alt" class='shapeImage'></div>
//                             <span>Alt</span>
//                         </div>
//                         <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
//                             <div id="opt" class='shapeImage'></div>
//                             <span>Opt</span>
//                         </div>

//                     </div>
//                 </div>

//             </div>
//         );
//     }
// }

// export default TreeArea;
import React from 'react';

class TreeArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submenuAExpanded: true,
            submenuBExpanded: false,
            submenuCExpanded: false,
        };
    }

    handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        this.someEventHappens(e.target.textContent)
    };

    someEventHappens = (data) => {
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

    render() {
        const { submenuAExpanded, submenuBExpanded, submenuCExpanded } = this.state;
        return (
            <div className="area" id="treeArea">
                <p className="title">SideBar:</p>
                <div id="shape">
                    <div className="menu" onClick={() => this.toggleSubmenu('submenuAExpanded')}>Nodes</div>
                    <div className={`submenu ${submenuAExpanded ? 'expanded' : ''}`}>
                        {/* 在这里添加子菜单项A */}
                        {this.renderShapeItem("text", "Shape")}
                        {this.renderShapeItem("actor", "Actor")}
                        {this.renderShapeItem("Boundary", "Boundary")}
                        {this.renderShapeItem("Control", "Control")}
                        {this.renderShapeItem("Entity", "Entity")}
                        {this.renderShapeItem("Database", "Database")}
                        {this.renderShapeItem("Collections", "Collections")}
                        {this.renderShapeItem("Queue", "Queue")}
                        {this.renderShapeItem("Participant", "Participant")}
                        {/* {this.renderShapeItem("activate", "activate")}
                        {this.renderShapeItem("destroy", "destroy")} */}


                        {/* ... 其他项 ... */}
                    </div>

                    <div className="menu" onClick={() => this.toggleSubmenu('submenuBExpanded')}>Arrow</div>
                    <div className={`submenu ${submenuBExpanded ? 'expanded' : ''}`}>
                        {/* 在这里添加子菜单项B */}
                        {this.renderShapeItem("Arrow1", "Arrow1")}
                        {this.renderShapeItem("Arrow2", "Arrow2")}
                        {this.renderShapeItem("Arrow3", "Arrow3")}
                        {this.renderShapeItem("Arrow4", "Arrow4")}
                    </div>
                    <div className="menu" onClick={() => this.toggleSubmenu('submenuCExpanded')}>Alt</div>
                    <div className={`submenu ${submenuCExpanded ? 'expanded' : ''}`}>
                        {/* 在这里添加子菜单项B */}
                        {this.renderShapeItem("loop", "Loop")}
                        {this.renderShapeItem("alt", "Alt")}
                        {this.renderShapeItem("opt", "Opt")}
                        {this.renderShapeItem("group", "Group")}
                    </div>
                </div>

            </div>
        );
    }
}

export default TreeArea;
