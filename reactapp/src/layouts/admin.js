import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/common.css";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info"
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
                    <div className="row informationRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <h3>Admin</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Admin);
