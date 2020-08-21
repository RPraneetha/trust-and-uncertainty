import React from 'react';
import log4javascript from 'log4javascript';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchPage from "./SearchPage";
import Loader from "./Loader";
import WorkerIdContext from "./WorkerIdContext";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Feedback from "./Feedback";
import ThankYou from "./ThankYou";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            logger: null,
            loggerUpdated: false,
            scenarioIds: {}
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

        Promise.all([ this.getScenarioIds() ]).then(() => {
            this.setState({
                loading: false
            });
        });
    }

    async getScenarioIds() {
        let scenarioId = {
            "complexScenario": 1,
            "easyScenario": 4
        }
        const PROXY_URL = `https://cors-anywhere.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getWorkerScenario?wid=${this.context.workerId}`;
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
        }
        catch(e) {
            this.state.logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        response = response ? response : scenarioId;
        this.setState({
            scenarioIds: response,
            scenario: response.complexScenario
        });
        this.state.logger.info(new Date() + ": Scenarios: Complex id #" + this.state.scenarioIds.complexScenario +
            " Simple id #" + this.state.scenarioIds.easyScenario + " given to WorkerId: " + this.context.workerId);
    }

    toggleScenario = () => {
        this.setState({scenario: this.state.scenarioIds.easyScenario})
    }
    render() {
        return (
            <div className="globalContainer">
                <div className="dashboard">
                    <div className="bodyWrapper">
                        {this.state.loading ?
                            <Loader/>
                            :
                            <Router>
                                <Route exact path="/" render={(props) => <SearchPage {...props} logger={window.myLogger} scenarioId={this.state.scenario} />} />
                                <Route exact path="/feedback" render={(props) => <Feedback {...props} logger={window.myLogger} scenarioToggle={this.toggleScenario} />} />
                                <Route exact path="/thankyou" component={ThankYou} />
                            </Router>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

App.contextType = WorkerIdContext;

export default App;
