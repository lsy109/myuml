import React from 'react';
import { module1 } from './utils.js'

class DisplayArea extends React.Component {
    constructor(props) {
        super(props);
        this.isCheckedChanged = false;
        this.matrix = [];
        this.lastArea = '';

        this.state = {
            area: {
                source: true,
                edit: true,
                tree: true,
            },
            showErrorMsg: false,
        };
    }

    componentDidMount(){
        module1.resizable_3area(this.matrix);
    }

    componentDidUpdate() {
        this.matrix = [this.state.area.source, this.state.area.edit, this.state.area.tree];
        if(this.isCheckedChanged) {
            this.lastArea = module1.checkBox(this.matrix, this.lastArea);
            this.isCheckedChanged = !this.isCheckedChanged;
        }

        module1.resizable_3area(this.matrix);
    }

    handleChange = (event) => {
        const name = event.target.name;

        if(this.lastArea === name) {
            this.setState({
                showErrorMsg: true,
            });
        } else {
            this.isCheckedChanged = true;
            this.setState(state => ({
                area: {
                    ...state.area,
                    [name]: !state.area[name],
                    
                },
                showErrorMsg: false,
            }));
        }
    };

    render() {
        const { area } = this.state;

        return(
            <div id="display-area">
                <input
                    type = "checkbox"
                    id = "cb_0"
                    name = "source"
                    checked={area.source}
                    onChange={this.handleChange}
                />
                <label className = "display-label" htmlFor = "cb_0">Source</label>
                <input
                    type = "checkbox"
                    id = "cb_1"
                    name = "edit"
                    checked={area.edit}
                    onChange={this.handleChange}
                />
                <label className="display-label" htmlFor = "cb_1">Edit Panel</label>
                <input
                    type = "checkbox"
                    id = "cb_2"
                    name = "tree"
                    checked={area.tree}
                    onChange={this.handleChange}
                />
                <label className = "display-label" htmlFor = "cb_2">Tree</label>
                <span 
                    className='errorMsg'
                    style={{display: `${this.state.showErrorMsg ? 'inline' : 'none'}`}}
                >should choose at least one</span>
            </div>
        );
    }
}

export default DisplayArea;