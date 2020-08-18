import * as React from 'react';
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import Scenarios from "../Scenarios";
import './index.css';
import WorkerIdContext from "../WorkerIdContext";
import Loader from "../Loader";
import SingleHouse from "../SingleHouse";
import sampleHouseData from "../../Data/sample_houses.json";
import sampleScenarioData from "../../Data/sample_scenario.json";

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            isSubmitted: false,
            scenario: "",
            scenarioData: null,
            correctHouse: null,
            houseData: null,
            loading: true,
            scenarioType: Math.random() >= 0.5,
            dss: false,
            house: {}
        }
    }

    componentDidMount() {
        const logger = this.props.logger;
        Promise.all([ this.getScenario(logger), this.getAllHouses(logger) ]).then(() => {
            this.setState({
                loading: false
            });
        });
        logger.info(new Date() + ": Search Page started by WorkerId: " + this.context);
    }

    async getScenario(logger) {
        const sid = Math.floor(Math.random() * 3) + 1;
        const PROXY_URL = `https://cors-anywhere.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getScenarioAndHouse?sid=${sid}`;
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
        }
        catch(e) {
            logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        response = response ? response : sampleScenarioData;
        this.setState({
            scenarioData: response,
            scenario: response.description,
            correctHouse: response.correctHouse["_id"]
        });
        logger.info(new Date() + ": Scenario id #" + sid + " given to WorkerId: " + this.context);
    }

    async getAllHouses(logger) {
        const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
        const URL = PROXY_URL + "https://cryptic-headland-35693.herokuapp.com/getAllHouses";
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
        }
        catch(e) {
            logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        response = response ? response : sampleHouseData;
        this.setState({houseData: response})
    }

    handleSubmit = (e, logger) => {
        this.setState({dss: !this.state.dss})
        this.setState({filters: this.filters, isSubmitted: true})
        if(this.state.dss) {
            logger.info(new Date() + ": DSS option selected by WorkerId: " + this.context);

            if (this.state.scenarioType) {
                this.setState({house: this.state.scenarioData.correctHouse})
                logger.info(new Date() + ": Correct house given to WorkerId: " + this.context);
            } else {
                const incorrectHouseList = this.state.houseData.filter(house => house["_id"] !== this.state.correctHouse)
                const incorrectHouseNumber = Math.floor(Math.random() * incorrectHouseList.length);
                this.setState({house: incorrectHouseList[incorrectHouseNumber]});
                logger.info(new Date() + ": Incorrect house given to WorkerId: " + this.context);
            }
        }
        else {
            logger.info(new Date() + ": DSS option unselected by WorkerId: " + this.context);
        }
    }

    render() {
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
                                        <Button onClick={(e) => this.handleSubmit(e, this.props.logger)}>
                                            {this.state.dss ?  "Go Back" : "Ask the System for Help!"}
                                        </Button>
                                        {
                                            this.state.dss &&
                                            <span className="recommendation">
                                                <h5>The Intelligent System searched the database for your requirements,
                                                    and came up with this recommendation!</h5>
                                            </span>
                                        }
                                    </div>
                                    <div className="row">
                                        {
                                            this.state.dss ? (
                                                <React.Fragment>
                                                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 single-house">
                                                        <SingleHouse house={this.state.scenarioData.correctHouse} />
                                                    </div>
                                                    <hr />
                                                    <div className={"proceed-wrapper"}>
                                                        <Button type={"submit"} size="lg" className="proceed">
                                                            Proceed <FaArrowRight className={"FaArrowRight"}/>
                                                        </Button>
                                                    </div>
                                                </React.Fragment>
                                                )
                                                :
                                                this.state.houseData.map((house) => {
                                                return (
                                                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                        <SingleHouse house={house} />
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