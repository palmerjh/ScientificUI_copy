import React from 'react';
import {withCookies} from "react-cookie";
import Header from "../components/header";
import "../styles/login.css";
import logo from "../assets/images/logo.png";
import {Button, Table} from "reactstrap";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            username: '',
            password: '',
            error_message: '',
            render: false,
        };
        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
    }
    
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event) {
        this.loginUser()
        event.preventDefault();
    }

    loginUser() {
        return fetch('http://localhost:5000/api/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':true,
                'Authorization': 
                    'Basic Q3JhenlFaWdodHlFaWdodDg4OkxvbmczNCtTZWtyMXRIYWhA',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson["response_code"] === 200){
                    this.props.cookies.set('is_admin',responseJson['is_admin'])
                    window.location.href = "/"
                } else {
                    let error_message = responseJson["message"]
                    this.setState({error_message: error_message})
                }
            })
            .catch((error) => {
                console.error('loginUser error:'+error);
                this.setState({error_message: 'Error connecting to the flask API.'})
            });
    }

    render() {
        return (
            <div className="wrapper">
                <div className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <div className="login-page">
                        <div className="login-box">
                            <div className="image-section">
                                <img src={logo} className="logo" alt=""/>
                            </div>
                            {this.state.error_message &&
                                <p style={{color: 'red'}}>
                                    {this.state.error_message}
                                </p>
                            }
                            <form onSubmit={this.handleSubmit}>
                                <input type="text" 
                                    placeholder="username" name="username" 
                                    value={this.state.username}
                                    onChange={this.handleChange}/>
                                <input type="password" 
                                    placeholder="password" name="password" 
                                    value={this.state.password}
                                    onChange={this.handleChange}/>
                                <Button className="login-button">login</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Login);
