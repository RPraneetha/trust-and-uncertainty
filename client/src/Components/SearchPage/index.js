import * as React from 'react';
import Scenarios from "../Scenarios";
import './index.css';
import WorkerIdContext from "../WorkerIdContext";
import Loader from "../Loader";
import SingleHouse from "../SingleHouse";
import {Button} from "react-bootstrap";

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            isSubmitted: false,
            scenario: "",
            scenarioData: null,
            correctHouse: null,
            houseData: null,
            logs: [],
            loading: true,
            scenarioType: Math.random() >= 0.5,
            dss: false,
            house: {}
        }
        this.setLogs = this.setLogs.bind(this)
    }

    componentDidMount() {
        Promise.all([ this.getScenario(), this.getAllHouses() ]).then((responses) => {
            this.setState({
                loading: false
            });
        });
        let log = [new Date() + ": Search Page started by WorkerId: " + this.context];
        this.setState({ logs: this.state.logs.concat(log) });
    }

    async getScenario() {
        const sid = Math.floor(Math.random() * 3) + 1;
        const PROXY_URL = `https://cors-anywhere.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getScenarioAndHouse?sid=${sid}`;
        try {
            let response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
            this.setState({
                scenarioData: response,
                scenario: response.description,
                correctHouse: response.correctHouse["_id"]
            })
        }
        catch(e) {
            console.log(await JSON.stringify(e))
        }
    }

    async getAllHouses() {
        const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
        const URL = PROXY_URL + "https://cryptic-headland-35693.herokuapp.com/getAllHouses";
        try {
            let response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
            this.setState({houseData: response})
        }
        catch(e) {
            console.log(await JSON.stringify(e))
        }
    }

    setLogs = newLogs => {
        let logs = this.state.logs;
        this.setState({logs: logs.concat(newLogs)})
        this.props.callbackFromParents(this.state.logs);
    }


    handleSubmit = () => {
        this.setState({dss: true})
        let log = [new Date() + ": Form on Search Page submitted by WorkerId: " + this.context];
        this.setState({logs: this.state.logs.concat(log), filters: this.filters, isSubmitted: true})

        if(this.state.scenarioType) {
            this.setState({house: this.state.scenarioData.correctHouse})
        }
        else {
            const incorrectHouseList = this.state.houseData.filter(house => house["-id"] !== this.state.correctHouse)
            const incorrectHouseNumber = Math.floor(Math.random() * incorrectHouseList.length);
            this.setState({house: incorrectHouseList[incorrectHouseNumber]});
        }
    }

    render() {
        console.log(this.state.house)
        return (
            this.state.loading ?
                <Loader />
                :
            <div className="contentWrapper">
                <div className="header">
                    <h1>Find Your Perfect House</h1>
                </div>
                <div className="selectBarWrapper">
                    <Scenarios scenarioItem={this.state.scenario} />
                </div>
                <div className="searchPageWrapper">
                        <div className="resultTable">
                            <div className="resultBody">
                                <div className="resultsList">
                                    <div className="nohouses">
                                        <h2>Select A House To Proceed!</h2>
                                        <span>Click on the house to see additional information</span>
                                    </div>
                                    <div className={"button-dss"}>
                                        <Button onClick={this.handleSubmit}>
                                            Ask the System for Help!
                                        </Button>
                                    </div>
                                    <div className="row">
                                        {
                                            this.state.dss ? (
                                                <div className="col-xs-12 single-house">
                                                    <SingleHouse house={this.state.scenarioData.correctHouse} logs={this.state.logs}
                                                                 setLogs={this.setIntermediateLogs}/>
                                                </div>
                                                )
                                                :
                                                this.state.houseData.map((house) => {
                                                return (
                                                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                        <SingleHouse house={house} logs={this.state.logs} setLogs={this.setIntermediateLogs}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

SearchPage.contextType = WorkerIdContext;

export default SearchPage;