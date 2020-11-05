import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import Plot from 'react-plotly.js';
import "../styles/rack_dashboard.css";

import {
    Table,
    Button,
    Card,
    CardText,
    CardTitle,
    CardBlock,
    CardFooter,
    Input,
    Col,
    Row,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";
import "../styles/experiments.css";

class bayDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bay: [],
            isplantColumnsModelOpen: false,
            device_uuid: "",
            new_column_name:"",
            bay_id: "",
            numPlants: 10,
            measures: [],
            plants:[],
            plant_notes:{},
            columnTypeCaret:'Pick column data type',
            iscolumnTypeDropDownOpen:false,
            plant_column_headers: ["Block Label","Plant Height", "Plant Weight"],
            plantIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        }
    }


    componentDidMount() {
        this.getbayDetails()
        if (this.state.device_type == "food_server") {
            this.setState({numPlants: 10})
        }
    }

    componentDidUpdate(e) {

    }
    submitMeasurements=()=>{
        return fetch('http://127.0.0.1:5000/api/submit_measurements/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid,
                'bay_uuid': this.props.match.params.bay_uuid,
                'plants':this.state.plants,
                "plant_notes":this.state.plant_notes
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                // this.setState({device_uuid: responseJson["bay"]["bay_beaglebone"]}, this.getDeviceDetails)
                // this.setState({bay_id: responseJson["bay"]["bay_id"]})
                window.location.href = "/experiment/"+this.props.match.params.experiment_uuid
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getTempDetails = (device_uuid) => {
        return fetch('http://127.0.0.1:5000/api/get_temp_details/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'selected_device_uuid': device_uuid
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson["message"] === "Success") {

                    let tempData = responseJson["data"]["temp"]
                    let RHData = responseJson["data"]["RH"]

                    tempData.forEach(function (d) {
                        d.value = parseFloat(d.value);
                    });
                    RHData.forEach(function (d) {
                        d.value = parseFloat(d.value)
                    });
                    let rh_data_x = []
                    let rh_data_y = []
                    RHData.forEach(function (d) {
                        rh_data_x.push(d.time);
                        rh_data_y.push(d.value);
                    });
                    this.setState({'rh_data_x': rh_data_x})
                    this.setState({'rh_data_y': rh_data_y})
                    this.setState({
                        'rh_data': [{
                            type: "scatter",
                            mode: "lines",
                            name: '',
                            x: rh_data_x,
                            y: rh_data_y,
                            line: {color: '#95266A'}
                        }]
                    });

                    this.setState({
                        'rh_layout': {
                            width: 350,
                            height: 450,
                            xaxis: {
                                autorange: true,
                                tickformat: '%Y-%m-%dH:%M:%S',
                                rangeInput: {
                                    type: 'date'
                                }
                            },
                            yaxis: {
                                autorange: true,
                                type: 'linear'
                            }
                        }
                    });

                    let temp_data_x = []
                    let temp_data_y = []
                    tempData.forEach(function (d) {
                        temp_data_x.push(d.time);
                        temp_data_y.push(d.value);
                    });
                    this.setState({'temp_data_x': temp_data_x})
                    this.setState({'temp_data_y': temp_data_y})
                    this.setState({
                        'temp_data': [{
                            type: "scatter",
                            mode: "lines+markers",
                            name: '',
                            x: temp_data_x,
                            y: temp_data_y,
                            line: {color: '#008BC2'}
                        }]
                    });
                    this.setState({
                        'temp_layout': {
                            width: 350,
                            height: 450,
                            xaxis: {
                                autorange: true,
                                tickformat: '%Y-%m-%dH:%M:%S',
                                rangeInput: {
                                    type: 'date'
                                }
                            },
                            yaxis: {
                                autorange: true,
                                type: 'linear'
                            }
                        }
                    });

                    this.setState({'show_temp_line': true})
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getCO2Details = (device_uuid) => {
        return fetch('http://127.0.0.1:5000/api/get_co2_details/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'selected_device_uuid': device_uuid
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson["response_code"] == 200) {

                    let co2Data = responseJson["results"]

                    co2Data.forEach(function (d) {
                        d.value = parseFloat(d.value);
                    });

                    let co2_data_x = []
                    let co2_data_y = []
                    co2Data.forEach(function (d) {
                        co2_data_x.push(d.time);
                        co2_data_y.push(d.value);
                    });
                    this.setState({'co2_data_x': co2_data_x})
                    this.setState({'co2_data_y': co2_data_y})
                    this.setState({
                        'co2_data': [{
                            type: "scatter",
                            mode: "lines+markers",
                            name: '',
                            x: co2_data_x,
                            y: co2_data_y,
                            line: {color: '#ECAD48'}
                        }]
                    });

                    this.setState({
                        'co2_layout': {
                            width: 350,
                            height: 450,
                            xaxis: {
                                autorange: true,
                                tickformat: '%Y-%m-%dH:%M:%S',
                                rangeInput: {
                                    type: 'date'
                                }
                            },
                            yaxis: {
                                autorange: true,
                                type: 'linear'
                            }
                        }
                    });

                }

            })
            .catch((error) => {
                console.error(error);
            });
    }

    addPlantHeaderColumns = () => {
        this.setState({isplantColumnsModelOpen: true});

    }

    toggleColumnModal = () => {
        this.setState({isplantColumnsModelOpen: !this.state.isplantColumnsModelOpen});
    }
    toggleColumnTypeDropdown = ()=>{
           this.setState({iscolumnTypeDropDownOpen: !this.state.iscolumnTypeDropDownOpen});

    }
    submitColumnType = () => {
        let current_colums = this.state.plant_column_headers;
        current_colums.push(this.state.new_column_name)
        this.setState({plant_column_headers:current_colums})
        this.setState({isplantColumnsModelOpen:false})
    }

    getDeviceDetails = () => {
        this.getTempDetails(this.state.device_uuid)
        this.getCO2Details(this.state.device_uuid)
    }

    getbayDetails = () => {
        return fetch('http://127.0.0.1:5000/api/get_rack_details/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid,
                'bay_uuid': this.props.match.params.bay_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({device_uuid: responseJson["bay"]["bay_beaglebone"]}, this.getDeviceDetails)
                this.setState({bay_id: responseJson["bay"]["bay_id"]})

            })
            .catch((error) => {
                console.error(error);
            });
    };

    uploadData=(plant_id,e)=>{
        return fetch('http://127.0.0.1:5000/api/upload_data/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid,
                'bay_uuid': this.props.match.params.bay_uuid,
                'plant_id': this.props.match.params.plant_id
            })
        }).then((response) => response.json())
            .then((responseJson) => {


            })
            .catch((error) => {
                console.error(error);
            });
    }
    addColumnType = (columntype,e)=>{
        this.setState({columnTypeCaret:columntype})
    }
    handleChange=(event) =>{
        this.setState({[event.target.name]: event.target.value});
        event.preventDefault();
    }
    addPlantMeasurement =  (i,event) =>{
        let state_json = this.state.plants
        let plant_state_json = {}
        let varname = this.state.plant_column_headers[i]
        plant_state_json[varname]=event.target.value
        state_json[i] = plant_state_json
        this.setState({plants:state_json})
    }
    addPlantNotes = (i,event)=>{
        let state_json = this.state.plant_notes
        state_json[i] = {}
        state_json[i]["notes"]=event.target.value
        this.setState({plant_notes:state_json})
    }

    render() {


        let columns_html = []
        let columns_rows = []
        for (var i = 0; i < this.state.plant_column_headers.length; i++) {
            columns_html.push(<th>{this.state.plant_column_headers[i]}</th>)
            columns_rows.push(<td><Input placeholder="" id="" onChange={this.addPlantMeasurement.bind(this,i)}/></td>)

        }
        let plants_tr = []
        for (var i = 0; i < this.state.numPlants; i++) {
            plants_tr.push(<tr>
                <td>
                    #{this.state.plantIds[i]}
                </td>
                <td>
                    <Input type="textarea" onChange={this.addPlantNotes.bind(this,i)}/>
                </td>
                {columns_rows}
                <td><Button onClick={this.uploadData.bind(this,i)}>Upload</Button></td>
            </tr>)
        }

        return ( <div className="wrapper">
            <div className="main-panel" ref="mainPanel">
                <Header {...this.props} />
                <div className="row dashboardRow">
                    <div className="col-md-12">
                        <Breadcrumb tag="nav" listTag="div">
                            <BreadcrumbItem tag="a" href="/">Experiments</BreadcrumbItem>
                            <BreadcrumbItem tag="a" href={"/experiment/"+this.props.match.params.experiment_uuid}>Experiment</BreadcrumbItem>
                            <BreadcrumbItem active tag="span">
                              {this.state.bay_id}
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </div>

                <div className="row dashboardRow">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <CardTitle> Temperature </CardTitle>
                                <div className="row plot-row" style={{display: 'block'}}>
                                    <strong className="no-cursor"> <Plot data={this.state.temp_data}
                                                                         layout={this.state.temp_layout}
                                                                         onInitialized={(figure) => this.setState(figure)}
                                                                         onUpdate={(figure) => this.setState(figure)}/>
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Card>
                            <CardBlock>
                                <CardTitle> Relative Humidity </CardTitle>
                                <div className="row plot-row" style={{display: 'block'}}>
                                    <strong className="no-cursor"> <Plot data={this.state.rh_data}
                                                                         layout={this.state.rh_layout}
                                                                         onInitialized={(figure) => this.setState(figure)}
                                                                         onUpdate={(figure) => this.setState(figure)}/>
                                    </strong>
                                </div>
                            </CardBlock>
                        </Card>
                    </div>

                </div>
                <div className="row dashboardRow">
                    <div className="col-md-6">
                    <Card>
                            <CardBlock>
                                <CardTitle> Carbon Dioxide </CardTitle>
                                <div className="row" style={{display: 'block'}}>
                                    <strong className="no-cursor"> <Plot data={this.state.co2_data}
                                                                         layout={this.state.co2_layout}
                                                                         onInitialized={(figure) => this.setState(figure)}
                                                                         onUpdate={(figure) => this.setState(figure)}
                                                                         config={this.state.config}/>
                                    </strong>
                                </div>
                            </CardBlock>
                        </Card>
                    </div>
                </div>
                <div className="row dashboardRow">
                    <div className="col-md-2">
                        <Button onClick={this.addPlantHeaderColumns}>Add Columns</Button>
                    </div>
                </div>
                <div className="row dashboardRow tableRow">
                    <div className="col-md-12">
                        <Table>
                            <thead>
                            <tr>
                                <th>Plant No</th>
                                <th>Notes</th>
                                {columns_html}
                                <th>Upload Data</th>
                            </tr>
                            </thead>
                            <tbody>
                            {plants_tr}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div className="row dashboardRow tableRow">
                    <div className="col-md-12">
                        <Button onClick={this.submitMeasurements}>Submit Measurements</Button>
                    </div>
                </div>
            </div>
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
                            <Dropdown isOpen={this.state.iscolumnTypeDropDownOpen} toggle={this.toggleColumnTypeDropdown}>
                                <DropdownToggle caret>
                                    {this.state.columnTypeCaret}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.addColumnType.bind(this,"Text")}>Text</DropdownItem>
                                    <DropdownItem onClick={this.addColumnType.bind(this,"Decimal")}>Decimal</DropdownItem>
                                    <DropdownItem onClick={this.addColumnType.bind(this,"Integer")}>Integer</DropdownItem>
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
        </div>)
    }
}

export default withCookies(bayDashboard);
