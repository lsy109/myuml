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
        };
    }

    handleStatusChange = (content) => {
        // console.log(content);
        console.log("ll")

        this.setState({
            statusContent: `${content}`
        });
    }

    render() {
        return (
            <div id="container">

                {/* which display */}
                <DisplayArea />

                {/* main area */}
                <MainArea
                    onStatusChange={this.handleStatusChange}
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