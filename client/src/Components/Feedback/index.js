import * as React from 'react';
import { Button } from "react-bootstrap";
import Loader from "../Loader";
import './index.css';
import WorkerIdContext from "../WorkerIdContext";
import Link from "react-router-dom/modules/Link";

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        setTimeout(function() {
            this.setState({loading: false})
        }.bind(this), 1000)
    }

    continue = () => {
        this.props.toggleScenario();
    }

    render() {
        return (
            this.state.loading ?
                <Loader />
                :
            <div className="thankyou-header">
                <h1>Thank You For Your Submission!</h1>
                    <h2 className={"bonus"}>
                        { this.props.history.location.feedback ?
                            "Great Job! You have found the right house! You will receive a bonus for this scenario."
                            :
                            "Unfortunately, you have chosen a house that does not meet the requirements provided for the scenario. " +
                            "You will not receive a bonus for this scenario."
                        }
                    </h2>
                <Link to={"/"}>
                    <Button className={"Continue"} onClick={this.continue}>
                        Continue to the next scenario
                    </Button>
                </Link>
            </div>
        );
    }
}

Feedback.contextType = WorkerIdContext;

export default Feedback;