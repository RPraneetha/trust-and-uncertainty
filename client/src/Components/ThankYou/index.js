import * as React from 'react';
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
        Promise.all([ this.getCode(window.myLogger)]).then((code) => {
            this.setState({
                loading: false,
                code: code
            });

            fetch("/workerIdAndCode", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workerId: this.context.workerId,
                    code: this.state.code,
                })
            });
        });

        setTimeout(function() {
            this.setState({ loading: false })
        }.bind(this), 1000)
    }

    async getCode(logger) {
        let response;
        try {
            response = await fetch("/getCode", {method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }});
            response = await response.json();
        }
        catch(e) {
            logger.error(new Date() + ": Error " + JSON.stringify(e));
        }
        response = response ? response.code : "12345678";
        logger.info(new Date() + ": Code " + response + " given to WorkerId: " + this.context.workerId);

        return response;
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