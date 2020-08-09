import React from 'react';
import SearchPage from "./SearchPage";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorkerIdContext from "./WorkerIdContext";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs : []
        };
        this.setLogs = this.setLogs.bind(this)
    }

    componentDidMount() {
        let logs = this.state.logs;
        logs.push(new Date() + ": Session started by WorkerId: " +this.context)
        this.setState({logs: logs})
    }

    setLogs = newLogs => {
        console.log(newLogs)
        let logs = this.state.logs;
        this.setState({logs: logs.concat(newLogs)})
        console.log(this.state.logs)
    }

    render() {
        return (
                <div className="globalContainer">
                    <div className="dashboard">
                        <div className="bodyWrapper">
                            <SearchPage callbackFromParents={this.setLogs} />
                        </div>
                    </div>
                </div>
        );
    }
}

App.contextType = WorkerIdContext;

export default App;
