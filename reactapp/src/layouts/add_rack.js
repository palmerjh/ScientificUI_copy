import React from 'react';
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/add_rack.css";
import logo from "../assets/images/logo.png";
import {
    Table, Input, Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Button, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";
import Select from 'react-select';


class AddRack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPeripheralOption: [],
            selectedBeagleboneOption: [],
            selectedRecipeOption: [],
            peripheralsSelected: new Array(5),
            selectedRackId: new Array(5),
            selectedBeagleBones: new Array(5),
            selectedRecipes:new Array(5),
            peripheralsList: [],
            devicesList: [],
            recipesList:[],
            numRows: 10
        };

    }

    componentDidMount() {
        this.getRecipesList()
        this.getDevicesList()
    }


    getDevicesList = () => {
        return fetch("http://127.0.0.1:5000/api/get_devices/", {
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
                this.setState({devicesList: responseJson["devicesList"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    getRecipesList = () => {
        return fetch("http://127.0.0.1:5000/api/get_recipes/", {
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
                this.setState({recipesList: responseJson["recipesList"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        event.preventDefault();
    }

    handleSubmit=(event)=> {
        return fetch("http://127.0.0.1:5000/api/submit_bays_experiment/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body:JSON.stringify({
                "selected_racks":this.state.selectedRackId,
                "selected_beaglebones":this.state.selectedBeagleBones,
                "selected_peripherals":this.state.peripheralsSelected,
                "experiment_uuid":this.props.match.params.experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                window.location.href = "/experiment/"+this.props.match.params.experiment_uuid
                this.setState({peripheralsList: responseJson["peripheralsList"]})
            })
            .catch((error) => {
                console.error(error);
            });
        event.preventDefault();
    }

    addMoreRows=()=> {
        this.setState({numRows:this.state.numRows+2})
    }

    handleRackChange = (index,event) => {
        let selectedRackIds = this.state.selectedRackId;
        selectedRackIds[index] = event.target.value;
        this.setState({selectedRackIds:selectedRackIds})
    }

    handleBeagleBoneChange = (index, event) => {
        if(event == undefined) {
            return; // an option was cleared in the single Select
        }
        let selectedBeagleBones = this.state.selectedBeagleBones;
        selectedBeagleBones[index] = event['value']
        this.setState({selectedBeagleBones:selectedBeagleBones})
    }

    handleRecipeChange = (index, event) => {
        if(event == undefined) {
            return; // an option was cleared in the single Select
        }
        let selectedRecipes = this.state.selectedRecipes;
        selectedRecipes[index] = event['value']
        this.setState({selectedRecipes:selectedRecipes})
    }

    handleDropdown = (index, event) => {
        let peripheralsSelected = this.state.peripheralsSelected;
        if (peripheralsSelected[index] != undefined) {
            peripheralsSelected[index] = []
            for (var j = 0; j < event.length; j++) {
                console.log(event[j],j)
                peripheralsSelected[index].push(event[j]['value'])
            }
        }
        else {
            peripheralsSelected[index] = [event[0]['value']]
        }
        this.setState({peripheralsSelected: peripheralsSelected})
    }

    render() {
        let racks_tr = [];
        for (var i = 0; i < this.state.numRows; i++) {
            racks_tr.push(<tr>
                <td>
                    <Select
                        isClearable isSearchable
                        value={this.state.selectedBeagleboneOption[i]}
                        id={"beaglebone" + i.toString()}
                        name={"beaglebone" + i.toString()}
                        onChange={this.handleBeagleBoneChange.bind(this, i)}
                        options={this.state.devicesList}
                    />

                </td>
                <td>
                     <Input id="rack_id" placeholder="Enter Bay No"
                        value={this.state.selectedRackId[i]}
                        onChange={this.handleRackChange.bind(this,i)}/>
                </td>
                 <td>
                    <Select
                        isClearable isSearchable
                        value={this.state.selectedRecipeOption[i]}
                        id={"recipe" + i.toString()}
                        name={"recipe" + i.toString()}
                        onChange={this.handleRecipeChange.bind(this, i)}
                        options={this.state.recipesList}
                    />
                </td>
            </tr>);
        }
        return (
            <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="row buttonRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-4">
                          <Breadcrumb tag="nav" listTag="div">
                            <BreadcrumbItem tag="a" href="/">Experiments</BreadcrumbItem>
                            <BreadcrumbItem tag="a" href={"/experiment/"+this.props.match.params.experiment_uuid}>Experiment</BreadcrumbItem>
                            <BreadcrumbItem active tag="span">
                              Add Rack
                            </BreadcrumbItem>
                          </Breadcrumb>
                        </div>
                        <div className="col-md-4">
                            <h3 className="formTitle">Add Racks to the Experiment</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1"></div>
                         <div className="col-md-10">
                            <Table>
                                <thead>
                                <tr>
                                    <th>BeagleBone</th>
                                    <th>Bay No</th>
                                    <th>Apply Recipe</th>
                                </tr>
                                </thead>
                                <tbody>
                                {racks_tr}
                                </tbody>
                            </Table>
                         </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row inputRow add-margin-bottom">
                        <div className="col-md-1"></div>
                        <div className="col-md-11"><Button onClick={this.addMoreRows}>Add More Rows</Button>
                             <Button className={"add-margin-left"} onClick={this.handleSubmit}>Submit</Button></div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(AddRack);
