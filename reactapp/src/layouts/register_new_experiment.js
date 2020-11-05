import React from "react";
import {withCookies} from "react-cookie";
import {Button,Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from "reactstrap";
import Header from "../components/header";
import "../styles/experiments.css";

class RegisterNewExperiment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            experiment: {
                "metadata":{}
            },
            deviceTypeOpen:false,
            bayDesignOpen:false,
            rackDesignOpen:false,
            selectDeviceTypeText:'Pick a Device Type',
            selectRackTypeText:'Pick a Rack Type',
            bayDesignText:'Pick a Bay Design Version',
            rackDesignText:'Pick a Rack Design Version'
        }
    }

    handleChange=(key,event)=>{
        let experiment_json = this.state.experiment;
        experiment_json[key] = event.target.value;
        this.setState({experiment:experiment_json})
        event.preventDefault();
    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentDidUpdate(e) {

    }
    handleSubmit = () => {
        return fetch('http://127.0.0.1:5000/api/submit_new_experiment/', {
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
                console.log(responseJson)
                window.location.href="/"
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
    selectBayDesignType=(bay_design,e)=>{
        let experiment_json = this.state.experiment
        experiment_json["metadata"]["bay_design_version"] = bay_design
        this.setState({experiment:experiment_json})
        this.setState({bayDesignText:bay_design})
    }
    selectRackDesignType=(rack_design,e)=>{
        let experiment_json = this.state.experiment
        experiment_json["metadata"]["rack_design_version"] = rack_design
        this.setState({experiment:experiment_json})
        this.setState({rackDesignText:rack_design})
    }
    deviceTypeToggle = () => {
        this.setState(prevState => ({
            deviceTypeOpen: !prevState.deviceTypeOpen
        }));
    }
    bayDesignToggle = () => {
        this.setState(prevState => ({
            bayDesignOpen: !prevState.bayDesignOpen
        }));
    }
    rackDesignToggle = () => {
        this.setState(prevState => ({
            rackDesignOpen: !prevState.rackDesignOpen
        }));
    }
    render() {
        return (
            <div className="wrapper">

                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="row buttonRow">
                        <div className="col-md-4"></div>
                        <div className="col-md-4"> <div className="row formRow"> <h3>Register New Experiment </h3></div></div>
                        <div className="col-md-4"></div>
                    </div>
                    <div className="row buttonRow">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <form onSubmit={this.handleSubmit}>
                                <div className="row formRow">
                                    Experiment Name:
                                </div>
                                 <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['experiment_name']}
                                           onChange={this.handleChange.bind(this,'experiment_name')}/>
                                </div>
                                <div className="row formRow">
                                    Experiment Objective(Purpose):
                                </div>
                                 <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['experiment_objective']}
                                           onChange={this.handleChange.bind(this,'experiment_objective')}/>
                                </div>
                                <div className="row formRow">
                                    Treatments:
                                </div>
                                 <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['experiment_treatments']}
                                           onChange={this.handleChange.bind(this,'experiment_treatments')}/>
                                </div>
                                <div className="row formRow">
                                    Photo Period:
                                </div>
                                 <div className="row formRow">
                                    <input className="inputRow" type="text" value={this.state.experiment['photo_period']}
                                           onChange={this.handleChange.bind(this,'photo_period')}/>
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
                                {this.state.selectDeviceTypeText === "food_server"?
                                    <div>
                                <div className="row formRow">
                                   <div className="col-md-4">
                                      Bay Design Version
                                   </div>
                                    <div className="col-md-6">
                                       <Dropdown isOpen={this.state.bayDesignOpen}
                                                      toggle={this.bayDesignToggle}>
                                                <DropdownToggle caret>
                                                    {this.state.bayDesignText}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={this.selectBayDesignType.bind(this,"bay_v1.0")}>bay_v1.0</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                   </div>

                                </div>
                                <div className="row formRow">
                                   <div className="col-md-4">
                                      Rack Design Version
                                   </div>
                                    <div className="col-md-6">
                                         <Dropdown isOpen={this.state.rackDesignOpen}
                                                      toggle={this.rackDesignToggle}>
                                                <DropdownToggle caret>
                                                    {this.state.rackDesignText}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={this.selectRackDesignType.bind(this,"rack_v1.0")}>rack_v1.0</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>

                                   </div>

                                </div></div>:<div></div>}
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

export default withCookies(RegisterNewExperiment);
