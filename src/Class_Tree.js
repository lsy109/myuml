import React from 'react';




class ClassTree extends React.Component {
    constructor(props) {
        super(props);
        this.unitRef = React.createRef();
        this.prevSelectedField = '';
        this.prevSelectedSubject = '';

        this.state = {
            selectField: '',
            selectSubject: '',
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

    render() {
        return (

            <div className="area" id="treeArea">
                <p className="title">Shape:</p>
                <div id="shape">
                    <div className='shapeContainer' id="shapeContainer">
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="class" class='shapeImage'></div>
                            <span>Class</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="actor" class='shapeImage'></div>
                            <span>Actor</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="Boundary" class='shapeImage'></div>
                            <span>Boundary</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="Control" class='shapeImage'></div>
                            <span>Control</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="text" class='shapeImage'></div>
                            <span>Shape</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="actor" class='shapeImage'></div>
                            <span>Actor</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="Boundary" class='shapeImage'></div>
                            <span>Boundary</span>
                        </div>
                        <div className='shapeItem' draggable="true" onDragStart={this.handleDragStart}>
                            <div id="Control" class='shapeImage'></div>
                            <span>Control</span>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default ClassTree;