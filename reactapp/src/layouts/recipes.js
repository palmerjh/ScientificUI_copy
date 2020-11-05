import React from "react";
import {withCookies} from "react-cookie";
import {Button, Table, Breadcrumb, BreadcrumbItem} from "reactstrap";
import Header from "../components/header";
import "../styles/common.css";

class Recipes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            is_admin: props.cookies.get('is_admin') || 'false',
            recipes: [],
            recipe_users: {},
        }
    }

    componentDidMount() {
        this.getRecipes();
        this.getRecipeUsers();
    }

    componentWillUnmount() {
    }

    componentDidUpdate(e) {
    }

    getRecipes = () => {
        return fetch(process.env.REACT_APP_FLASK_URL + 
                            '/api/get_all_recipes/', {
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
                //console.log(responseJson)
                this.setState({recipes: responseJson["recipes"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    //-------------------------------------------------------------------------
    getRecipeUsers = () => {
        return fetch(process.env.REACT_APP_FLASK_URL + 
                            '/api/get_recipe_users/', {
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
                //console.log(responseJson)
                this.setState({recipe_users: responseJson["recipe_users"]})
            })
            .catch((error) => {
                console.error(error);
            });
    }

    //-------------------------------------------------------------------------
    newRecipe() {
        window.location.href = "/recipe/new"
    }

    //-------------------------------------------------------------------------
    deleteRecipe = (event) => {
        let recipe_uuid = event.target.value;

        return fetch(process.env.REACT_APP_FLASK_URL + '/api/delete_recipe/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'recipe_uuid': recipe_uuid
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if (! responseJson.ok) {
                let error = responseJson["message"];
                console.error(error);
                this.setState({error_message: error});
                return;
            }

            // The delete was successful, so get the list of recipes again.
            this.getRecipes();
            this.setState({error_message: ''});
        })
        .catch((error) => {
            console.error(error);
            this.setState({error_message: error});
        });
    }


    //-------------------------------------------------------------------------
    render() {
        let table_rows = [];
        for (let recipe of this.state.recipes) {
            let exp_link = recipe['experiment_name'];
            let rack_link = recipe['rack_name'];
            let extra = this.state.recipe_users[recipe['uuid']];
            if (undefined !== extra) {
                exp_link = <a href={"/experiment/" + extra['experiment_uuid']}>{extra['experiment_name']}</a>
                rack_link = <a href={"/rack_dashboard/" + extra['experiment_uuid'] + "/" + extra['rack_uuid']}>{extra['rack_name']}</a>
            }

            let delete_but = '';
            if(this.state.is_admin === 'true') {
                delete_but = <Button 
                    onClick={this.deleteRecipe}
                    value={recipe['uuid']}>Delete</Button>
            } 

            table_rows.push(<tr key={recipe['uuid']}>
                <td><a href={"/recipe/"+recipe['uuid']}>{recipe['name']}</a>
                    </td>
                <td>{recipe['authors']}</td>
                <td>{recipe['modified']}</td>
                <td>{exp_link}</td>
                <td>{rack_link}</td>
                <td>{delete_but}</td>
            </tr>);
        }
        return (
            <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="row buttonRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-4">
                            <Button onClick={this.newRecipe}>Create a new recipe</Button>
                        </div>
                        <div className="col-md-6">
                          <Breadcrumb tag="nav" listTag="div">
                            <BreadcrumbItem active tag="span">Recipes</BreadcrumbItem>
                          </Breadcrumb>
                
                        </div>
                    </div>
                    <div className="row tableRow">
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <Table>
                                <thead>
                                <tr>
                                    <th>Recipe</th>
                                    <th>Authors</th>
                                    <th>Modified</th>
                                    <th>Experiment</th>
                                    <th>Rack</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {table_rows}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Recipes);
