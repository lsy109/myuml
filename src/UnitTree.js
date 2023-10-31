import React, { Component } from 'react';
import SortableTree, { changeNodeAtPath, addNodeUnderParent, removeNodeAtPath, toggleExpandedForAll } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import './index.css';
import parse from 'dotparser';
import { parseDOT } from './Parser';

export default class UnitTree extends Component {
    constructor(props) {
        super(props);
        this.rowInfo = '';
        this.newNode = 0;
        this.preselectTreeNode = '';
        this.isTreeChange = false;

        this.state = {
            showConfirmBtn: false,  //顯示確認刪除
            showTitleInput: false,  //顯示title輸入區
            title: "",
            treeData: toggleExpandedForAll({treeData: parseDOT(parse(this.props.dotSrc)[0].children)}),
        };
        this.updateTreeData = this.updateTreeData.bind(this);
        
        // let ast = parse(this.props.dotSrc);
        // parseDOT(ast[0].children);
    }

    componentDidUpdate() {
        if(this.isTreeChange === true){
            this.props.onChangeTree(this.state.treeData);
            this.isTreeChange = false;
        }
    }

    updateTreeData(treeData) {
        this.setState({ treeData });
    }

    // graph或dot改變時parse成treeData
    dotToTreeData(dot) {
        console.log("dot To TreeData");
        let newData = parseDOT(parse(dot)[0].children);
        this.setState({
            showConfirmBtn: false,
            showTitleInput: false,
            treeData: toggleExpandedForAll({treeData: newData})
        });
    }

    //新增node
    addNode(rowInfo) {
        let path = rowInfo.path;
        let title = rowInfo.node.title;

        this.setState(state => ({
            showConfirmBtn: false,
            showTitleInput: false,
            treeData: addNodeUnderParent({
                treeData: state.treeData,
                parentKey: path[path.length - 1],
                expandParent: true,
                newNode: { title: `new node${this.newNode++}`, children: [], attr: [] },
                getNodeKey: ({ treeIndex }) => treeIndex,
                addAsFirstChild: true,
            }).treeData
        }));
        this.isTreeChange = true;
        this.props.onStatusChange(`add ${title} child node`);
    }

    //刪除node
    removeNode = (event) => {
        let path = this.rowInfo.path;
        let title = this.rowInfo.node.title;

        this.setState(state => ({
            showConfirmBtn: false,
            showTitleInput: false,
            treeData: removeNodeAtPath({
                treeData: state.treeData,
                path,
                getNodeKey: ({ treeIndex }) => treeIndex,
            })
        }));
        this.isTreeChange = true;
        this.props.onStatusChange(`remove ${title}`);
    }

    //編輯node名稱
    editNodeName = (event) => {
        let preTitle = this.rowInfo.node.title;
        let title = this.state.title;
        let {node, path} = this.rowInfo;
        const getNodeKey = ({ treeIndex }) => treeIndex;

        this.setState(state => ({
            showTitleInput: false,
            treeData: changeNodeAtPath({
                treeData: state.treeData,
                path,
                getNodeKey,
                newNode: { ...node, title }
            })
        }));
        this.isTreeChange = true;
        this.props.onStatusChange(`modify node ${preTitle} to ${title}`);
    }

    render() {
        let title = this.state.title;
        return (
            <div id="unit">
                <form onClick={(e) => {e.preventDefault(); e.stopPropagation();}}>
                    <span className="title">Unit Tree:</span>
                    {/* 修改名稱區塊 */}
                    <span style={{display: `${this.state.showTitleInput ? 'inline' : 'none'}`}}>
                        <input
                            id="titleInput"
                            type="text"
                            value={title}
                            onKeyDown={event => {
                                if(event.key === 'Enter'){ this.editNodeName(); }}
                            }
                            onChange={event => {
                                this.setState({
                                    title: event.target.value,
                                });
                            }}                    
                        />
                        <button label='confirm' id="confirmBtn" className='btn' 
                            onClick={this.editNodeName}
                        >Enter</button>
                        <button label='cancel' id="cancelBtn" className='btn' 
                            onClick={(event) => {
                                this.setState({
                                    showTitleInput: false
                                })
                        }}>Cancel</button>
                    </span>
                    {/* 確認刪除區塊 */}
                    <span  style={{display: `${this.state.showConfirmBtn ? 'inline' : 'none'}`}}>
                        <p className='delbtn'>Confirm delete this node?</p>
                        <button label='confirm' id="confirmBtn" className='btn' 
                            onClick={ this.removeNode }
                        >Confirm</button>
                        <button label='cancel' id="cancelBtn" className='btn' 
                            onClick={(event) => {
                                this.setState({
                                    showConfirmBtn: false
                                });
                        }}>Cancel</button>
                    </span>
                </form>
                <SortableTree
                    treeData={this.state.treeData}
                    onChange={this.updateTreeData}
                    onDragStateChanged = {(event) => {
                        if(event.isDragging){
                            let title = event.draggedNode.title;
                            this.props.onStatusChange(`move ${title}`);
                        } else {
                            this.isTreeChange = true;
                        }
                    }}
                    theme={FileExplorerTheme}
                    style={{ marginLeft: '5px', height: 'calc(100% - 20px)' }}
                    
                    //每個node的porp
                    generateNodeProps={rowInfo => ({
                        onDoubleClick: (event) => {
                            if(!event.target.className.includes('pic')) {
                                this.rowInfo = rowInfo;
                                let title = this.rowInfo.node.title;
                                this.setState({
                                    showConfirmBtn: false,
                                    showTitleInput: true,
                                    title: title,
                                });

                                let target = event.target;
                                target.style.color = '#2F7BB1';
                                if(this.preselectTreeNode !== '' && this.preselectTreeNode !== target) this.preselectTreeNode.style.color = 'black';
                                this.preselectTreeNode = target;

                                this.props.onStatusChange(`select ${title}`);
                            }
                        },
                        
                        // 新增/刪除按鈕
                        buttons: [
                            <div>
                                <button 
                                    label='Add'
                                    id="addBtn" 
                                    className='btnImg'
                                    onClick={(event) => {
                                        event.preventDefault(); 
                                        event.stopPropagation();
                                        if(this.preselectTreeNode !== '') this.preselectTreeNode.style.color = 'black';
                                        this.preselectTreeNode = "";

                                        this.addNode(rowInfo);
                                    }}
                                ><img className="addPic" alt="+" /></button>
                                <button 
                                    label='Delete'
                                    id="removeBtn" 
                                    className='btnImg'
                                    onClick={(event) => {
                                        // console.log(event)
                                        this.rowInfo = rowInfo;
                                        let title = this.rowInfo.node.title;
                                        if(this.preselectTreeNode !== '') this.preselectTreeNode.style.color = 'black';
                                        this.preselectTreeNode = "";

                                        this.setState({
                                            showConfirmBtn: true,
                                            showTitleInput: false,
                                            title: title,
                                        });
                                    }}
                                ><img className="removePic" alt="-" /></button>
                            </div>
                        ],
                    })}
                />
            </div>
        );
    }
}