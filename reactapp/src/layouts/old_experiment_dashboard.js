import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import {
    Table,
    Button,
    Card,
    CardText,
    CardTitle,
    CardFooter,
    Col,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Input, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";
import "../styles/experiments.css";
import Select from 'react-select';

const outputOptions = [
    {value: 'plant_height', label: 'Plant Height'},
    {value: 'plant_weight', label: 'Plant Weight'},
    {value: 'plant_massspec', label: 'Plant GCMS'}
];


class OldExperimentDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPeripheralOption: [],
            plant_column_headers: ["Other"],
            backgroundColor: "black",
            isplantColumnsModelOpen: false,
            activeColor: "info",
            experiment: {},
            peripheralsSelected: new Array(5),
            warningInputsOpen: false,
            warningStatesOpen: false,
            warningTriggerOpen: false,
            warningValuesOpen: false,
            racks: [],
            notes: [
                {
                    "experiment_notes": "",
                    "started_at": ""
                }
            ],
            input_measures: [],
            isNotesModal: false,
            output_measures: [],
            experiment_notes: ""
        }
    }

    warningInputsToggle = () => {
        this.setState(prevState => ({
            warningInputsOpen: !prevState.warningInputsOpen
        }));
    }
    warningStatesToggle = () => {
        this.setState(prevState => ({
            warningStatesOpen: !prevState.warningStatesOpen
        }));
    }
    warningTriggerToggle = () => {
        this.setState(prevState => ({
            warningTriggerOpen: !prevState.warningTriggerOpen
        }));
    }
    submitColumnType = () => {
        let current_colums = this.state.plant_column_headers;
        current_colums.push(this.state.new_column_name)
        this.setState({plant_column_headers: current_colums})
        this.setState({isplantColumnsModelOpen: false})
    }
    addColumnType = (columntype, e) => {
        this.setState({columnTypeCaret: columntype})
    }
    toggleColumnModal = () => {
        this.setState({isplantColumnsModelOpen: !this.state.isplantColumnsModelOpen});
    }
    toggleColumnTypeDropdown = () => {
        this.setState({iscolumnTypeDropDownOpen: !this.state.iscolumnTypeDropDownOpen});

    }
    // handleChange=(event) =>{
    //     this.setState({[event.target.name]: event.target.value});
    //     event.preventDefault();
    // }
    warningValuesToggle = () => {
        this.setState(prevState => ({
            warningValuesOpen: !prevState.warningValuesOpen
        }));
    }

    componentDidMount() {
        this.getExperimentDetails()
        this.getExperimentRackDetails()
        this.getExperimentInputOutput()
        this.getExperimentNotes()
    }

    addRack = () => {
        window.location.href = "/add_rack/" + this.state.experiment['experiment_uuid'] + "/" + this.state.experiment['device_type'] + "/"
    }
    getExperimentDetails = () => {

        return fetch('http://localhost:5000/api/get_experiment_by_uuid/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({experiment: responseJson["experiment"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getExperimentRackDetails = () => {
        return fetch('http://localhost:5000/api/get_racks_by_experiment/', {
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
                this.setState({racks: responseJson["racks"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getExperimentInputOutput = () => {
        return fetch('http://localhost:5000/api/get_experiment_io/', {
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
                this.setState({input_measures: responseJson["input_measures"]})
                this.setState({output_measures: responseJson["output_measures"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentWillUnmount() {

    }

    componentDidUpdate(e) {

    }


    toggleNotesModelOpen = () => {
        this.setState({isNotesModal: !this.state.isNotesModal})
    }
    handleDropdown = (index, event) => {
        let peripheralsSelected = this.state.peripheralsSelected;
        if (peripheralsSelected[index] != undefined) {
            peripheralsSelected[index] = []
            for (var j = 0; j < event.length; j++) {
                console.log(event[j], j)
                peripheralsSelected[index].push(event[j]['value'])
            }
        }
        else {
            peripheralsSelected[index] = [event[0]['value']]
        }
        console.log(peripheralsSelected, "h")
        this.setState({peripheralsSelected: peripheralsSelected})
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        event.preventDefault();
    }
    getExperimentNotes = () => {
        return fetch('http://localhost:5000/api/get_experiment_notes/', {
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
                this.setState({notes: responseJson["notes"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    endExperiment = () => {
        return fetch('http://localhost:5000/api/end_experiment/', {
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
                alert("Successfully Ended")
            })
            .catch((error) => {
                console.error(error);
            });
    }
    submitExperimentNotes = () => {
        return fetch('http://localhost:5000/api/submit_experiment_notes/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid,
                'notes': this.state.experiment_notes
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                alert("Successfully Added")
                this.setState({isNotesModal: false})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    exportManualData = ()=>{
        window.location.href = "/export_manual_data/"+this.props.match.params.experiment_uuid
    }
    GCMSAnalysis = () => {
        window.location.href = "/gcms_data/" + this.props.match.params.experiment_uuid
    }
     addPlantMeasurement =  (i,event) =>{
        let state_json = this.state.plants
        state_json[i] = {}
        let varname = this.state.plant_column_headers[i]
        state_json[i][varname]=event.target.value
        this.setState({plants:state_json})
    }
    render() {
        let input_measures_html = []
        for (var i = 0; i < this.state.input_measures.length; i++) {
            input_measures_html.push(<DropdownItem>
                {this.state.input_measures[i]}
            </DropdownItem>)
        }
        let output_measures_html = []
        for (var i = 0; i < this.state.output_measures.length; i++) {
            output_measures_html.push(<li>
                {this.state.output_measures[i]}
            </li>)
        }

        let columns_html = []
        let columns_rows = []
        for (var i = 0; i < this.state.plant_column_headers.length; i++) {
            columns_html.push(<th>{this.state.plant_column_headers[i]}</th>)
            columns_rows.push(<td><Input placeholder="" id="" onChange={this.addPlantMeasurement.bind(this, i)}/></td>)

        }
        let racks_tr = []
        for (var i = 0; i < this.state.racks.length; i++) {
            racks_tr.push(<tr>
                <td>
                    <a href={"/rack_dashboard/" + this.props.match.params.experiment_uuid + "/" + this.state.racks[i]['rack_uuid'].toString()}>{this.state.racks[i]['rack_id']}</a>
                </td>
                <td>
                    {this.state.racks[i]['rack_beaglebone']}
                </td>
                <td>
                    {columns_rows}
                    <a target='_blank' rel='noopener noreferrer' href={this.state.racks[i]['rack_beaglebone_remote_access']}>{this.state.racks[i]['rack_beaglebone_remote_access']}</a>
                </td>
            </tr>)
        }
        let notes_tr = []
        for (var i = 0; i < this.state.notes.length; i++) {
            notes_tr.push(<div className="row notesRow">
                <div className="col-md-1">
                </div>
                <div className="col-md-4">
                    {this.state.notes[i].started_at}
                </div>
                <div className="col-md-6">
                    {this.state.notes[i].experiment_notes}
                </div>
            </div>)
        }

        return (
            <div className="wrapper">

                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="row buttonRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-6">
                          <Breadcrumb tag="nav" listTag="div">
                            <BreadcrumbItem tag="a" href="/">Experiments</BreadcrumbItem>
                            <BreadcrumbItem active tag="span">
                              {this.state.experiment['experiment_name']}
                            </BreadcrumbItem>
                          </Breadcrumb>
                        </div>
                    </div>
                    <div className="row dashboardRow">
                        <div className="col-md-2">
                            <Button onClick={this.GCMSAnalysis}>Tools</Button>
                        </div>
                         <div className="col-md-2">
                             <Button onClick={this.exportManualData}>Export Manual Data</Button>
                         </div>
                    </div>
                    <div className="row dashboardRow">
                        <div className="col-md-12">
                            <Card body>
                                <CardTitle>Experiment Details</CardTitle>
                                <CardText>
                                    <div className="row">
                                        <div className="col-md-2">
                                            Experiment UUID
                                        </div>
                                        <div className="col-md-10">
                                            {this.state.experiment['experiment_uuid']}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            Experiment Name
                                        </div>
                                        <div className="col-md-10">
                                            {this.state.experiment['experiment_name']}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            Description
                                        </div>
                                        <div className="col-md-10">
                                            {this.state.experiment['experiment_notes']}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            Started At
                                        </div>
                                        <div className="col-md-10">
                                            {this.state.experiment['started_at']}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2">
                                            Started By
                                        </div>
                                        <div className="col-md-10">
                                            {this.state.experiment['started_by']}
                                        </div>
                                    </div>
                                </CardText>
                                <div className="row">
                                    <div className="col-md-2">
                                        <Button onClick={this.endExperiment}> End Experiment </Button>
                                    </div>
                                    <div className="col-md-2">
                                        <Button onClick={this.toggleNotesModelOpen}> Add Notes </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    {/*<div className="row dashboardRow">*/}
                    {/*<div className="col-md-6">*/}
                    {/*<Card body>*/}
                    {/*<CardTitle>Experiment Inputs</CardTitle>*/}
                    {/*<CardText>*/}
                    {/*<ul>{input_measures_html}</ul>*/}
                    {/*</CardText>*/}
                    {/*</Card>*/}
                    {/*</div>*/}
                    {/*<div className="col-md-6">*/}
                    {/*<Card body>*/}
                    {/*<CardTitle>Experiment Outputs</CardTitle>*/}
                    {/*<CardText><Select*/}
                    {/*isMulti*/}
                    {/*name="outputs"*/}
                    {/*options={outputOptions}*/}
                    {/*onChange={this.handleDropdown.bind(this, i)}*/}
                    {/*className="basic-multi-select"*/}
                    {/*classNamePrefix="select"*/}
                    {/*/></CardText>*/}
                    {/*</Card>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="row dashboardRow">
                        <div className="col-md-12">
                            <Card body>
                                <CardTitle>Set alerts</CardTitle>
                                <CardText>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Dropdown isOpen={this.state.warningInputsOpen}
                                                      toggle={this.warningInputsToggle}>
                                                <DropdownToggle caret>
                                                    Pick a warning variable
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {input_measures_html}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="col-md-3">
                                            <Dropdown isOpen={this.state.warningStatesOpen}
                                                      toggle={this.warningStatesToggle}>
                                                <DropdownToggle caret>
                                                    Pick a state
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem> greater than </DropdownItem>
                                                    <DropdownItem>=</DropdownItem>
                                                    <DropdownItem> less than </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                        <div className="col-md-3">
                                            <Input placeholder="Enter a value"/>
                                        </div>
                                        <div className="col-md-3">
                                            <Dropdown isOpen={this.state.warningTriggerOpen}
                                                      toggle={this.warningTriggerToggle}>
                                                <DropdownToggle caret>
                                                    Set warning level
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>Urgent</DropdownItem>
                                                    <DropdownItem>Notify</DropdownItem>
                                                    <DropdownItem>Log</DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </CardText>
                            </Card>
                        </div>
                    </div>
                    <div className="row dashboardRow">
                        <div className="col-md-2">
                            <Button onClick={this.addPlantHeaderColumns}>Add Columns</Button>
                        </div>
                    </div>
                    <div className="row dashboardRow">
                        <div className="col-md-12">
                            <Table>
                                <thead>
                                <tr>
                                    <th>Rack No</th>
                                    <th>Device</th>
                                    <th>Device UI</th>
                                </tr>
                                </thead>
                                <tbody>
                                {racks_tr}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="row dashboardRow">
                        <div className="col-md-12">
                            <Button onClick={this.addRack}> Add Rack </Button>
                        </div>
                    </div>
                </div>
                <div className="row dashboardRow">
                    <div className="col-md-12">
                        <b>Experiment Logs</b>
                    </div>
                </div>
                {notes_tr}
                <Modal
                    isOpen={this.state.isplantColumnsModelOpen}
                    toggle={this.toggleColumnModal}
                    contentLabel="Plant Columns Modal"
                >
                    <ModalHeader>
                        <h4>Add new column</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-10">
                                Column Header
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-10">
                                <Input placeholder="" id="new_column_name" name="new_column_name"
                                       value={this.state.new_column_name} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-10">
                                Column Type
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-10">
                                <Dropdown isOpen={this.state.iscolumnTypeDropDownOpen}
                                          toggle={this.toggleColumnTypeDropdown}>
                                    <DropdownToggle caret>
                                        {this.state.columnTypeCaret}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem
                                            onClick={this.addColumnType.bind(this, "Text")}>Text</DropdownItem>
                                        <DropdownItem
                                            onClick={this.addColumnType.bind(this, "Decimal")}>Decimal</DropdownItem>
                                        <DropdownItem
                                            onClick={this.addColumnType.bind(this, "Integer")}>Integer</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitColumnType}>Submit</Button>
                        <Button color="secondary" onClick={this.toggleColumnTypeDropdown}>Cancel</Button>

                    </ModalFooter>
                </Modal>
                <Modal
                    isOpen={this.state.isNotesModal}
                    toggle={this.toggleNotesModelOpen}
                    contentLabel="Plant Columns Modal"
                >
                    <ModalHeader>
                        <h4>Add Note</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-10">
                                <Input type="textarea" id="experiment_notes" name="experiment_notes"
                                       value={this.state.experiment_notes} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitExperimentNotes}>Submit</Button>
                        <Button color="secondary" onClick={this.toggleNotesModelOpen}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withCookies(OldExperimentDashboard);
