import * as React from 'react';
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { shuffle } from "lodash";
import Feedback from "../Feedback";
import Loader from "../Loader";
import Scenarios from "../Scenarios";
import SingleHouse from "../SingleHouse";
import WorkerIdContext from "../WorkerIdContext";
import sampleHouseData from "../../Data/sample_houses.json";
import sampleScenarioData from "../../Data/sample_scenario.json";
import './index.css';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            scenario: "",
            scenarioIndex: 0,
            scenarioData: null,
            correctHouse: null,
            dss: false,
            houseData: null,
            loading: true,
            housingOption: {},
            feedback: null,
            finished: false,
            actions: {
                dss_selected: false,
                dss_house_details_checked: false,
                manual_house_details_checked: false,
                dss_house_submitted: false,
                manual_house_submitted: false

            }
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
        const PROXY_URL = `https://infinite-plateau-04823.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/getScenarioAndHouse?sid=${this.props.scenarioIds[this.state.scenarioIndex]}`;
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
        logger.info(new Date() + ": Scenario id #" + this.props.scenarioIds[this.state.scenarioIndex] + " given to WorkerId: " + this.context.workerId);
    }

    async getAllHouses(logger) {
        const PROXY_URL = "https://infinite-plateau-04823.herokuapp.com/";
        const URL = PROXY_URL + "https://cryptic-headland-35693.herokuapp.com/getAllHouses";
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
            response = shuffle(response);
        }
        catch(e) {
            logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        response = response ? response : sampleHouseData;
        this.setState({houseData: response})
    }

    async completeScenario(workerId, logger) {
        const PROXY_URL = `https://infinite-plateau-04823.herokuapp.com/`;
        const URL = PROXY_URL + `https://cryptic-headland-35693.herokuapp.com/submitWorkerScenario?wid=${workerId}`;
        let response;
        try {
            response = await fetch(URL, {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
            logger.info(new Date() + ": Response from submitWorkerScenario " + JSON.stringify(response));
        }
        catch(e) {
            logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
    }

    delay = (time) => {
        this.setState({loading: true})
        setTimeout(function() {
            this.setState({loading: false})
        }.bind(this), time)
    }

    setAction = (isDSS) => {
        if(isDSS) {
            this.setState({actions: {...this.state.actions, dss_house_details_checked: true}});
        } else {
            this.setState({actions: {...this.state.actions, manual_house_details_checked: true}});
        }

    }

    handleActionLogging = (logger) => {
        logger.info(new Date() + " Summary of actions by WorkerID: " + this.context.workerId);
        for (const [key, value] of Object.entries(this.state.actions)) {
            logger.info(new Date() + "WorkerID: " + this.context.workerId + `${key}:  ${value}`);
        }
        logger.info(new Date() + "End Summary of actions by WorkerID: " + this.context.workerId);
        this.setState({ submitted: true })
    }

    handleDSSSubmit = (e, logger) => {
        if(!this.state.dss) {
            this.setState({actions: {...this.state.actions, dss_selected: true}});
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
        } else {
            logger.info(new Date() + ": DSS option unselected by WorkerId: " + this.context.workerId);
        }
        this.setState({dss: !this.state.dss})
    }

    handleHouseSubmit = (logger, housingOption) => {
        Promise.all([ this.completeScenario(this.context.workerId, logger)]).then(() => {
            if(this.state.dss) {
                logger.info(new Date() + ": DSS option submitted by WorkerId: " + this.context.workerId);
                this.setState({actions: {...this.state.actions, dss_house_submitted: true}}, () => this.handleActionLogging(logger));
            } else {
                logger.info(new Date() + ": House Id " + housingOption["_id"] + " manually submitted by WorkerId: " + this.context.workerId);
                this.setState({
                    actions: {
                        ...this.state.actions,
                        manual_house_submitted: true
                    }
                }, () => this.handleActionLogging(logger));
            }
            if(housingOption["_id"] === this.state.correctHouse) {
                logger.info(new Date() + ": Correct house submitted by WorkerId: " + this.context.workerId);
                this.setState({ feedback: true });
            }
            else {
                logger.info(new Date() + ": Incorrect house submitted by WorkerId: " + this.context.workerId);
                this.setState({ feedback: false });
            }
        });
    }

    updateScenarioId = () => {
        this.setState({
            dss: false,
            loading: true,
            finished: this.state.scenarioIndex === 1 ? true : false,
            scenarioIndex: this.state.scenarioIndex + 1,
            submitted: false,
            actions: {
                dss_selected: false,
                dss_house_details_checked: false,
                manual_house_details_checked: false,
                dss_house_submitted: false,
                manual_house_submitted: false
            }
        }, () => {
            Promise.all([this.getScenario(this.props.logger), this.getAllHouses(this.props.logger)]).then(() => {
                this.setState({
                    loading: false
                });
            })
        })
    }

    render() {
        return (
            this.state.loading ?
                <Loader />
                :
                !this.state.submitted ?
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
                                            <h2>Find a house that meets the requirements and submit it.</h2>
                                            <span>Click on the house to see additional information</span>
                                        </div>
                                        <div className={"button-dss"}>
                                            <Button onClick={(e) => this.handleDSSSubmit(e, this.props.logger)}>
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
                                                                <SingleHouse
                                                                    house={this.state.housingOption}
                                                                    houseSubmission={this.handleHouseSubmit}
                                                                    isDSS={true}
                                                                    setAction={this.setAction}
                                                                />
                                                            </div>
                                                            <hr />
                                                            <div className={"proceed-wrapper"}>
                                                                <Button
                                                                    type={"submit"}
                                                                    size="lg"
                                                                    className="proceed"
                                                                    onClick={() => this.handleHouseSubmit(this.props.logger, this.state.housingOption)}
                                                                >
                                                                    Submit this house <FaArrowRight className={"FaArrowRight"}/>
                                                                </Button>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                    :
                                                    this.state.houseData.map((house) => {
                                                        return (
                                                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                                                <SingleHouse
                                                                    house={house}
                                                                    houseSubmission={this.handleHouseSubmit}
                                                                    isDSS={false}
                                                                    setAction={this.setAction}
                                                                />
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
                    :
                    <Feedback feedback={this.state.feedback} changeScenario={this.updateScenarioId} finished={this.state.finished} />
        );
    }
}

SearchPage.contextType = WorkerIdContext;

export default SearchPage;