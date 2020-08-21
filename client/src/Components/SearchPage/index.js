import * as React from 'react';
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import Feedback from "../Feedback";
import Loader from "../Loader";
import Scenarios from "../Scenarios";
import SingleHouse from "../SingleHouse";
import ThankYou from "../ThankYou";
import WorkerIdContext from "../WorkerIdContext";
import sampleHouseData from "../../Data/sample_houses.json";
import sampleScenarioData from "../../Data/sample_scenario.json";
import './index.css';
import Link from "react-router-dom/modules/Link";

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            scenario: "",
            scenarioData: null,
            correctHouse: null,
            dss: false,
            houseData: null,
            loading: true,
            housingOption: {},
            feedback: null
        }
    }

    componentDidMount() {
        const logger = this.props.logger;
        Promise.all([ this.getScenario(logger), this.getAllHouses(logger) ]).then(() => {
            this.setState({
                loading: false
            });
        });
        logger.info(new Date() + ": Search Page started by WorkerId: " + this.context.workerId);
    }

    async getScenario(logger) {
        const PROXY_URL = `https://cors-anywhere.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getScenarioAndHouse?sid=${this.props.scenarioId}`;
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
        logger.info(new Date() + ": Scenario id #" + this.props.scenarioId + " given to WorkerId: " + this.context.workerId);
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

    delay = (time) => {
        this.setState({loading: true})
        setTimeout(function() {
            this.setState({loading: false})
        }.bind(this), time)
    }

    handleSubmit = (e, logger) => {
        this.delay(1000);

        if(!this.state.dss) {
            logger.info(new Date() + ": DSS option selected by WorkerId: " + this.context.workerId);
            if (this.context.scenarioType === "1") {
                this.setState({housingOption: this.state.scenarioData.correctHouse})
                logger.info(new Date() + ": Correct house given to WorkerId: " + this.context.workerId);
            } else {
                const incorrectHouseList = this.state.houseData.filter(house => house["_id"] !== this.state.correctHouse)
                const incorrectHouseNumber = Math.floor(Math.random() * incorrectHouseList.length);
                this.setState({housingOption: incorrectHouseList[incorrectHouseNumber]});
                logger.info(new Date() + ": Incorrect house given to WorkerId: " + this.context.workerId);
            }
        }
        else {
            logger.info(new Date() + ": DSS option unselected by WorkerId: " + this.context.workerId);
        }
        this.setState({dss: !this.state.dss})
    }

    handleHouseSubmit = (logger, housingOption) => {
        this.delay(1000);
        logger.info(new Date() + ": House " + housingOption.description + " with House Id " +
            housingOption["_id"]  + " submitted by WorkerId: " + this.context.workerId);
        if(housingOption["_id"] === this.state.correctHouse) {
            logger.info(new Date() + ": Correct house submitted by WorkerId: " + this.context.workerId);
            this.setState({ feedback: true });
        }
        else {
            logger.info(new Date() + ": Incorrect house submitted by WorkerId: " + this.context.workerId);
            this.setState({ feedback: false });
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
                                            <h2>Find a house that matches the scenario given and submit it</h2>
                                            <span>Click on the house to see additional information</span>
                                        </div>
                                        <div className={"button-dss"}>
                                            <Button onClick={(e) => this.handleSubmit(e, this.props.logger)}>
                                                {this.state.dss ?  "Go Back" : "Ask the System for Help"}
                                            </Button>
                                            {
                                                this.state.dss &&
                                                <div className="recommendation">
                                                    <h5>The Intelligent System searched the database for your requirements,
                                                        and came up with this recommendation!</h5>
                                                    <span>Scroll to the bottom of the screen to submit the house.</span>
                                                </div>
                                            }
                                        </div>
                                        <div className="row">
                                            {
                                                this.state.dss ? (
                                                    <React.Fragment>
                                                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 single-house">
                                                            <SingleHouse house={this.state.housingOption} houseSubmission={this.handleHouseSubmit}/>
                                                        </div>
                                                        <hr />
                                                        <div className={"proceed-wrapper"}>
                                                            <Link to={{
                                                                pathname: "/feedback",
                                                                feedback: this.state.feedback
                                                            }}
                                                                  onClick={() => this.handleHouseSubmit(this.props.logger, this.state.housingOption)}>
                                                                <Button
                                                                    type={"submit"}
                                                                    size="lg"
                                                                    className="proceed"
                                                                >
                                                                    Submit this house <FaArrowRight className={"FaArrowRight"}/>
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </React.Fragment>
                                                    )
                                                    :
                                                    this.state.houseData.map((house) => {
                                                        return (
                                                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                                <SingleHouse house={house} houseSubmission={this.handleHouseSubmit}/>
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