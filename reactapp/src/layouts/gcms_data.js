import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/datadocs.css";
import Plot from 'react-plotly.js';
import CSVReader from 'react-csv-reader'
import {
    Button, Input, Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Label, Navbar, Container, NavbarBrand
} from "reactstrap";
import logo from "../assets/images/logo.png";

class GCMSData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            farmer_brown: [],
            openag: [],
            stop_shop: [],
            wholefoods: [],
            listofrs: [],
            incr: 0.02746833511,
            points_to_sample: 13106,
            farmer_brown_select: false,
            openag_select: false,
            wholefoods_select: false,
            stop_shop_select: false,
            showOptions: false,
            columnTypeCaret: 'Pick column data type',
            iscolumnTypeDropDownOpen: false,

        }
    }

    componentDidMount() {
        let xrs = []
        let count = 0
        for (var i = 0; i < this.state.points_to_sample; i++) {
            xrs.push(count)
            count += this.state.incr
        }
        console.log(xrs.length)
        this.setState({listofrs: xrs})
    }

    componentWillUnmount() {

    }

    componentDidUpdate(e) {

    }

    toggleSelect = (key, e) => {
        if (key == "ss") {
            this.setState({stop_shop_select: !this.state.stop_shop_select}, this.updateData)
        }
        if (key == "oa") {
            this.setState({openag_select: !this.state.openag_select}, this.updateData)
        }
        if (key == "wf") {
            this.setState({wholefoods_select: !this.state.wholefoods_select}, this.updateData)
        }
        if (key == "fb") {
            this.setState({farmer_brown_select: !this.state.farmer_brown_select}, this.updateData)
        }
    }
    addColumnType = (columntype, e) => {
        this.setState({columnTypeCaret: columntype}, this.updateData)
    }
    toggleColumnTypeDropdown = () => {
        this.setState({iscolumnTypeDropDownOpen: !this.state.iscolumnTypeDropDownOpen});

    }
    updateData = () => {
        let data = []
        if (this.state.farmer_brown_select === true) {
            data.push({
                type: 'scatterpolar',
                r: this.state.farmer_brown.slice(0, this.state.points_to_sample),
                theta: this.state.listofrs.slice(0, this.state.points_to_sample),
                fill: 'toself',
                name: 'Farmer Brown'
            })
        }
        if (this.state.stop_shop_select === true) {
            data.push({
                type: 'scatterpolar',
                r: this.state.stop_shop.slice(0, this.state.points_to_sample),
                theta: this.state.listofrs.slice(0, this.state.points_to_sample),
                fill: 'toself',
                name: 'Farmer Brown'
            })
        }
        if (this.state.wholefoods_select === true) {
            data.push({
                type: 'scatterpolar',
                r: this.state.wholefoods.slice(0, this.state.points_to_sample),
                theta: this.state.listofrs.slice(0, this.state.points_to_sample),
                fill: 'toself',
                name: 'Farmer Brown'
            })
        }
        if (this.state.openag_select === true) {
            data.push({
                type: 'scatterpolar',
                r: this.state.openag.slice(0, this.state.points_to_sample),
                theta: this.state.listofrs.slice(0, this.state.points_to_sample),
                fill: 'toself',
                name: 'Farmer Brown'
            })
        }
        this.setState({data: data})
    }
    handleForce = (data) => {
        console.log(data,"XX")
        this.setState({
            farmer_brown: data.slice(3, 13109).map(function (value, index) {
                return parseFloat(value[1]);
            })
        })
        this.setState({
            openag: data.slice(13113, 26219).map(function (value, index) {
                return parseFloat(value[1]);
            })
        })
        this.setState({
            stop_shop: data.slice(26224, 39330).map(function (value, index) {
                return parseFloat(value[1]);
            })
        })
        this.setState({
            wholefoods: data.slice(39334, 52440).map(function (value, index) {
                return parseFloat(value[1]);
            })
        })
        this.setState({showOptions: !this.state.showOptions})
    };
    updaters = () => {
        let xrs = []
        let count = 0
        let incr = 360 / this.state.points_to_sample
        for (var i = 0; i < this.state.points_to_sample; i++) {
            xrs.push(count)
            count += incr
        }
        console.log(xrs.length)
        this.setState({listofrs: xrs})
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value}, this.updaters);
        event.preventDefault();
    }

    render() {
        console.log(this.state.farmer_brown)
        let farmer_brown = {
            type: 'scatterpolar',
            r: this.state.farmer_brown,
            theta: this.state.listofrs,
            fill: 'toself',
            name: 'Farmer Brown'
        }
        let openag = {
            type: 'scatterpolar',
            r: this.state.openag,
            theta: this.state.listofrs,
            fill: 'toself',
            name: 'OpenAg'
        }
        let stop_shop = {
            type: 'scatterpolar',
            r: this.state.stop_shop,
            theta: this.state.listofrs,
            fill: 'toself',
            name: 'Stop Shop'
        }
        let wholefoods = {
            type: 'scatterpolar',
            r: this.state.wholefoods,
            theta: this.state.listofrs,
            fill: 'toself',
            name: 'wholefoods'
        }
        let data = [farmer_brown, openag, stop_shop, wholefoods]

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

                    <div className="main-panel" ref="mainPanel">

                        <div className="row gcmsRow">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">

                            </div>
                        </div>
                        <div className="row gcmsRow">
                            <div className="col-md-1">
                            </div>

                            <div className="col-md-12">
                                <Plot
                                    data={this.state.data}
                                    layout={{width: 900, height: 600, title: 'Visualizing GCMS Data'}}
                                />
                            </div>
                        </div>
                    </div>
                    <aside className="sidenav">
                        <div className="sidenav__list-item">
                            {this.state.showOptions ?
                                <div className="col-md-4">
                                    <div className="row">
                                        <label>
                                            <Input type="checkbox" value={this.state.farmer_brown_select}
                                                   onChange={this.toggleSelect.bind(this, "fb")}/>
                                            Farmer Brown
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label>

                                            <Input type="checkbox" value={this.state.openag_select}
                                                   onChange={this.toggleSelect.bind(this, "oa")}/>
                                            Open Ag
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label>
                                            <Input type="checkbox" value={this.state.stop_shop_select}
                                                   onChange={this.toggleSelect.bind(this, "ss")}/>
                                            Stop & Shop
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label>
                                            <Input type="checkbox" value={this.state.wholefoods_select}
                                                   onChange={this.toggleSelect.bind(this, "wf")}/>
                                            Whole Foods
                                        </label>
                                    </div>
                                    <div className="row">
                                        <label>
                                            Sample
                                            <Input type="text" value={this.state.points_to_sample}
                                                   name="points_to_sample" onChange={this.handleChange}/>
                                            Points <Dropdown isOpen={this.state.iscolumnTypeDropDownOpen}
                                                             toggle={this.toggleColumnTypeDropdown}>
                                            <DropdownToggle caret>
                                                {this.state.columnTypeCaret}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem
                                                    onClick={this.addColumnType.bind(this, "randomly")}>Randomly</DropdownItem>
                                                <DropdownItem onClick={this.addColumnType.bind(this, "most_variant")}>Most
                                                    Variant</DropdownItem>
                                                <DropdownItem onClick={this.addColumnType.bind(this, "list")}>From
                                                    List</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        </label>
                                    </div>
                                </div> : <div className="col-md-4">Options</div>}
                        </div>
                        <div className="sidenav__list-item">
                            <CSVReader
                                cssClass="csv-reader-input"
                                label="Upload CSV file with GCMS Data"
                                onFileLoaded={this.handleForce}
                                inputId="gcms_data"
                                inputStyle={{color: 'red'}}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        );
    }
}

export default withCookies(GCMSData);
