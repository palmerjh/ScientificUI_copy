import React from "react";
import {withCookies} from "react-cookie";
import {Table, Button, Breadcrumb, BreadcrumbItem} from "reactstrap";
import Select from 'react-select';
import Header from "../components/header";
import "../styles/common.css";
import "../styles/edit_recipe.css";

const new_recipe = {
    "format": "openag-phased-environment-v1",
    "version": "1",
    "creation_timestamp_utc": null,
	"name": "",
	"uuid": null,
	"parent_recipe_uuid": null,
	"support_recipe_uuids": null,
	"description": {
		"brief": "",
		"verbose": "",
	},
	"authors": [],
	"cultivars": [],
	"cultivation_methods": [],
	"environments": {},
	"phases": [],
};


class EditRecipe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            error_message: '',
            output_peripherals_for_select: [],
            envs_tr: [],
            phases_tr: [],
            recipe_obj: new_recipe,
            name: '',
            uuid: '',
            modified: '',
            authors: '',
            brief_desc: '',
            verbose_desc: '',
            cultivars: '',
            cultivation_methods: '',
            environments: {},
            selected_env_output: [],
            selected_cycle_env: [],
            phases: [],
        }
        this.env_key = 0;
        this.phase_key = 0;
    }

    componentDidMount() {
        this.getPeripheralsList()
        // We call getRecipe() at the end of the above function,
        // because to process the recipe, we need the peripherals.
    }

    componentWillUnmount() {
    }

    componentDidUpdate(e) {
    }

    //-------------------------------------------------------------------------
    // Save the recipe name to the state and to the recipe object.
    handleChangeRecipeName(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let name = event.target.value;
        this.setState({name: name});

        let recipe_obj = this.state.recipe_obj;
        recipe_obj.name = name;
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeAuthors(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let authors = event.target.value;
        this.setState({authors: authors});

        // Split the comma separated names (overwrites existing authors).
        let recipe_obj = this.state.recipe_obj;
        recipe_obj.authors = []; // wipe out existing data
        let authors_arr = authors.split(',');
        for (var i=0; i < authors_arr.length; i++) {
            recipe_obj.authors.push({'name': authors_arr[i].trim(),
                                     'email': null,
                                     'uuid': null});
        }
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeBrief(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let brief = event.target.value;
        this.setState({brief_desc: brief});

        let recipe_obj = this.state.recipe_obj;
        recipe_obj.description.brief = brief;
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeVerbose(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let verb = event.target.value;
        this.setState({verbose_desc: verb});

        let recipe_obj = this.state.recipe_obj;
        recipe_obj.description.verbose = verb;
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeCultivars(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let cults = event.target.value;
        this.setState({cultivars: cults});

        // Split the comma separated names (overwrites existing).
        let recipe_obj = this.state.recipe_obj;
        recipe_obj.cultivars = []; // wipe out existing data
        let cults_arr = cults.split(',');
        for (var i=0; i < cults_arr.length; i++) {
            recipe_obj.cultivars.push({'name': cults_arr[i].trim(),
                                       'uuid': null});
        }
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeCultivationMethods(event) {
        if(event === undefined || event === null || event.target === null) {
            return;
        }
        let meth = event.target.value;
        this.setState({cultivation_methods: meth});

        // Split the comma separated names (overwrites existing).
        let recipe_obj = this.state.recipe_obj;
        recipe_obj.cultivation_methods = []; // wipe out existing data
        let meth_arr = meth.split(',');
        for (var i=0; i < meth_arr.length; i++) {
            recipe_obj.cultivation_methods.push({'name': meth_arr[i].trim(),
                                                 'uuid': null});
        }
        this.setState({recipe_obj: recipe_obj})
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    getPeripheralsList = () => {
        return fetch(process.env.REACT_APP_FLASK_URL + 
                            "/api/get_all_peripherals/", {
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
            let output_peripherals_for_select = [];
            let periphs = responseJson["peripheralsList"];
            for (var i=0; i < periphs.length; i++) {
                if ('output' === periphs[i].function.trim().toLowerCase()) {
                    output_peripherals_for_select.push(periphs[i]);
                }
            }
            this.setState({output_peripherals_for_select: 
                output_peripherals_for_select});

            // Now that we have the peripherals we need to display the recipe,
            // get it.
            this.getRecipe();
        })
        .catch((error) => {
            console.error(error);
        });
    }

    //-------------------------------------------------------------------------
    getRecipe = () => {
        if ('new' === this.props.match.params.recipe_uuid) {
            this.buildEnvRowsFromState();
            this.buildPhaseRowsFromState();
            return;
        }
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_recipe/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'recipe_uuid': this.props.match.params.recipe_uuid
            })
        }).then((response) => response.json())
        .then((responseJson) => {

            let recipe_json_string = responseJson["recipe"];
            let recipe_obj = JSON.parse(recipe_json_string);
            this.setState({recipe_obj: recipe_obj});

            // Pull the recipe name out of the recipe object and put
            // in the state.
            this.setState({name: recipe_obj.name});
            this.setState({uuid: recipe_obj.uuid});
            this.setState({modified: recipe_obj.creation_timestamp_utc});

            var i=0; // common loop counter

            // Put author names into one string, comma separated.
            if (undefined !== recipe_obj.authors) {
                let authors = '';
                for (i=0; i < recipe_obj.authors.length; i++) {
                    authors += recipe_obj.authors[i].name;
                    if (i + 1 < recipe_obj.authors.length) {
                        authors += ', ';
                    }
                }
                this.setState({authors: authors}); 
            }

            // Put descriptions in state so form can update them.
            this.setState({brief_desc: recipe_obj.description.brief});
            this.setState({verbose_desc: recipe_obj.description.verbose});

            // Put cultivar names into one string, comma separated.
            if (undefined !== recipe_obj.cultivars) {
                let cults = '';
                for (i=0; i < recipe_obj.cultivars.length; i++) {
                    cults += recipe_obj.cultivars[i].name;
                    if (i + 1 < recipe_obj.cultivars.length) {
                        cults += ', ';
                    }
                }
                this.setState({cultivars: cults}); 
            }
            if (undefined !== recipe_obj.cultivation_methods) {
                let meths = '';
                for (i=0; i < recipe_obj.cultivation_methods.length; i++) {
                    meths += recipe_obj.cultivation_methods[i].name;
                    if (i + 1 < recipe_obj.cultivation_methods.length) {
                        meths += ', ';
                    }
                }
                this.setState({cultivation_methods: meths}); 
            }
            if (undefined !== recipe_obj.environments) {
                this.setState({environments: recipe_obj.environments}, function() {
                    this.buildEnvRowsFromState();
                }); 
            }
            if (undefined !== recipe_obj.phases) {
                this.setState({phases: recipe_obj.phases}, function() {
                    this.buildPhaseRowsFromState();
                }); 
            }
        })
        .catch((error) => {
            console.error(error);
            this.setState({error_message: error});
        });
    }

    //-------------------------------------------------------------------------
    // Keys used to name react components so render() can track them.
    getNextEnvKey() {
        let count = this.env_key + 1;
        this.env_key = count; 
        return 'env' + count;
    }
    resetEnvKey() {
        this.env_key = 0; 
    }
    getNextPhaseKey() {
        let count = this.phase_key + 1;
        this.phase_key = count; 
        return 'phase' + count;
    }
    resetPhaseKey() {
        this.phase_key = 0; 
    }

    //-------------------------------------------------------------------------
    // Create the dynamic UI components for environment rows from the state.
    buildEnvRowsFromState = () => {

        // Always start off with the same key count, so when render() is
        // called, it will know which DOM objects have changed.  Also if you
        // use random keys, render() will remove the focus from an input on
        // each key press.
        this.resetEnvKey();

        let periph_td = []; 
        let envs_tr = []; // rebuild the table rows
        let periphs = this.state.output_peripherals_for_select;
        let envs = this.state.environments;
        for (var env_id in envs) {
            let env = envs[env_id];
            periph_td = []; 

            // pull out the env. var. names, to be used to find the matching
            // peripheral
            let vars = [];
            for (var var_name in env) {
                if ('name' !== var_name) {
                    vars.push(var_name);
                }
            }

            // from the variable name, find the peripheral which uses it
            let periph = null;
            for (var i=0; i < periphs.length; i++) {
                let p = periphs[i];
                let vars_arr = p.recipe_variables.split(',');
                for (var j=0; j < vars_arr.length; j++) {
                    if (0 < vars.length &&
                        vars[0].trim() === vars_arr[j].trim()) {
                        periph = p;
                        break;
                    }
                }
                if (null !== periph) {
                    break;
                }
            }
            if (null === periph) {
                periph = '';
            } else {
                // Get the units from the peripheral, match the order with each var name.
                let units = [];
                let units_arr = periph.units.split(',');
                let vars_arr = periph.recipe_variables.split(',');
                for (j=0; j < vars.length; j++) {
                    let name = vars[j];
                    for (var k=0; k < vars_arr.length; k++) {
                        if (name === vars_arr[k].trim()) {
                            units.push(units_arr[k].trim());
                            break;
                        }
                    }
                }

                // We matched a variable from the environment to a peripheral.  yay.
                // Now build the UI components for the actuator variables.
                let rows = [];
                for (j=0; j < vars.length; j++) {
                    let var_name = vars[j];
                    let variable = env[var_name];
                    if (variable !== null && typeof variable === 'object') {
                        // this var has multiple values to display
                        let multi_table = [];
                        for (var multi_value_var_name in variable) {
                            let value = variable[multi_value_var_name];
                            let input = [];
                            let key = this.getNextEnvKey();
                            input.push(<input className="inputRow" type="number" min="0"
                                key={key}
                                id={key}
                                placeholder="Enter value"
                                value={value}
                                onChange={this.handleChangeVarValue.bind(this, 
                                    env_id, var_name, multi_value_var_name)} />);

                            multi_table.push(<tr key={this.getNextEnvKey()}>
                                               <td>{multi_value_var_name}</td>
                                               <td className="valueCell">{input}</td>
                                               <td>{units[j]}</td>
                                             </tr>);
                        }
                        rows.push( <tr key={this.getNextEnvKey()}>
                                     <td>{var_name}</td>
                                     <td colSpan="2">
                                       <Table>
                                         <tbody> 
                                           {multi_table}
                                         </tbody>
                                       </Table>
                                     </td>
                                   </tr>);

                    } else {
                        // this var has one value to display
                        let input = [];
                        let key = this.getNextEnvKey();
                        input.push(<input className="inputRow" type="number" min="0"
                            key={key}
                            id={key}
                            placeholder="Enter value"
                            value={variable}
                            onChange={this.handleChangeVarValue.bind(this, 
                                env_id, var_name, null)} />);
                        rows.push( <tr key={this.getNextEnvKey()}>
                                     <td>{var_name}</td>
                                     <td className="valueCell">{input}</td>
                                     <td>{units[j]}</td>
                                   </tr>);
                    }
                }
                periph_td.push( <Table key={this.getNextEnvKey()}>
                                  <thead>
                                    <tr>
                                      <th>Variable</th>
                                      <th>Value</th>
                                      <th>Units</th>
                                    </tr>
                                  </thead>
                                  <tbody> 
                                    {rows}
                                  </tbody>
                                 </Table>);
            }

            // now make a dynamic env row
            envs_tr.push(<tr key={this.getNextEnvKey()}>
                <td><Button onClick={this.handleDeleteEnv.bind(this)}
                     value={env_id}>Delete</Button></td>
                <td>{env_id}</td>
                <td><input className="inputRow" type="text" 
                     id={this.getNextEnvKey()}
                     placeholder="Environment name"
                     value={env.name}
                     onChange={this.handleChangeEnvName.bind(this, env_id)} /></td>
                <td className="selectCell"><Select isClearable isSearchable
                     defaultValue={periph}
                     value={this.state.selected_env_output[{env_id}]}
                     id={env_id} name={env_id}
                     onChange={this.handleEnvOutputChange.bind(this, env_id)}
                     options={this.state.output_peripherals_for_select} /></td>
                <td>
                  {periph_td}
                </td>
              </tr>);
        }

        // If this is a new recipe, there won't be any envs, so just fix up the
        // table headers:
        if (0 === envs_tr.length) {
            envs_tr.push(<tr key={this.getNextEnvKey()}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <Table key={this.getNextEnvKey()}>
                    <thead>
                      <tr>
                        <th>Variable</th>
                        <th>Value</th>
                        <th>Units</th>
                      </tr>
                    </thead>
                  <tbody> 
                  </tbody>
                  </Table>
                </td>
              </tr>);
        }

        this.setState({envs_tr: envs_tr});
    }

    //-------------------------------------------------------------------------
    // Create the dynamic UI components for phase rows from the state.
    buildPhaseRowsFromState = () => {
        this.resetPhaseKey();
        let phases_tr = []; // rebuild the table rows

        // make a list of environment ids and names for the cycles to use
        let envs = this.state.environments;
        let envs_for_select = [];
        for (var env_id in envs) {
            let env = envs[env_id];
            envs_for_select.push({'label': env.name,
                                  'value': env_id});
        }

        let phases = this.state.phases;
        for (var phase_index in phases) {
            let phase = phases[phase_index];
            let cycles_tr = []; // cycles table rows

            // Build the cycles
            for (var cycle_index in phase.cycles) {
                let cycle = phase.cycles[cycle_index];
                let sel_index = ((phase_index + 1) * (cycle_index + 1)).toString();

                // Find the current value of the environment in the list,
                // match the cycle.environment with the same in the list.
                let env_default_value = null;
                for (var env_sel in envs_for_select) {
                    if (envs_for_select[env_sel].value === cycle.environment) {
                        env_default_value = envs_for_select[env_sel];
                        break;
                    }
                }
                if (null === env_default_value) {
                    env_default_value = '';
                }

                cycles_tr.push(<tr key={this.getNextPhaseKey()}>
                    <td><Button 
                      onClick={this.handleDeleteCycle.bind(this, phase_index,
                        cycle_index)}
                      value={cycle_index}>Delete</Button></td>

                    <td><input className="inputRow" type="text" 
                      id={this.getNextPhaseKey()}
                      placeholder="Cycle name"
                      value={cycle.name}
                      onChange={this.handleChangeCycleName.bind(this, phase_index,
                          cycle_index)}/></td>

                    <td><input className="inputRow" type="number" min="0"
                      id={this.getNextPhaseKey()}
                      placeholder="Hours"
                      value={cycle.duration_hours}
                      onChange={this.handleChangeCycleHours.bind(this, phase_index, 
                          cycle_index)}/></td>

                    <td className="envCell"><Select isClearable isSearchable
                      defaultValue={env_default_value}
                      value={this.state.selected_cycle_env[{sel_index}]}
                      id={this.getNextPhaseKey()} 
                      onChange={this.handleCycleEnvChange.bind(this, phase_index,
                          cycle_index)}
                      options={envs_for_select} /></td>
                  </tr>);
            }

            // Build the phase
            phases_tr.push(<tr key={this.getNextPhaseKey()}>
                <td><Button onClick={this.handleDeletePhase.bind(this)}
                     value={phase_index}>Delete</Button></td>

                <td><input className="inputRow" type="text" 
                     id={this.getNextPhaseKey()}
                     placeholder="Phase name"
                     value={phase.name}
                     onChange={this.handleChangePhaseName.bind(this, phase_index)}/></td>

                <td><input className="inputRow" type="number" min="1"
                     id={this.getNextPhaseKey()}
                     placeholder="Repeat"
                     value={phase.repeat}
                     onChange={this.handleChangePhaseRepeat.bind(this, phase_index)}/></td>

                <td><Button onClick={this.handleAddCycle.bind(this)}
                     value={phase_index}>Add Cycle</Button></td>
                <td>
                  <Table key={this.getNextPhaseKey()}>
                    <thead>
                      <tr>
                        <th>Delete Cycle?</th>
                        <th>Name</th>
                        <th>Hours</th>
                        <th>Environment</th>
                      </tr>
                    </thead>
                  <tbody> 
                    {cycles_tr}
                  </tbody>
                  </Table>
                </td>
                </tr>);
        }
        this.setState({phases_tr: phases_tr});
    }

    //-------------------------------------------------------------------------
    getRandomEnvName() {
        let envs = this.state.environments;
        let env_id = 'env0';
        for (var i=0; i < 1000; i++) {
            env_id = 'env' + i;
            if (env_id in envs) {
                continue;
            }
            break;
        }
        return env_id;
    }

    //-------------------------------------------------------------------------
    handleAddEnv = () => {
        let env_id = this.getRandomEnvName();
        let envs = this.state.environments;
        envs[env_id] = {'name': env_id};

        // !!! setState() doesn't immediately mutate the state !!!,
        // so pass a function that does what we need done after state is updated.
        this.setState({environments: envs}, function() {
            this.buildEnvRowsFromState();
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleDeleteEnv = (event) => {
        let env_id = event.target.value;
        let envs = this.state.environments;
        // remove one env
        var new_envs = [];
        for (var e in envs) {
            if (e !== env_id) {
                new_envs[e] = envs[e];
            }
        }
        this.setState({environments: new_envs}, function() {
            this.buildEnvRowsFromState();
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleAddPhase = () => {
        let phases = this.state.phases;
        phases.push({'name': '',
                     'repeat': 1,
                     'cycles': [] });
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleDeletePhase(event) {
        event.preventDefault();
        let phase_index = event.target.value;
        let phases = this.state.phases;
        // remove one element at phase_index (in place)
        phases.splice(phase_index, 1); 
        this.buildPhaseRowsFromState();
    }

    //-------------------------------------------------------------------------
    handleChangePhaseName = (phase_index, event) => {
        let new_name = event.target.value;
        let phases = this.state.phases;
        let phase = phases[phase_index];
        phase.name = new_name;
        this.buildPhaseRowsFromState();
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangePhaseRepeat = (phase_index, event) => {
        let repeat = 1;
        if(event === undefined || event === null || event.target === null) {
            repeat = 1;
        } else {
            repeat = parseInt(event.target.value);
        }
        if (repeat < 0) {
            return;
        }
        let phases = this.state.phases;
        let phase = phases[phase_index];
        phase.repeat = repeat;
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleAddCycle = (event) => {
        let phase_index = event.target.value;
        let phases = this.state.phases;
        let phase = phases[phase_index];
        phase.cycles.push({'name': '',
                           'environment': '',
                           'duration_hours': 0});
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    // Don't bother with a confirmation dialog, it's easy to recreate a cycle.
    handleDeleteCycle = (phase_index, cycle_index, event) => {
        let phases = this.state.phases;
        let phase = phases[phase_index];
        // remove one element at cycle_index (in place)
        phase.cycles.splice(cycle_index, 1); 
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleChangeCycleName = (phase_index, cycle_index, event) => {
        let name = event.target.value;
        let phases = this.state.phases;
        let phase = phases[phase_index];
        let cycle = phase.cycles[cycle_index];
        // name does NOT have to be unique (the array is just processed in order)
        cycle.name = name;
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleChangeCycleHours = (phase_index, cycle_index, event) => {
        let hours = 0;
        if(event === undefined || event === null || event.target === null) {
            hours = 0;
        } else {
            hours = parseInt(event.target.value);
        }
        if (hours < 0 || hours > 24) {
            let err = 'Cycle hours range is 1 to 24.';
            console.error(err);
            this.setState({error_message: err});
            return;
        }
        this.setState({error_message: ''}); // clear any previous error state

        let phases = this.state.phases;
        let phase = phases[phase_index];
        let cycle = phase.cycles[cycle_index];

        // find a different cycle to adjust
        let different_cycle_index = null;
        for (var i in phase.cycles) {
            if (cycle_index !== i) {
                different_cycle_index = i;
            }
        }

        // This only works for our normal case of two cycles (day / night).
        // For more than 2 cycles, the user is on their own to add up to 24 :(
        if (2 === phase.cycles.length && null !== different_cycle_index) {
            // if more than one cycle, reduce/increase a different hours value to
            // compensate for this new one.
            phase.cycles[different_cycle_index].duration_hours = 24 - hours;
        }
        cycle.duration_hours = hours;
        this.setState({phases: phases}, function() {
            this.buildPhaseRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleCycleEnvChange = (phase_index, cycle_index, event) => {
        if(event === undefined || event === null) {
            return;
        }
        let selected_env = event;
        let phases = this.state.phases;
        let phase = phases[phase_index];
        let cycle = phase.cycles[cycle_index];
        cycle.environment = selected_env.value;
    }

    //-------------------------------------------------------------------------
    // Handle toggling a single Select env output choice
    handleEnvOutputChange = (env_id, event) => {
        let envs = this.state.environments;
        if(event === undefined || event === null) {
            // An option was cleared in the single Select.
            // Wipe out the variables, but keep the name.
            let name = envs[env_id]['name'];
            envs[env_id] = {'name': name};
            this.setState({environments: envs}, function() {
                this.buildEnvRowsFromState();
            });
            return; 
        }

        // Add the variables from the peripheral to the environment.
        let selected_periph = event;
        let vars = selected_periph.recipe_variables.split(',');
        for (var i=0; i < vars.length; i++) {
            let var_name = vars[i].trim();
            let value = '';
            if ('light_spectrum_nm_percent' === var_name ) {
                value = {'380-399': '',
                         '400-499': '',
                         '500-599': '',
                         '600-700': '',
                         '701-780': ''};
            }
            envs[env_id][var_name] = value;
        }
        this.setState({environments: envs}, function() {
            this.buildEnvRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    handleChangeEnvName = (env_id, event) => {
        let env_name = event.target.value;
        let envs = this.state.environments;
        let env = envs[env_id];
        env.name = env_name;
        this.setState({environments: envs}, function() {
            this.buildEnvRowsFromState();
            this.buildPhaseRowsFromState();
        });
        event.preventDefault();
    }

    //-------------------------------------------------------------------------
    handleChangeVarValue = (env_id, var_name, multi_value_var_name, event) => {
        event.preventDefault();
        let value = event.target.value;
        let envs = this.state.environments;
        let env = envs[env_id];
        let variable = env[var_name];
        if (variable !== null && typeof variable === 'object' && 
                null !== multi_value_var_name) {
            variable[multi_value_var_name] = value;
        } else {
            env[var_name] = value;
        }
        this.setState({environments: envs}, function() {
            this.buildEnvRowsFromState();
        });
    }

    //-------------------------------------------------------------------------
    duplicateRecipe() {
        let recipe_obj = this.state.recipe_obj;
        recipe_obj.name = this.state.name + ' (copy)';
        recipe_obj.uuid = null;
        recipe_obj.creation_timestamp_utc = null;
        this.setState({recipe_obj: recipe_obj});
        this.setState({name: recipe_obj.name});
        this.setState({uuid: recipe_obj.uuid});
        this.setState({modified: recipe_obj.creation_timestamp_utc});
    }

    //-------------------------------------------------------------------------
    handleSubmit = () => {
        let environments = this.state.environments;
        let phases = this.state.phases;

        // Validate the recipe has a name.
        if (0 === this.state.name.trim().length) {
            let err = 'Recipe must have a name.';
            this.setState({error_message: err});
            alert(err);
            return;
        }

        // Validate the environments:
        let env_count = 0;
        for (var i in environments) {
            env_count++;
            let env = environments[i];

            // Validate that each env has a name.
            if (0 === env.name.trim().length) {
                let err = 'Every Environment must have a name.';
                this.setState({error_message: err});
                alert(err);
                return;
            }

            // Validate that each env has an output selected.
            let vars = [];
            for (var var_name in env) {
                if ('name' !== var_name) {
                    vars.push(var_name);
                }
            }
            if (0 === vars.length) {
                let err = 'Must select an Output for each Environment.';
                this.setState({error_message: err});
                alert(err);
                return;
            }

            // Validate that each env output variable has all fields filled out
            // (not '').
            for (var j=0; j < vars.length; j++) {
                let var_name = vars[j];
                let variable = env[var_name];
                if (variable !== null && typeof variable === 'object') {
                    // this var has multiple values to display (spectrum)
                    for (var multi_value_var_name in variable) {
                        let value = variable[multi_value_var_name];
                        if(value === undefined || value === null || 
                           0 === value.toString().trim().length) {
                            let err = 'Every Environment Output Variable must'+
                                ' have a value.';
                            this.setState({error_message: err});
                            alert(err);
                            return;
                        }
                    }
                } else {
                    if (0 === variable.toString().trim().length) {
                        let err = 'Every Environment Output Variable must'+
                            ' have a value.';
                        this.setState({error_message: err});
                        alert(err);
                        return;
                    }
                } 
            }
        }

        // Validate we have at least one environment.
        if (0 === env_count) {
            let err = 'Must have at least one Environment.';
            this.setState({error_message: err});
            alert(err);
            return;
        }

        // Validate we have at least one phase.
        if (0 === phases.length) {
            let err = 'Must have at least one Phase.';
            this.setState({error_message: err});
            alert(err);
            return;
        }

        // Validate phases:
        for (var phase_index in phases) {
            let phase = phases[phase_index];

            // Validate that each phase has a name.
            if (0 === phase.name.trim().length) {
                let err = 'Every Phase must have a name.';
                this.setState({error_message: err});
                alert(err);
                return;
            }

            // Validate that each phase has at least one cycle.
            if (0 === phase.cycles.length) {
                let err = 'Must have at least one Cycle in Phase ' +
                    phase.name + '.';
                this.setState({error_message: err});
                alert(err);
                return;
            }

            let total = 0;
            for (var cycle_index in phase.cycles) {
                let cycle = phase.cycles[cycle_index];
                // Validate that each cycle in a phase has a name.
                if (0 === cycle.name.trim().length) {
                    let err = 'Every Cycle must have a name.';
                    this.setState({error_message: err});
                    alert(err);
                    return;
                }

                // Validate that each cycle in a phase has an env.
                if (0 === cycle.environment.trim().length) {
                    let err = 'Every Cycle must have an Environment.';
                    this.setState({error_message: err});
                    alert(err);
                    return;
                }

                total += cycle.duration_hours;
            }

            // Validate the sum of all cycle hours for each phase.  
            if (24 !== total) {
                let err = 'Phase ' + phase.name + 
                    ' cycles must sum to 24 hours.';
                this.setState({error_message: err});
                alert(err);
                return;
            }
        }

        // Clear any old error.
        this.setState({error_message: ''}); 

        // put the environments and phases into the recipe_obj we will submit
        let recipe_obj = this.state.recipe_obj;
        recipe_obj.environments = this.state.environments;
        recipe_obj.phases = this.state.phases;

        // serialize the recipe_obj and put it in the DS dict format.
        let recipe_string = JSON.stringify(recipe_obj);

        return fetch(process.env.REACT_APP_FLASK_URL + 
                            '/api/submit_recipe/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'recipe': recipe_string,
                'authors': this.state.authors,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (! responseJson.ok) {
                let error = responseJson["message"];
                console.error(error);
                this.setState({error_message: error});
                return;
            }

            // update the modification date
            this.setState({modified: responseJson["modified"]});
            this.setState({uuid: responseJson["uuid"]});
            this.setState({error_message: ''});
            alert("Successfully saved recipe.");
        })
        .catch((error) => {
            console.error(error);
            this.setState({error_message: 'Error connecting to the flask API: ' + error});
        });
    }

    //-------------------------------------------------------------------------
    render() {
        let dupe_but = [];
        let page_name = 'Create Recipe';
        if ('new' !== this.props.match.params.recipe_uuid) {
            dupe_but.push(<Button onClick={this.duplicateRecipe.bind(this)}>Duplicate this Recipe</Button>);
            page_name = 'Edit Recipe';
        }

      return (
        <div className="wrapper">
          <div className="main-panel" ref="mainPanel">
            <Header {...this.props} />
            <div className="row buttonRow" key={this.getNextEnvKey()}>
              <div className="col-md-1"></div>
              <div className="col-md-4">
                {dupe_but}
              </div>
              <div className="col-md-6">
                <Breadcrumb tag="nav" listTag="div">
                  <BreadcrumbItem tag="a" href="/recipes">Recipes</BreadcrumbItem>
                  <BreadcrumbItem active tag="span">Recipe</BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>);

            <div className="row buttonRow">
              <div className="col-md-1"></div>
              <div className="col-md-11">
                <h3>{page_name}</h3>
                {this.state.error_message &&
                  <p style={{color: 'red'}}>{this.state.error_message}</p>
                }
              </div>
            </div>

            <form>
              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Recipe Name:</b><br/>
                  <input className="inputRow" type="text" 
                    placeholder="Recipe name."
                    value={this.state.name}
                    onChange={this.handleChangeRecipeName.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Authors:</b><br/>
                  <input className="inputRow" type="text" 
                    placeholder="Authors names, comma separated."
                    value={this.state.authors}
                    onChange={this.handleChangeAuthors.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Modified:</b><br/>
                  {this.state.modified}
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>UUID:</b><br/>
                  {this.state.uuid}
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Brief Description:</b><br/>
                  <input className="inputRow" type="text" 
                    placeholder="Short description of this recipe."
                    value={this.state.brief_desc}
                    onChange={this.handleChangeBrief.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Verbose Description:</b><br/>
                  <textarea className="inputRow" 
                    placeholder="Complete description of this recipe."
                    value={this.state.verbose_desc}
                    onChange={this.handleChangeVerbose.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Cultivars:</b><br/>
                  <textarea className="inputRow" 
                    placeholder="Plant types you will grow, comma separated."
                    value={this.state.cultivars}
                    onChange={this.handleChangeCultivars.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Cultivation Methods:</b><br/>
                  <textarea className="inputRow" 
                    placeholder="Grow methods, comma separated."
                    value={this.state.cultivation_methods}
                    onChange={this.handleChangeCultivationMethods.bind(this)}/>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Environments:</b><br/>
                  <Button className="submitButtonRow" 
                   onClick={this.handleAddEnv.bind(this)}>Add Environment</Button>
                  <Table>
                    <thead>
                      <tr>
                        <th>Delete?</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Outputs</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.envs_tr}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"><b>Phases:</b><br/>
                  <Button className="submitButtonRow" 
                   onClick={this.handleAddPhase.bind(this)}>Add Phase</Button>
                  <Table>
                    <thead>
                      <tr>
                        <th>Delete?</th>
                        <th>Name</th>
                        <th>Repeat</th>
                        <th>Cycles</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.phases_tr}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="row formRow">
                <div className="col-md-1"></div>
                <div className="col-md-11"> 
                  {this.state.error_message &&
                    <p style={{color: 'red'}}>{this.state.error_message}</p>
                  }
                  <Button className="submitButtonRow" 
                   onClick={this.handleSubmit.bind(this)}>Save Recipe</Button>
                </div>
              </div>

            </form>
          </div>
        </div>
      );
    }
}

export default withCookies(EditRecipe);
