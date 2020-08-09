import React from "react";
import "./index.css";
import { Card } from "react-bootstrap";

class Scenarios extends React.Component {
    render() {

        return (
            <div className={"scenarioWrapper"}>
                <Card className={"scenarioCard"}>
                    <Card.Header as={"h3"}>
                        Scenario
                    </Card.Header>
                    <Card.Text>
                        {this.props.scenarioItem}
                    </Card.Text>
                </Card>
            </div>
        );
    }
}

export default Scenarios;
