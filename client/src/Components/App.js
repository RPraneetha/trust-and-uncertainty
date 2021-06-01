import React from 'react';
import log4javascript from 'log4javascript';
import SearchPage from "./SearchPage";
import Loader from "./Loader";
import ErrorPage from "./ErrorPage";
import WorkerIdContext from "./WorkerIdContext";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            logger: null,
            loggerUpdated: false,
            scenarioIds: {},
            error: false
        }
    }

    componentDidMount() {
        window.myLogger = log4javascript.getLogger();
        const ajaxAppender = new log4javascript.AjaxAppender("/storeLogs");
        ajaxAppender.setBatchSize(50); // send in batches of 10
        ajaxAppender.setSendAllOnUnload(true); // send all remaining messages on window.beforeunload()
        window.myLogger.addAppender(ajaxAppender);

        window.onerror = function(message, url, lineNumber) {
            const errorMsg = "Console error - " + url + " : " + lineNumber + ": " + message;
            window.myLogger.error(errorMsg);
            return true;
        };

        window.myLogger.info(new Date() + ": Session started by WorkerId: " + this.context.workerId);
        this.setState({ logger: window.myLogger, loggerUpdated: true })

        Promise.all([ this.getScenarioIds() ]).then(() => {
            this.setState({
                loading: false
            });
        });
    }

    async getScenarioIds() {
        let scenarioId = [1, 2, 3];
        const PROXY_URL = `https://infinite-plateau-04823.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getWorkerScenario?wid=${this.context.workerId}`;
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            if(response.status === 400){
                this.setState({error: true})
                this.state.logger.info(new Date() + ": Scenarios could not be given to WorkerId: " + this.context.workerId);
                return;
            }
            response = await response.json();
        }
        catch(e) {
            this.state.logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        // response = response ? response : scenarioId;
        this.setState({
            scenarioIds: scenarioId
        });
        this.state.logger.info(new Date() + ": Scenarios: #" + this.state.scenarioIds[0] + "#" +
            this.state.scenarioIds[1] +"#" + this.state.scenarioIds[2] + " given to WorkerId: " + this.context.workerId);
    }

    render() {
        return (
            <div className="globalContainer">
                <div className="dashboard">
                    <div className="bodyWrapper">
                        {this.state.loading ?
                            <Loader/>
                            :
                            this.state.error ?
                                <ErrorPage />
                                :
                                <SearchPage logger={window.myLogger} scenarioIds={this.state.scenarioIds} />

                        }
                    </div>
                </div>
            </div>
        );
    }
}

App.contextType = WorkerIdContext;

export default App;
