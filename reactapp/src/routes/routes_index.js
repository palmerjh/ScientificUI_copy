import Experiments from "../layouts/experiments";
import RegisterNewExperiment from "../layouts/register_new_experiment";
import ExperimentDashboard from "../layouts/experiment_dashboard";
import DataDocs from "../layouts/data_docs";
import Login from "../layouts/login";
import SubmitData from "../layouts/submit_data";
import Admin from "../layouts/admin";
import Recipes from "../layouts/recipes";
import EditRecipe from "../layouts/edit_recipe";
import AddRack from "../layouts/add_rack";
import RackDashboard from "../layouts/rack_dashboard";
import GCMSData from "../layouts/gcms_data";
import ImportManualData from "../layouts/import_manual_data";
import AddFoodServerDevice from "../layouts/add_food_server";
import AddPFCEDUDevice from "../layouts/add_pfc_edu_device";
import VisualizeData from "../layouts/visualize_data";
import AnalyzeData from "../layouts/analyze_data";


var indexRoutes = [{
    path: "/register_new_experiment",
    name: "RegisterNewExperiment",
    icon: "nc-icon nc-bank",
    component: RegisterNewExperiment
}, {
    path: "/experiment/:experiment_uuid",
    name: "ExperimentDashboard",
    icon: "nc-icon nc-bank",
    component: ExperimentDashboard
}, {
    path: "/datadocs",
    name: "DataDocs",
    icon: "nc-icon nc-bank",
    component: DataDocs
}, {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-bank",
    component: Login
}, {
    path: "/add_device/:experiment_uuid/",
    name: "AddDevice",
    icon: "nc-icon nc-bank",
    component: AddRack
}, {
    path: "/visualize_data/:experiment_uuid/",
    name: "AddDevice",
    icon: "nc-icon nc-bank",
    component: VisualizeData
}, {
    path: "/analyze_data/:experiment_uuid/",
    name: "AddDevice",
    icon: "nc-icon nc-bank",
    component: AnalyzeData
}, {
    path: "/submitdata",
    name: "SubmitData",
    icon: "nc-icon nc-bank",
    component: SubmitData
}, {
    path: "/admin",
    name: "Admin",
    icon: "nc-icon nc-bank",
    component: Admin
}, {
    path: "/recipes",
    name: "Recipes",
    icon: "nc-icon nc-bank",
    component: Recipes
}, {
    path: "/recipe/:recipe_uuid",
    name: "EditRecipe",
    icon: "nc-icon nc-bank",
    component: EditRecipe
}, {
    path: "/rack_dashboard/:experiment_uuid/:bay_uuid",
    name: "RackDashboard",
    icon: "nc-icon nc-bank",
    component: RackDashboard
}, {
    path: "/gcms_data/:experiment_uuid",
    name: "GCMSData",
    icon: "nc-icon nc-bank",
    component: GCMSData
},
    {
        path: "/rack_dashboard/:experiment_uuid/:rack_uuid",
        name: "RackDashboard",
        icon: "nc-icon nc-bank",
        component: RackDashboard
    }, {
        path: "/add_pfc_edu/:experiment_uuid",
        name: "AddPFCEdu",
        icon: "nc-icon nc-bank",
        component: AddPFCEDUDevice
    }, {
        path: "/add_food_server/:experiment_uuid",
        name: "AddFoodServerDevice",
        icon: "nc-icon nc-bank",
        component: AddFoodServerDevice
    }, {
        path: "/import_experiment_data/:experiment_uuid",
        name: "ImportExperimentData",
        icon: "nc-icon nc-bank",
        component: ImportManualData
    }, {
        path: "/",
        name: "Experiments",
        icon: "nc-icon nc-bank",
        component: Experiments
    }];

export default indexRoutes;
