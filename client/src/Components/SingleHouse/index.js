import * as React from 'react';
import './index.css';
import { Button, Modal} from "react-bootstrap";
import WorkerIdContext from "../WorkerIdContext";

class SingleHouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleClose = () => {
        window.myLogger.info(new Date() + ": House " + this.props.house.description + " with House Id " +
            this.props.house["_id"]  + " closed by WorkerId: " + this.context);
        this.setState({ showModal: false });
    }

    handleShow = () => {
        window.myLogger.info(new Date() + ": House " + this.props.house.description + " with House Id " +
            this.props.house["_id"]  + " clicked by WorkerId: " + this.context);
        this.setState({showModal: true});
    }

    handleSubmit = () => {
        window.myLogger.info(new Date() + ": House " + this.props.house.description + " with House Id " +
            this.props.house["_id"]  + " selected by WorkerId: " + this.context);
    }

    render() {
        let house = this.props.house;
        return (
            <div className={"singleHouse"}>
                <a href={"#"} className={"card"} onClick={this.handleShow}>
                    <div className={"figure"}>
                        <img src={house.url} alt={"image"} width={"500"} height={"300"} />
                        <div className={"figType"}>FOR RENT</div>
                    </div>
                    <h2>{house.description.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</h2>
                    <div className={"cardAddress"}><span className={"icon-pointer"} />
                        {house.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                    </div>
                </a>
                <Modal size={"lg"} show={this.state.showModal} onHide={this.handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title className={"modalTitle"}>{house.description.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"modalFigure"}>
                            <img src={house.url} alt={house.name} />
                        </div>
                        <div className={"modalCardAddress"}>
                            { house.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) }
                        </div>
                        <div className={"card-text"}>
                            { house.summary.split(/ \\n/g).map(houseItem => {
                                return (
                                    <li>{ houseItem }</li>
                                )
                            }) }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Back
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Confirm Your Choice
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

SingleHouse.contextType = WorkerIdContext;

export default SingleHouse;