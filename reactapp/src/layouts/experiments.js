import React from "react";
import {withCookies} from "react-cookie";
import {Button, Table, Breadcrumb, BreadcrumbItem} from "reactstrap";
import "../styles/experiments.css";
import Header from "../components/header";

class Experiments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            experiments: [],
        }
    }

    componentDidMount() {
        this.getExperiments()
    }

    componentWillUnmount() {

    }

    componentDidUpdate(e) {

    }

    getExperiments = () => {

        return fetch('http://127.0.0.1:5000/api/get_all_experiments/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({experiments: responseJson["experiments"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    registerNewExperiment() {
        window.location.href = "/register_new_experiment"
    }

    render() {
        let table_rows = []
        for (let experiment of this.state.experiments) {
            table_rows.push(<tr key={experiment['experiment_uuid']}>
                <td><a href={"/experiment/" + experiment['experiment_uuid']}>{experiment['experiment_name']}</a></td>
                <td>{experiment['experiment_objective']}</td>
                <td>{experiment['started_by']}</td>
                <td>{experiment['started_at']}</td>
                <td> <a className={"on-going-label"} style={{"color":"white"}}>On Going</a></td>
            </tr>)
        }
        return (
            <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="row buttonRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-4">
                            <Button onClick={this.registerNewExperiment}>Register a new experiment</Button>
                        </div>
                        <div className="col-md-6">
                            <Breadcrumb tag="nav" listTag="div">
                                <BreadcrumbItem active tag="span">Experiments</BreadcrumbItem>
                            </Breadcrumb>

                        </div>
                    </div>
                    <div className="row tableRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <Table>
                                <thead>
                                <tr>
                                    <th>Experiment Name</th>
                                    <th>Experiment Purpose</th>
                                    <th>Started By</th>
                                    <th>Started At</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table_rows}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default withCookies(Experiments);
