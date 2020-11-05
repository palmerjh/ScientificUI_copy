import React from "react";
import {withCookies} from "react-cookie";
import {CardText,Card,CardBody,CardTitle} from "reactstrap";

const device_types = {
    "PFC_EDU": "/add_pfc_edu/",
    "food_server": "/add_food_server/"
}

class ExperimentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experiment:{

            }
        }
    }

    componentWillMount() {
        this.getExperimentDetails();
    }

    getExperimentDetails = () => {
        console.log(this.props.experiment_uuid, "Params")
        let experiment_uuid = this.props.experiment_uuid
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
                'experiment_uuid': experiment_uuid
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({experiment: responseJson["experiment"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div className="container experiment-container">
            <Card>

            <CardBody>
            <CardTitle>  {this.state.experiment['experiment_name']}</CardTitle>
                <div className="row buttonRow">
                    <div className="col-md-2">Experiment Notes</div>
                    <div className="col-md-6">
                          {this.state.experiment['experiment_notes']}
                    </div>

                </div>
                <div className="row buttonRow">
                    <div className="col-md-2">Started At</div>
                    <div className="col-md-6">
                          {this.state.experiment['started_at']}
                    </div>

                </div>
                <div className="row buttonRow">
                    <div className="col-md-2">Started By</div>
                    <div className="col-md-6">
                          {this.state.experiment['started_by']}
                    </div>

                </div>
                </CardBody>
            </Card>
            </div>
        );
    }
}

export default withCookies(ExperimentDetails);
