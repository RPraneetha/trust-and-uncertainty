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
            logger: null,
            loggerUpdated: false
        }
    }

    componentDidMount() {
        window.myLogger = log4javascript.getLogger();
        const ajaxAppender = new log4javascript.AjaxAppender("/storeLogs");
        ajaxAppender.setBatchSize(10); // send in batches of 10
        ajaxAppender.setSendAllOnUnload(true); // send all remaining messages on window.beforeunload()
        window.myLogger.addAppender(ajaxAppender);

        window.onerror = function(message, url, lineNumber) {
            const errorMsg = "Console error - " + url + " : " + lineNumber + ": " + message;
            window.myLogger.error(errorMsg);
            return true;
        };

        window.myLogger.info(new Date() + ": Session started by WorkerId: " + this.context.workerId);
        this.setState({ logger: window.myLogger, loggerUpdated: true })
    }

    render() {
        return (
            <div className="globalContainer">
                <div className="dashboard">
                    <div className="bodyWrapper">
                        { this.state.loggerUpdated && <SearchPage logger={window.myLogger}/> }
                    </div>
                </div>
            </div>
        );
    }
}

App.contextType = WorkerIdContext;

export default App;
