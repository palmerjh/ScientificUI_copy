import React from "react";
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/datadocs.css";

class DataDocs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info"
        }
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
                            <h3>Data Documentation</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            Data available for analysis and visualization from the experiments are divided into four categories:
                            <ul>
                                <li>Experiment</li>
                                <li>Device</li>
                                <li>Blocks</li>
                                <li>Plants</li>
                            </ul>

                            <hr/>
                            <h4>Section 1 - Terms</h4>

                            <h5>Experiment</h5>
                            <p>- Experiment is defined as a hypothesis that is being tested on any given group of plants. The plants under consideration can be all the plants in the containers or just a few. Each experiment will be given a unique identifier that is generated upon registering a new experiment.
                            </p>

                            <h5>Device</h5>
                            <p>- Device in the context of scientific UI is a hybrid of the rack, beaglebones and sensors attached to a given rack.
                            </p>

                            <h5>Blocks</h5>
                            <p>- A block groups together a set of plants - In the plant level interface you can attach a custom block identifier with its own metadata. For example for Plant #1, Plant #2, Plant #3 if you are applying a specific treatment then you can set that metadata in a Block and reuse it for all plants.
                            </p>

                            <h5>Plants</h5> 
                            <p>- You should know by now what a plant is (cheeky!)</p>

                            <h5>Recipes</h5> 
                            <p>- Recipes affect Blocks of plants and are sent to Devices to actuate things on a schedule.</p>

                            <hr/>
                            <h4>Section 2 - Metadata</h4>

                            <h5>Data Object 1 - Experiment Metadata asked during registration</h5>
                            <ul>
                                <li>experiment_name</li>
                                <li>experiment_uuid</li>
                                <li>started_by</li>
                                <li>experiment_notes</li>
                                <li>experiment_drive</li>
                            </ul>

                            <h5>Data Object 2 - Experiment Device</h5>
                            <ul>
                                <li>experiment_uuid</li>
                                <li>device_uuid (Brain)</li>
                                <li>recipe_uuid</li>
                                <li>sensor_id</li>
                                <li>sensor_position</li>
                                <li>Measurement_type</li>
                                <li>Measurement_datatype</li>
                            </ul>

                            <h5>Data Object 3 - Experiment Input and Outputs</h5>
                            <ul>
                                <li>Input variables - Prepopulated list of all the sensor measurement types</li>
                                <li>Output variables - Observing values - plant height etc</li>
                            </ul>

                            <h5>Data Object 4 - Plant</h5>
                            <ul>
                                <li>experiment_uuid</li>
                                <li>plant_id - 6 digit id - (2 digit x)(2 digit y)(2 digit z axis)</li>
                                <li>plant_label - Attach any block label information</li>
                                <li>plant_notes</li>
                                <li>plant_rackid - 0 for PFC_EDU or Hazelnut Computer - Find the number on the rack for
                                    others
                                </li>
                            </ul>

                            <h5>Data Object 5 - Recipe</h5>
                            <ul>
                                <li>experiment_uuid</li>
                                <li>recipe_uuid</li>
                                <li>recipe_name</li>
                                <li>recipe_description{'{}'} (single)</li>
                                <ul>
                                    <li>brief</li>
                                    <li>verbose</li>
                                </ul>
                                <li>recipe_authors[]</li>
                                <ul>
                                    <li>name</li>
                                    <li>email</li>
                                    <li>uuid</li>
                                </ul>
                                <li>recipe_cultivars[]</li>
                                <ul>
                                    <li>name</li>
                                    <li>uuid</li>
                                </ul>
                                <li>recipe_cultivation_methods[]</li>
                                <ul>
                                    <li>name</li>
                                    <li>uuid</li>
                                </ul>
                                <li>recipe_environments{'{}'} (multiple)</li>
                                <ul>
                                    <li>environment_name{'{}'}</li>
                                    <ul>
                                        <li>environment_display_name</li>
                                        <li>brain_sensor_variable1 (unique name from constant list)</li>
                                        <li>brain_sensor_variable2</li>
                                        <li>brain_sensor_variableN</li>
                                    </ul>
                                </ul>
                                <li>recipe_phases[]</li>
                                <ul>
                                    <li>phase_name</li>
                                    <li>phase_repeat (int)</li>
                                    <li>phase_cycles[]</li>
                                    <ul>
                                        <li>cycle_display_name</li>
                                        <li>environment_name</li>
                                        <li>duration_hours or duration_minutes (int)</li>
                                    </ul>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default withCookies(DataDocs);
