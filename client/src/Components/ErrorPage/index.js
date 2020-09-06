import * as React from 'react';
import Loader from "../Loader";

class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
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
                    <div className="thankyou-header">
                        <h1>Sorry, you do not have any more tasks.</h1>
                        <h2 className={"bonus"}>
                            This can be because you have already completed the tasks assigned to you, or you have refreshed the page too many times.
                        </h2>
                    </div>

        );
    }
}

export default ErrorPage;