import React from "react";
import {withCookies} from "react-cookie";
import {Button, Table, Breadcrumb, BreadcrumbItem} from "reactstrap";
import Header from "../components/header";
import "../styles/common.css";

class AddFoodServerDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    componentDidUpdate(e) {
    }

    render() {

        return (
           <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="container experiment-container">


                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(AddFoodServerDevice);
