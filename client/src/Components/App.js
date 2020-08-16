import React from 'react';
import log4javascript from 'log4javascript';
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

        //window.myLogger = log4javascript.getDefaultLogger();
        window.myLogger = log4javascript.getLogger();
        const ajaxAppender = new log4javascript.AjaxAppender("/storeLogs");
        ajaxAppender.setBatchSize(10); // send in batches of 10
        ajaxAppender.setSendAllOnUnload(true); // send all remaining messages on window.beforeunload()
        window.myLogger.addAppender(ajaxAppender);

        //report all user console errors
        window.onerror = function(message, url, lineNumber) {
            const errorMsg = "Console error- " + url + " : " + lineNumber + ": " + message;
            window.myLogger.error(errorMsg);
            return true;
        };

        window.myLogger.info(new Date() + ": Session started by WorkerId: " + this.context);
    }

    setLogs = newLogs => {
        // console.log(newLogs)
        let logs = this.state.logs;
        this.setState({logs: logs.concat(newLogs)})
        // console.log(this.state.logs)
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
