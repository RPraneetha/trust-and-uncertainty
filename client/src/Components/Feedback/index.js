import * as React from 'react';
import { Button } from "react-bootstrap";
import Loader from "../Loader";
import './index.css';
import WorkerIdContext from "../WorkerIdContext";
import ThankYou from "../ThankYou";

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            finished: false
        }
    }

    componentDidMount() {
        setTimeout(function() {
            this.setState({loading: false});
        }.bind(this), 1000);
    }

    render() {
        return (
            this.state.loading ?
                <Loader />
                :
                !this.state.finished ?
                <div className="thankyou-header">
                    <h1>Thank You For Your Submission!</h1>
                        <h2 className={"bonus"}>
                            {
                                this.props.feedback ?
                                "Great Job! You have found the right house! You will receive a bonus for this scenario."
                                :
                                "Unfortunately, you have chosen a house that does not meet the requirements provided for the scenario. " +
                                "You will not receive a bonus for this scenario."
                            }
                        </h2>
                        { this.props.finished ?
                            <Button className={"continue"} onClick={() => this.setState({finished: true})}>
                                Complete The Task
                            </Button>
                            :
                            <Button className={"continue"} onClick={() => this.props.changeScenario()}>
                                Continue To The Next Scenario
                            </Button>
                        }
                </div>
            :
            <ThankYou />
        );
    }
}

Feedback.contextType = WorkerIdContext;

export default Feedback;