import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./index.css";

export default class LoadingIcon extends React.Component {
    render() {
        return(
            <Loader
                className = {"loading-icon"}
                type="ThreeDots"
                color="#0EAAA6"
            />
        );
    }
}