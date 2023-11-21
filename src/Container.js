import React from 'react';
import DisplayArea from './Display';
import MainArea from './MainArea';

function StatusBar(props) {
    return (
        <div id="status">
            <p className="title" id="statusNow">Status Bar:<span id="statusContent">{props.statusContent}</span></p>
        </div>
    );
}

class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statusContent: '',
            selectValue: '',
        };
        this.mainAreaRef = React.createRef();
    }

    componentDidMount() {
        this.ToMainArea()


    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectValue !== prevState.selectValue) {
            // selectValue发生变化，触发你的函数
            this.ToMainArea();
        }
    }
    handleStatusChange = (content) => {
        // console.log(content);


        this.setState({
            statusContent: `${content}`
        });
    }

    selectValue = (value) => {
        this.setState({ selectValue: value })
        // this.ToMainArea();
        // if (this.mainAreaRef.current) {
        //     console.log("kk")
        // }
        // this.mainAreaRef.current.selectChangeDiv(value)

    }
    ToMainArea = () => {
        this.mainAreaRef.current.selectChangeDiv(this.state.selectValue)



    }


    render() {
        const value = this.state.selectValue;
        return (
            <div id="container">

                {/* which display */}
                <DisplayArea
                    getSelectValue={this.selectValue}
                />

                {/* main area */}
                <MainArea
                    onStatusChange={this.handleStatusChange}
                    selectValue={value}
                    ref={this.mainAreaRef}
                />

                {/* Stutas Bar */}
                <StatusBar
                    statusContent={this.state.statusContent}
                />
            </div>
        );
    }
}

export default Container;