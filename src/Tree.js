import React from 'react';
import * as data from './TreeList.json';
import UnitTree from './UnitTree';

class ToolTree extends React.Component {
    constructor(props) {
        super(props);
        this.prevSelected = "";

        this.state = {
            isActive: {
                relationTool: false,
                unitTool: false,
            },
        }
    }

    handleClick = (e) => {
        let id = e.target.id;

        this.setState({
            isActive: {
                ...this.state.isActive,
                [id]: !this.state.isActive[id],
            },
        });
    }

    handleSelect = (e) => {
        let target = e.target;
        target.style.color = '#2F7BB1';

        if (this.prevSelected !== '' && this.prevSelected !== target) this.prevSelected.style.color = 'black';
        this.prevSelected = target;

        this.props.onStatusChange(`select ${target.innerHTML}`);
    }

    render() {
        let relList = data.treeData.find(x => x.name === "relList").tree;
        let unitList = data.treeData.find(x => x.name === "unitList").tree;

        const RelLists = relList.map((list) =>
            <li key={list.id} id={list.id} onClick={this.handleSelect}>{list.list}</li>
        );
        const UnitLists = unitList.map((list) =>
            <li key={list.id} id={list.id} onClick={this.handleSelect}>{list.list}</li>
        );

        return (
            <div id="toolTree">
                <p className="title">Tool Tree:</p>
                <ul style={{ marginLeft: '5px' }}>
                    <li><span
                        id='relationTool'
                        className={`tool ${this.state.isActive.relationTool ? 'tool-down' : ''}`}
                        onClick={this.handleClick}
                    >關係
                    </span>
                        <ul className={`child-content ${this.state.isActive.relationTool ? 'active' : ''}`}>
                            {RelLists}
                        </ul>
                    </li>
                    <li><span
                        id='unitTool'
                        className={`tool ${this.state.isActive.unitTool ? 'tool-down' : ''}`}
                        onClick={this.handleClick}
                    >單元
                    </span>
                        <ul className={`child-content ${this.state.isActive.unitTool ? 'active' : ''}`}>
                            {UnitLists}
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

function FieldTree(props) {
    let fieldList = data.treeData.find(x => x.name === "fieldList").tree;
    const FieldLists = fieldList.map((list) =>
        <li key={list.list} className={`subject ${list.list}`} onClick={props.onSelect.bind(this)}>{list.list}</li>
    );

    return (
        <div id="field">
            <p className="title">Field Tree:</p>
            <ul style={{ marginLeft: '15px' }}>
                {FieldLists}
            </ul>
        </div>
    );
}

class SubjectTree extends React.Component {
    constructor(props) {
        super(props);
        this.fieldClass = '';
    }

    render() {
        let childLists = '';
        this.fieldClass = this.props.selectField[1];

        let subjectList = data.treeData.find(x => x.name === "subjectList").tree;
        if (this.fieldClass !== undefined) {
            childLists = subjectList[`${this.fieldClass}`].map((list) =>
                <li key={list.class} className={`course ${list.class}`} onClick={this.props.onSelect}>{list.list}</li>
            );
        }

        return (
            <div id="subject">
                <p className="title">Subject Tree:</p>
                <ul className={`subject-child ${this.fieldClass}`}>
                    {childLists}
                </ul>
            </div>
        );
    }
}

class TreeArea extends React.Component {
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

    // 呼叫unit dotToTreeData
    connentUnitTree(dot) {
        this.unitRef.current.dotToTreeData(dot)
    }

    //點選field tree
    handleFieldSelect = (e) => {
        let target = e.target;
        target.style.color = '#2F7BB1';

        this.setState({
            selectField: target.classList
        });
        if (this.prevSelectedField !== '' && this.prevSelectedField !== target) this.prevSelectedField.style.color = 'black';
        this.prevSelectedField = target;

        this.props.onStatusChange(`select ${target.innerHTML}`);
    }

    //點選subject tree
    handleSubjectSelect = (e) => {
        let target = e.target;
        target.style.color = '#2F7BB1';
        // console.log(target.innerHTML);

        this.setState({
            selectSubject: target.classList
        });
        // console.log(target.classList);

        if (this.prevSelectedSubject !== '' && this.prevSelectedSubject !== target) this.prevSelectedSubject.style.color = 'black';
        this.prevSelectedSubject = target;

        this.props.onChangeDot(target.classList[1]);
        this.props.onStatusChange(`select ${target.innerHTML}`);
    }



    handleDragStart = (e) => {
        // e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.textContent);
        console.log(e.target.textContent)
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
                        <div className='shapeItem' id="text" draggable="true" onDragStart={this.handleDragStart}><span>Shape</span></div>
                        <div className='shapeItem' id="actor" draggable="true" onDragStart={this.handleDragStart}><span>Actor</span></div>
                        <div className='shapeItem' id="Boundary" draggable="true" onDragStart={this.handleDragStart}><span>Boundary</span></div>
                        <div className='shapeItem' id="Control" draggable="true" onDragStart={this.handleDragStart}><span>Control</span></div>
                        <div className='shapeItem' id="Entity" draggable="true" onDragStart={this.handleDragStart}><span>Entity</span></div>
                        <div className='shapeItem' id="Database" draggable="true" onDragStart={this.handleDragStart}><span>Database</span></div>
                        <div className='shapeItem' id="Collections" draggable="true" onDragStart={this.handleDragStart}><span>Collections</span></div>
                        <div className='shapeItem' id="Queue" draggable="true" onDragStart={this.handleDragStart}><span>Queue</span></div>
                        <div className='shapeItem' id="Arrow1" draggable="true" onDragStart={this.handleDragStart}><span>Arrow1</span></div>
                        <div className='shapeItem' id="Arrow2" draggable="true" onDragStart={this.handleDragStart}><span>Arrow2</span></div>
                        <div className='shapeItem' id="Arrow3" draggable="true" onDragStart={this.handleDragStart}><span>Arrow3</span></div>
                        <div className='shapeItem' id="Arrow4" draggable="true" onDragStart={this.handleDragStart}><span>Arrow4</span></div>
                        <div className='shapeItem' id="Participant" draggable="true" onDragStart={this.handleDragStart}><span>Participant</span></div>
                        <div className='shapeItem' id="activate" draggable="true" onDragStart={this.handleDragStart}><span>activate</span></div>
                        <div className='shapeItem' id="destroy" draggable="true" onDragStart={this.handleDragStart}><span>destroy</span></div>

                    </div>
                </div>

            </div>
        );
    }
}

export default TreeArea;