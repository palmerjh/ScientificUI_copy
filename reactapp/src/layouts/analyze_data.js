import React from "react";
import {withCookies} from "react-cookie";
import '../../node_modules/react-vis/dist/style.css';
import "../styles/import_manual_data.css";
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
import logo from "../assets/images/logo.png";

import Plot from 'react-plotly.js';

class AnalyzeData extends React.Component {
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
            xAxisDropdownText: "Select Variables for XAxis",
            yAxisDropdownText: "Select Variables for YAxis",
            yAxisDropdownOpen: false,
            xAxisDropdownOpen: false,
            all_bay_html: [],
            bay_graph_mode: "Combine Graph"
        };
    }

    xAxisToggle = () => {
        this.setState({xAxisDropdownOpen: !this.state.xAxisDropdownOpen})
    }
    yAxisToggle = () => {
        this.setState({yAxisDropdownOpen: !this.state.yAxisDropdownOpen})
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
        console.log(this.state.bay_json, "X")
        console.log(this.state.currentBayId, "Y")
        let bay_data_x = this.state.bay_json[this.state.currentBayId][this.state.currentXAxis]
        let bay_data_y = this.state.bay_json[this.state.currentBayId][this.state.currentYAxis]
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
                            <Label>
                                Sampling Time
                                <Input name="sampling_time" type="text" id={"sampling_time"}
                                       value={this.state.sampling_time} onChange={this.handleChange}/>
                            </Label>

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


export default withCookies(AnalyzeData);
