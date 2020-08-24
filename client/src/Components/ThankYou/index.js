import * as React from 'react';
import shortid from 'shortid';
import './index.css';
import WorkerIdContext from "../WorkerIdContext";
import Loader from "../Loader";

class ThankYou extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
            loading: true
        }
    }

    componentDidMount() {
        const code = shortid.generate();
        this.setState({code: code})
        window.myLogger.info(new Date() + ": Code " + this.state.code +" given to WorkerId: " + this.context.workerId)

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

        setTimeout(function() {
            this.setState({ loading: false })
        }.bind(this), 1000)
    }

    render() {
        return (
            this.state.loading ?
                <Loader />
                :
            <div className="thankyou-header">
                <h1>Thank You For Completing The Task!</h1>
                <h2 className={"bonus"}>
                    Copy the code to the survey to show task completion for your payment: {this.state.code}
                </h2>
            </div>
        );
    }
}

ThankYou.contextType = WorkerIdContext;

export default ThankYou;