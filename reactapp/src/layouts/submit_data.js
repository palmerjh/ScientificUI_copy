import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/common.css";
import {Button,Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from "reactstrap";

class SubmitData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            experiment: {},
            deviceTypeOpen:false,
            selectDeviceTypeText:'Pick a Device Type'
        }
    }

    handleChange=(key,event)=>{
        let experiment_json = this.state.experiment;
        experiment_json[key] = event.target.value;
        this.setState({experiment:experiment_json})
        event.preventDefault();
    }
    handleSubmit = () => {
        return fetch('http://localhost:5000/api/submit_new_experiment/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment': this.state.experiment
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("F",responseJson)
                alert("Successfully submitted")
            })
            .catch((error) => {
                console.error(error);
            });

    }
    selectDeviceType = (device_type,e) => {
        let experiment_json = this.state.experiment
        experiment_json["device_type"] = device_type
        this.setState({experiment:experiment_json})
        this.setState({selectDeviceTypeText:device_type})
    }
    deviceTypeToggle = () => {
        this.setState(prevState => ({
            deviceTypeOpen: !prevState.deviceTypeOpen
        }));
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
                            {/*<h3>Submit Data</h3>*/}
                            <p>Please follow the Data Docs for the right format to upload your experiment data. A new experiment will be registered.</p>
                        </div>
                    </div>
                    <div className="row informationRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <form onSubmit={this.handleSubmit}>
                                <div className="row formRow">
                                    Experiment Name:
                                </div>
                                 <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['experiment_name']}
                                           onChange={this.handleChange.bind(this,'experiment_name')}/>
                                </div>
                                <div className="row formRow">
                                    Device Type:
                                </div>
                                <div className="row formRow">
                                 <Dropdown isOpen={this.state.deviceTypeOpen}
                                                      toggle={this.deviceTypeToggle}>
                                                <DropdownToggle caret>
                                                    {this.state.selectDeviceTypeText}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={this.selectDeviceType.bind(this,"pfc_edu")}>PFC EDU</DropdownItem>
                                                    <DropdownItem onClick={this.selectDeviceType.bind(this,"food_server")}>Food Server</DropdownItem>
                                                    <DropdownItem onClick={this.selectDeviceType.bind(this,"tree_computer")}>Hazelnut Computer</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                </div>
                                <div className="row formRow">
                                    Started By:
                                </div>
                                <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['started_by']}
                                           onChange={this.handleChange.bind(this,'started_by')}/>
                                </div>
                                <div className="row formRow">
                                    Experiment Notes:
                                </div>
                                 <div className="row formRow">
                                    <textarea className="inputRow" value={this.state.experiment['experiment_notes']}
                                           onChange={this.handleChange.bind(this,'experiment_notes')}/>
                                </div>

                                 <div className="row formRow">
                                     <div className="col-md-6">
                                         <p> Add Rack BeagleBone ID </p>
                                         <p><i>Columns: rack_id, beaglebone_uuid</i></p>
                                     </div>
                                     <div className="col-md-4">
                                        <Button>Upload</Button>
                                     </div>
                                 </div>
                                <div className="row formRow">
                                     <div className="col-md-6">
                                         <p> Add Plant Data </p>
                                         <p><i>Columns: rack_id, plant_id, //List of all Plant inputs// </i></p>
                                     </div>
                                     <div className="col-md-4">
                                        <Button>Upload</Button>
                                     </div>
                                 </div>
                                <div className="row formRow">
                                <Button className="submitButtonRow" onClick={this.handleSubmit}>Submit New Experiment</Button>
                                 </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(SubmitData);
