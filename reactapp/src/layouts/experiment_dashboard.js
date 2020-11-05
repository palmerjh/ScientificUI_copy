import React from "react";
import {withCookies} from "react-cookie";
import "../styles/experiments.css";
import Header from "../components/header";
import {Button, Card, Form, Table} from "reactstrap";
import axios from "axios";

const device_types = {
    "PFC_EDU": "/add_pfc_edu/",
    "food_server": "/add_food_server/"
}

class ExperimentDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bays: [],
            toolOpen: false,
            experiment: {
                "experiment_name": "",
                "metadata": {
                    "bay_design_version": "",
                    "rack_design_version": ""
                }
            }
        }
        this.experiment_uuid = this.props.match.params.experiment_uuid
    }

    componentWillMount() {
        this.getExperimentDetails()
        this.getExperimentRackDetails()
    }

    toggleToolbelt = (e) => {
        e.preventDefault()
        this.setState({toolOpen: !this.state.toolOpen})
    }

    addDevice = () => {
        window.location.href = "/add_device/" + this.state.experiment['experiment_uuid'] + "/"
    }
    getExperimentRackDetails = () => {
        return fetch('http://127.0.0.1:5000/api/get_racks_by_experiment/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({bays: responseJson["bays"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getExperimentDetails = () => {
        let experiment_uuid = this.experiment_uuid
        console.log(experiment_uuid)
        return fetch('http://127.0.0.1:5000/api/get_experiment_by_uuid/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({experiment: responseJson["experiment"]})
            })
            .catch((error) => {
                console.error(error);
            });
    };

    attachManualData = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', 'filename');
        data.append('experiment_uuid',this.state.experiment['experiment_uuid'])
        axios.post('http://127.0.0.1:5000/api/import_data_component/', data)
            .then((response) => {
                this.setState({bay_json: response['data']['bay_env_data']})
                let object_keys = Object.keys(response['data']['bay_env_data'])
                this.setState({data_keys: Object.keys(response['data']['bay_env_data'][object_keys[0]])})
                alert("Data Uploaded Successfully")
                window.location.reload()
            })
            .catch(function (error) {
                console.log(error);
                alert("Data Upload Fail")
            });

    }

    goToThisPage = (page, e) => {
        window.location.href = "/" + page + "/" + this.state.experiment['experiment_uuid'] + "/"
    }

    render() {

        let bays_tr = []
        for (var i = 0; i < this.state.bays.length; i++) {
            bays_tr.push(<tr>
                <td>
                    <a href={"/rack_dashboard/" + this.props.match.params.experiment_uuid + "/" + this.state.bays[i]['bay_uuid'].toString()}>{this.state.bays[i]['bay_id']}</a>
                </td>
                <td>
                    {this.state.bays[i]['bay_beaglebone']}
                </td>
                <td>
                    <a target='_blank' rel='noopener noreferrer'
                       href={this.state.bays[i]['bay_beaglebone_remote_access']}>{this.state.bays[i]['bay_beaglebone_remote_access']}</a>
                </td>
            </tr>)
        }
        return (
            <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="container experiment-container">
                        <div className="row dashboardRow">
                            <div className="col-md-12">
                                <Card className="dashboard-card text-left">
                                    <div className="card-title">
                                        <h3>   {this.state.experiment["experiment_name"]} </h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Experiment Objective</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["experiment_objective"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Photo Period</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["photo_period"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Bay Version</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["metadata"]["bay_design_version"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Rack Version</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["metadata"]["rack_design_version"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Experiment Notes</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["experiment_notes"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Experiment Started At</b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["started_at"]}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <b> Experiment Started By </b>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.experiment["started_by"]}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                        </div>


                        <div className="row dashboardRow">
                            <div className="col-md-6">
                                <a onClick={this.toggleToolbelt}><b>Toggle ToolBar >></b> </a>
                            </div>
                        </div>
                        {this.state.toolOpen === true ?
                            <div className="row dashboardRow">
                                <div className="col-md-12">
                                    <Button className={"add-margin-right"}
                                            onClick={this.goToThisPage.bind(this, "visualize_data")}>Visualize
                                        Data</Button>
                                    <Button className={"add-margin-right"}
                                            onClick={this.goToThisPage.bind(this, "analyze_data")}>Analyze Data</Button>
                                    <Button className={"add-margin-right"}
                                            onClick={this.goToThisPage.bind(this, "download_data")}>Download
                                        Data</Button>

                                </div>
                                <div className="col-md-12 added-padding">
                                    <Form onSubmit={this.attachManualData} method="post"
                                      encType="multipart/form-data">
                                    <input ref={(ref) => {
                                        this.uploadInput = ref;
                                    }} type="file" name="file"/>
                                    <input type="submit" value="Attach Data at Bay Level"/>
                                </Form>
                                </div>
                            </div> : ""}


                        <div className="row dashboardRow">
                            <div className="col-md-12">
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Bay No</th>
                                        <th>Beaglebone</th>
                                        <th>Beaglebone Access</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bays_tr}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="row dashboardRow">
                            <div className="col-md-6">
                                <Button onClick={this.addDevice}>Add Devices </Button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(ExperimentDashboard);
