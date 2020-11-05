import React from "react";
import {withCookies} from "react-cookie";
import '../../node_modules/react-vis/dist/style.css';
import "../styles/import_manual_data.css";
import axios from 'axios';
import {
    Button,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Label,
    Navbar,
    NavbarBrand
} from 'reactstrap';

import {makeWidthFlexible, XYPlot} from 'react-vis';
import logo from "../assets/images/logo.png";

import Plot from 'react-plotly.js';

const bay_plant_ids = {
    201: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    202: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218],
    203: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318],
    204: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418],
    205: [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518],
    206: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618],
    207: [701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718],
    208: [801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818],
    209: [901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918],
    210: [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018]
}
class VisualizeData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: '',
            xselectedOutputs: [],
            yselectedOutputs: [],
            plot_number: 0,
            plot_html: [],
            available_variables: [],
            mode_dropdown_open: false,
            plantAxisDropdownOpen:false,
            data_keys: ["Combine Graph", "Split Graphs", "All Bay Split Graphs", "All Bay Combine Graphs"],
            bay_json: "{}",
            bay_temperature: [],
            bay_dew_point: [],
            sampling_time: 10000,
            dropdownOpen: false,
            bay_humidity: [],
            bay_graphs_html: [],
            all_bay_split_html: [],
            bay_keys: [],
            plantAxisText:"Select a plant attribute",
            xAxisDropdownText: "Select Variables for XAxis",
            yAxisDropdownText: "Select Variables for YAxis",
            yAxisDropdownOpen: false,
            xAxisDropdownOpen: false,
            all_bay_html: [],
            isPlantY:false,
            bay_graph_mode: "Combine Graph"
        };
    }
    plantAxisToggle = ()=>{
          this.setState({plantAxisDropdownOpen: !this.state.plantAxisDropdownOpen})
    }
    xAxisToggle = () => {
        this.setState({xAxisDropdownOpen: !this.state.xAxisDropdownOpen})
    }
    yAxisToggle = () => {
        this.setState({yAxisDropdownOpen: !this.state.yAxisDropdownOpen})
    }
    selectPlantYAxis = (plant_attr,e)=>{
        if(plant_attr==="default")
        {
         this.setState({isPlantY:false})
        }
         else
        {
         this.setState({isPlantY:true})
            this.setState({currentPlantYAxis:plant_attr})
        }
    }
    selectedOutput = (output, axis, e) => {

        if (axis === "xAxis") {
            this.setState({currentXAxis: output})
            this.setState({xselectedOutputs: output})
            this.setState({xAxisDropdownOpen: false})
        } else {
            this.setState({currentYAxis: output})
            this.setState({yselectedOutputs: output})
            this.setState({yAxisDropdownOpen: false})
        }
    }

    toggle = () => {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }


    componentDidMount() {
        this.getExperimentBayData()
    }

    getExperimentBayData = () => {
        return fetch('http://127.0.0.1:5000/api/get_experiment_bay_data/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'experiment_uuid': this.props.match.params.experiment_uuid,
                'sampling_time': this.props.match.params.sampling_time
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                let bay_env_json = JSON.parse(responseJson["bay_env_data"])
                let available_variables = responseJson["available_variables"]
                let bay_keys = Object.keys(bay_env_json)
                this.setState({bay_keys: bay_keys})
                this.setState({bay_json: bay_env_json})
                this.setState({available_variables: available_variables})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value}, () => {
            this.getExperimentBayData()
        })
    }
    addPlot = (plot_type, e) => {
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let plot_html = this.state.plot_html
        let bay_data = this.state.bay_json[this.state.currentBayId]

        let bay_data_x = this.state.bay_json[this.state.currentBayId][this.state.currentXAxis]
        let bay_data_y = null
        if(this.state.isPlantY === false) {
             bay_data_y = this.state.bay_json[this.state.currentBayId][this.state.currentYAxis]
        }
        else {
             bay_data_y = this.state.bay_json[this.state.currentBayId][this.state.currentPlantYAxis]
        }
        let current_lot_number = this.state.plot_html.length
        if (plot_type === "add_as_new_plot") {
            plot_html.push(<Plot
                data={[
                    {
                        x: bay_data_x,
                        y: bay_data_y,
                        type: 'scatter',
                        mode: 'lines+points',
                        name:  this.state.currentBayId+"-"+this.state.currentYAxis,
                        marker: {color: getRandomColor()},
                    }
                ]}
                layout={{
                    width: 1000,
                    height: 500,
                    title: "Plot Number:" + current_lot_number + " " + this.state.currentXAxis + " vs " + this.state.currentYAxis + " of Bay " + this.state.currentBayId
                }}/>)
            this.setState({plot_html: plot_html})
        }
        if (plot_type === "add_to_current_plot") {
            let add_to_plot = this.state.plot_number
            let plot_html_at_number = plot_html[add_to_plot]
            let plot_current_data = plot_html_at_number.props.data
            plot_current_data.push({
                x: bay_data_x,
                y: bay_data_y,
                type: 'scatter',
                mode: 'lines+points',
                name: this.state.currentBayId+"-"+this.state.currentYAxis,
                marker: {color: 'red'},
            })
            let new_plot = (<Plot
                data={plot_current_data}
                layout={{
                    width: 1000,
                    height: 500,
                    title: "Plot Number:" + add_to_plot + " " + this.state.currentXAxis + " vs " + this.state.currentYAxis + " of Bay " + this.state.currentBayId
                }}/>)
            plot_html[add_to_plot] = new_plot
            this.setState({plot_html: plot_html})
        }
        console.log(plot_html)
    }

    showBayData = (bay_id, e) => {
        console.log(bay_id, "DD")
        this.setState({currentBayId: bay_id})
    }
    showPlantData = (plant_id, e) => {
        console.log(plant_id, "DD")
        this.setState({currentBayId: plant_id})
    }
    render() {

        let bay_html_cols = []
        for (let i = 0; i < this.state.bay_keys.length; i++) {
            bay_html_cols.push(<div className="col-md-2 add-margin-right">
                <Button className="added-padding"
                        onClick={this.showBayData.bind(this, this.state.bay_keys[i])}>
                    {this.state.bay_keys[i]}
                </Button>
            </div>)
        }
        let plant_html_cols = []
        if (this.state.currentBayId) {
            let show_plant_ids = bay_plant_ids[this.state.currentBayId]
            for (let i = 0; i <show_plant_ids.length; i++) {
            plant_html_cols.push(<div className="col-md-2 add-margin-right">
                <Button className="added-padding"
                        onClick={this.showPlantData.bind(this, show_plant_ids[i])}>
                    {show_plant_ids[i]}
                </Button>
            </div>)
        }
        }
        let plot_html_rows = []
        let plot_count = 0
        for (let plot of this.state.plot_html) {

            plot_html_rows.push(<div><div className={"row"} style={{"min-height":"500px","margin-top":"500px !important"}}>

                {plot}

            </div><hr/></div>)

            plot_count = plot_count + 1
        }

        let x_selected_outputs_html = this.state.xselectedOutputs
        // for (let selectedOutput of this.state.xselectedOutputs) {
        //     x_selected_outputs_html = x_selected_outputs_html + "," + selectedOutput
        // }

        let y_selected_outputs_html = this.state.yselectedOutputs
        // for (let selectedOutput of this.state.yselectedOutputs) {
        //     y_selected_outputs_html = y_selected_outputs_html + "," + selectedOutput
        // }
        let x_available_variable_html = []
        for (let available_variable of this.state.available_variables) {
            x_available_variable_html.push(<DropdownItem
                onClick={this.selectedOutput.bind(this, available_variable, "xAxis")}>{available_variable}</DropdownItem>)
        }

        let y_available_variable_html = []
        for (let available_variable of this.state.available_variables) {
            y_available_variable_html.push(<DropdownItem
                onClick={this.selectedOutput.bind(this, available_variable, "yAxis")}>{available_variable}</DropdownItem>)
        }

        return (
            <div className="wrapper">
                <Navbar className="pageNavHeader">
                    <Container fluid>
                        <div className="row header-row">
                            <div className="col-md-2">
                                <img src={logo} className="logoImg" alt=""/>
                            </div>
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-2">
                                    </div>
                                    <div className="col-md-2">
                                    </div>
                                    <div className="col-md-2">
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/">Experiments</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/recipes">Recipes</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/recipes">Log Out</NavbarBrand>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Navbar>
                <div className="grid-container">


                    <aside className="sidenav">
                        <div className="sidenav__list-item">
                            Select X-Axis :
                            <Dropdown isOpen={this.state.xAxisDropdownOpen}
                                      toggle={this.xAxisToggle}>
                                <DropdownToggle caret>
                                    {x_selected_outputs_html}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {x_available_variable_html}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div className="sidenav__list-item">
                            Select Y-Axis :
                            <Dropdown isOpen={this.state.yAxisDropdownOpen}
                                      toggle={this.yAxisToggle}>
                                <DropdownToggle caret>
                                    {y_selected_outputs_html}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {y_available_variable_html}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="sidenav__list-item">
                            Select Bay :
                            <div className="row">
                                {bay_html_cols}
                            </div>
                        </div>
                        <div className="sidenav__list-item">
                            Select Plant :
                            <div className="row">
                                {bay_html_cols}
                            </div>
                        </div>
                        <div className="sidenav__list-item">
                            Select Plant Y-Axis :
                            <div className="row">
                               <Dropdown isOpen={this.state.plantAxisDropdownOpen}
                                      toggle={this.plantAxisToggle}>
                                <DropdownToggle caret>
                                    {this.state.plantAxisText}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem  onClick={this.selectPlantYAxis.bind(this, "plant_height_cm")}>plant_height_cm</DropdownItem>
                                    <DropdownItem  onClick={this.selectPlantYAxis.bind(this, "harvest_dry_mass_g")}>harvest_dry_mass_g</DropdownItem>
                                    <DropdownItem  onClick={this.selectPlantYAxis.bind(this, "harvest_dry_mass_g")}>harvest_dry_mass_g</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            </div>
                        </div>
                        <div className="sidenav__list-item">
                            <Label>
                                Sampling Time
                                <Input name="sampling_time" type="text" id={"sampling_time"}
                                       value={this.state.sampling_time} onChange={this.handleChange}/>
                            </Label>

                        </div>

                        <div className="sidenav__list-item">
                            <Label>
                                Plot Number
                                <Input name="plot_number" type="text" id={"plot_number"} value={this.state.plot_number}
                                       onChange={this.handleChange}/>
                            </Label>
                            <Button onClick={this.addPlot.bind(this, "add_to_current_plot")}>Add to Current
                                Plot</Button>
                        </div>
                        <div className="sidenav__list-item">
                            <Button onClick={this.addPlot.bind(this, "add_as_new_plot")}>Add as New Plot</Button>
                        </div>


                    </aside>
                    {plot_html_rows}

                    <footer className="footer">
                    </footer>
                </div>
            </div>


        );
    }
}


export default withCookies(VisualizeData);
