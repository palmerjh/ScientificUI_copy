import React from "react";
import {withCookies} from "react-cookie";
import '../../node_modules/react-vis/dist/style.css';
import "../styles/import_manual_data.css";
import axios from 'axios';
import {Button, Form, FormGroup, Label, Input, FormText, Container, NavbarBrand, Navbar} from 'reactstrap';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import {
    makeWidthFlexible,
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    LineMarkSeries,
    DiscreteColorLegend
} from 'react-vis';
import Header from "./experiment_dashboard";
import logo from "../assets/images/logo.png";

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

class ImportManualData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: '',
            selectedOutputs:[],
            available_variables: [],
            mode_dropdown_open: false,
            data_keys: ["Combine Graph", "Split Graphs", "All Bay Split Graphs", "All Bay Combine Graphs"],
            bay_json: "{}",
            bay_temperature: [],
            bay_dew_point: [],
            dropdownOpen:false,
            bay_humidity: [],
            bay_graphs_html: [],
            all_bay_split_html:[],
            all_bay_html: [],
            bay_graph_mode: "Combine Graph"
        };
    }
    selectedOutput=(output,e)=>{
        let selected_outputs = this.state.selectedOutputs
        selected_outputs.push(output)
        this.setState({selectedOutputs:selected_outputs})
        this.setState({dropdownOpen:false})
    }

    toggle =()=>{
        this.setState({dropdownOpen:!this.state.dropdownOpen})
    }
    selectBayGraphMode = (bay_mode, title, e) => {
        this.setState({bay_graph_mode: title})
        if (title === "All Bay Split Graphs") {

            this.loadAllSplitBays()
        }
        if (title === "All Bay Combine Graphs") {

            this.loadAllCombineBays()
        }
    }
    modeDropdown = () => {
        this.setState(prevState => ({
            mode_dropdown_open: !prevState.mode_dropdown_open
        }));
    }

    submitForm = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', 'filename');
        data.append('experiment_uuid', this.props.match.params.experiment_uuid);
        axios.post('http://127.0.0.1:5000/api/import_data_component/', data)
            .then((response) => {


            })
            .catch(function (error) {
                console.log(error);
            });

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
                'experiment_uuid': this.props.match.params.experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                let bay_env_json = responseJson["bay_env_data"]
                let available_variables = responseJson["available_variables"]
                console.log(bay_env_json)
                this.setState({bay_json: bay_env_json})
                this.setState({available_variables: available_variables})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    loadAllCombineBays = () => {
        let all_bay_html = []
        let bay_json = JSON.parse(this.state.bay_json)
        for (let bay_id in bay_json) {
            let bay_temp_data = []
            let bay_dew_data = []
            let bay_humidity_data = []

            // console.log(this.state.bay_json[bay_id],bay_id)
            for (let i = 0; i < bay_json[bay_id]["date_times"].length; i++) {


                bay_dew_data.push({
                    x: new Date(bay_json[bay_id]["date_times"][i]),
                    y: bay_json[bay_id]["dewpoint"][i]
                })

                bay_humidity_data.push({
                    x: new Date(bay_json[bay_id]["date_times"][i]),
                    y: bay_json[bay_id]["relative_humidity_%"][i]
                })

                bay_temp_data.push({
                    x: new Date(bay_json[bay_id]["date_times"][i]),
                    y: bay_json[bay_id]["temp_c"][i]
                })

                console.log(bay_temp_data)


            }
            all_bay_html.push(<LineMarkSeries
                className="linemark-series-example-2"
                curve={'curveMonotoneX'}
                data={bay_temp_data}
            />)

            all_bay_html.push(<LineMarkSeries
                className="linemark-series-example-2"
                curve={'curveMonotoneX'}
                data={bay_humidity_data}
            />)

            all_bay_html.push(<LineMarkSeries
                className="linemark-series-example-2"
                curve={'curveMonotoneX'}
                data={bay_dew_data}
            />)

        }
        this.setState({
            all_bay_combine_html: (<FlexibleXYPlot xType="time" title={"Bay Temperature, Bay Humidity, Bay Dew Points"}
                                                   height={500}>
                <HorizontalGridLines/>
                <VerticalGridLines/>
                <XAxis title="Values"/>
                <YAxis title="Bay Temperature, Bay Humidity, Bay Dewpoint"/>
                {all_bay_html}
            </FlexibleXYPlot>)
        })
    }

    loadAllSplitBays = () => {
        let all_bay_html = []

        let bay_json = JSON.parse(this.state.bay_json)
        for (let bay_id in bay_json) {
            let bay_html = []
            let bay_items = []
            console.log(this.state.selectedOutputs,"S")
            for (let j = 0; j < this.state.selectedOutputs.length; j++) {

                let bay_data_key = []
                for (let i = 0; i < bay_json[bay_id]["date_times"].length; i++) {
                    bay_data_key.push({
                        x: new Date(bay_json[bay_id]["date_times"][i]),
                        y: bay_json[bay_id][this.state.selectedOutputs[j]][i]
                    })

                }
                bay_html.push( <LineMarkSeries
                    className="linemark-series-example-2"
                    curve={'curveMonotoneX'}
                    data={bay_data_key}
                />)
                bay_items.push(this.state.selectedOutputs[j])
            }
            console.log(bay_html,"DD")
            all_bay_html.push(
                <FlexibleXYPlot xType="time" title={"Bay Temperature, Bay Humidity, Bay Dew Points"}
                                height={500}>
                    <HorizontalGridLines/>
                    <VerticalGridLines/>
                    <DiscreteColorLegend height={200} width={300} items={bay_items} />
                    <XAxis title="Values"/>
                    <YAxis title="Time"/>
                    {bay_html}
                </FlexibleXYPlot>)
        }


        this.setState({all_bay_split_html: all_bay_html})
    }
    showBayData = (bay_id, e) => {

        let bay_temperature = []
        let bay_dew_point = []
        let bay_humidity = []
        let bay_json = JSON.parse(this.state.bay_json)
        for (let i = 0; i < bay_json[bay_id]["date_times"].length; i++) {
            bay_temperature.push({
                x: new Date(bay_json[bay_id]["date_times"][i]),
                y: bay_json[bay_id]["temp_c"][i]
            })
            bay_dew_point.push({
                x: new Date(bay_json[bay_id]["date_times"][i]),
                y: bay_json[bay_id]["dewpoint"][i]
            })
            bay_humidity.push({
                x: new Date(bay_json[bay_id]["date_times"][i]),
                y: bay_json[bay_id]["relative_humidity_%"][i]
            })
        }
        this.setState({
            bay_temperature: bay_temperature
        })
        this.setState({
            bay_dew_point: bay_dew_point
        })
        this.setState({
            bay_humidity: bay_humidity
        })
        let bay_graphs_html = []
        if (this.state.bay_graph_mode == "Combine Graph") {
            bay_graphs_html.push(<FlexibleXYPlot xType="time" height={500}>
                <HorizontalGridLines/>
                <VerticalGridLines/>
                <XAxis title="X Axis"/>
                <YAxis title="Y Axis"/>
                Bay Dew Point
                <LineMarkSeries
                    className="linemark-series-example-2"
                    curve={'curveMonotoneX'}
                    data={this.state.bay_dew_point}
                />
                Bay Temperature
                <LineMarkSeries
                    className="linemark-series-example-2"
                    curve={'curveMonotoneX'}
                    data={this.state.bay_temperature}
                />
                Bay Humidity
                <LineMarkSeries
                    className="linemark-series-example-2"
                    curve={'curveMonotoneX'}
                    data={this.state.bay_humidity}
                />

            </FlexibleXYPlot>)
        }
        this.setState({bay_graphs_html: bay_graphs_html})

    }

    render() {

        let selected_outputs_html = ""
        for(let selectedOutput of this.state.selectedOutputs)
        {
            selected_outputs_html = selected_outputs_html + ","+selectedOutput
        }
        let available_variable_html = []
        for (let available_variable of this.state.available_variables) {
            available_variable_html.push(<DropdownItem onClick={this.selectedOutput.bind(this,available_variable)}>{available_variable}</DropdownItem>)
        }
        let keysDropdown = []
        for (let key of this.state.data_keys) {
            keysDropdown.push(<DropdownItem onClick={this.selectBayGraphMode.bind(this, key, key)}>{key}</DropdownItem>)
        }

        let bay_ids = []
        let bay_html = []
        let bay_temps = []
        let bay_json = JSON.parse(this.state.bay_json)

        for (let key in bay_json) {
            bay_ids.push(key)
            let bay_temp = []
            for (let i = 0; i < bay_json[key]["date_times"].length; i++) {
                bay_temp.push({
                    x: new Date(bay_json[key]["date_times"][i]),
                    y: bay_json[key]["temp_c"][i]
                })
            }
            bay_temps.push(bay_temp)

        }

        let half_length = Math.ceil(bay_ids.length / 2);
        let leftSide = bay_ids.splice(0, half_length);
        for (let i = 0; i < leftSide.length; i++) {
            bay_html.push(<div className="row">
                <div className="col-md-1 all-border">
                    <Button className="added-padding" onClick={this.showBayData.bind(this, leftSide[i])}>
                        {leftSide[i]}
                    </Button>
                </div>
                <div className="col-md-2">
                </div>
                <div className="col-md-1 all-border">
                    <Button className="added-padding"
                            onClick={this.showBayData.bind(this, bay_ids[bay_ids.length - i - 1])}>
                        {bay_ids[bay_ids.length - i - 1]}
                    </Button>
                </div>
            </div>)

        }

        let graph_html = null
        if (this.state.bay_graph_mode === "Split Graphs") {
            graph_html = (<div>
                <div className="card"><FlexibleXYPlot xType="time" title={"Bay Temperature"}
                                                      height={500}>
                    <HorizontalGridLines/>
                    <VerticalGridLines/>
                    <XAxis title="Time"/>
                    <YAxis title="Temperature"/>
                    <LineMarkSeries
                        className="linemark-series-example-2"
                        curve={'curveMonotoneX'}
                        data={this.state.bay_temperature}
                    />
                </FlexibleXYPlot></div>
                <div className="card"><FlexibleXYPlot title={"Bay Humidity"} xType="time" height={500}>
                    <HorizontalGridLines/>
                    <VerticalGridLines/>
                    <XAxis title="Time"/>
                    <YAxis title="Humidity"/>
                    <LineMarkSeries
                        className="linemark-series-example-2"
                        curve={'curveMonotoneX'}
                        data={this.state.bay_humidity}
                    />

                </FlexibleXYPlot></div>

                <div className="card"><FlexibleXYPlot title={"Bay Dew Point"} xType="time" height={500}>
                    <HorizontalGridLines/>
                    <VerticalGridLines/>
                    <XAxis title="Time"/>
                    <YAxis title="Dew Point"/>
                    <LineMarkSeries
                        className="linemark-series-example-2"
                        curve={'curveMonotoneX'}
                        data={this.state.bay_dew_point}
                    />

                </FlexibleXYPlot></div>
            </div>)
        }
        if (this.state.bay_graph_mode === "Combine Graph") {
            graph_html = (<div>
                <div className="card">
                    <FlexibleXYPlot xType="time" title={"Bay Temperature, Bay Humidity, Bay Dew Points"}
                                    height={500}>
                        <HorizontalGridLines/>
                        <VerticalGridLines/>
                        <XAxis title="Values"/>
                        <YAxis title="Time"/>
                        <p>Bay Temperature</p>
                        <LineMarkSeries
                            className="linemark-series-example-2"
                            curve={'curveMonotoneX'}
                            data={this.state.bay_temperature}
                        />
                        <p>Bay Humidity</p>
                        <LineMarkSeries
                            className="linemark-series-example-2"
                            curve={'curveMonotoneX'}
                            data={this.state.bay_humidity}
                        />
                        <p>Bay Dewpoint</p>
                        <LineMarkSeries
                            className="linemark-series-example-2"
                            curve={'curveMonotoneX'}
                            data={this.state.bay_dew_point}
                        />
                    </FlexibleXYPlot></div>
            </div>)
        }
        if (this.state.bay_graph_mode === "All Bay Split Graphs") {
            graph_html = (this.state.all_bay_split_html)
        }
        if (this.state.bay_graph_mode === "All Bay Combine Graphs") {
            graph_html = (this.state.all_bay_combine_html)
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
                                        <NavbarBrand href="/">Experiments</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/recipes">Recipes</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/submitdata">Submit Data</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/admin">Admin</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand href="/datadocs">Data Docs</NavbarBrand>
                                    </div>
                                    <div className="col-md-2">
                                        <NavbarBrand className="pageNavLink" href="/login"
                                                     onClick={this.logout}>Logout</NavbarBrand>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Navbar>
                <div className="grid-container">


                    <aside className="sidenav">
                        <div className="sidenav__close-icon">
                            <i className="fas fa-times sidenav__brand-close"></i>
                        </div>
                        <ul style={{"padding-left": "15px", "padding-top": "15px", "overflow-x": "overflow-wrap"}}>
                            <div><Form onSubmit={this.submitForm} method="post"
                                       encType="multipart/form-data">
                                <input ref={(ref) => {
                                    this.uploadInput = ref;
                                }} type="file" name="file"/>
                                <input type="submit" value="Upload"/>
                            </Form></div>
                            <div className="sidenav__list-item">
                                <p><b>Food Server Bays</b></p>
                                <div>{bay_html}</div>
                            </div>
                            <div className="sidenav__list-item">
                                <p><b>Select Values to Visualize</b></p>
                                <div><Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}><DropdownToggle caret>
                                    {selected_outputs_html}
                                </DropdownToggle>
                                    <DropdownMenu>  {available_variable_html} </DropdownMenu></Dropdown></div>
                            </div>

                        </ul>
                    </aside>

                    <div>
                        <div>
                            <Dropdown style={{"padding-left": "6px", "margin-top": "10px"}}
                                      isOpen={this.state.mode_dropdown_open} toggle={this.modeDropdown}>
                                <DropdownToggle caret>
                                    {this.state.bay_graph_mode}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {keysDropdown}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        {this.state.bay_graph_mode}
                        <div className="main-cards">

                            {graph_html}

                        </div>
                    </div>

                    <footer className="footer">
                    </footer>
                </div>
            </div>


        );
    }
}


export default withCookies(ImportManualData);
