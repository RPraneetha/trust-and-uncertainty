import * as React from 'react';
import shortid from 'shortid';
import './index.css';
import WorkerIdContext from "../WorkerIdContext";

class ThankYou extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null
        }
    }

    componentDidMount() {
        const code = shortid.generate();
        console.log(code);
        this.setState({code: code})
        window.myLogger.info(new Date() + ": Code " + this.state.code +" given to WorkerId: " + this.context.workerId)

        const URL = "https://trust-and-uncertainty.herokuapp.com/workerIdAndCode";

        fetch("/workerIdAndCode", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workerId: this.context.workerId,
                code: code,
            })
        })
    }

    render() {
        return (
            <div className="thankyou-header">
                <h1>Thank You For Completing The Task!</h1>
                <h2 className={"bonus"}>
                    Copy the code to receive your bonus: {this.state.code}
                </h2>
            </div>
        );
    }
}

ThankYou.contextType = WorkerIdContext;

export default ThankYou;