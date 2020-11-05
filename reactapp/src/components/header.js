import React from "react";
import {withCookies} from "react-cookie";
import {
    Navbar,
    NavbarBrand,
    Container,
} from "reactstrap";
import logo from "../assets/images/logo.png";
import "../styles/header.css";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dropdownOpen: false,
            color: "transparent",
        };

        this.logout = this.logout.bind(this);

        this.login_page = false;
        var path = require('url').parse(window.location.href, true).path;
        if (path === '/login') {
            this.login_page = true;
        }
    }

    logout() {
        // Remove all user related data.
        this.props.cookies.remove('is_admin', { path: '/' });
        window.location = "/login";
    }

    componentWillMount() {
        var path = require('url').parse(window.location.href, true).path;
        if (path === '/logout') { 
            this.logout();
            return;
        }
        if (path === '/login') {
            return;
        }
        if (this.props.cookies.get('is_admin') === '' ||
            this.props.cookies.get('is_admin') === undefined ||
            this.props.cookies.get('is_admin') === 'undefined') {
            // window.location.href = '/login';
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(e) {
    }

    render() {
        let experimentClass = "pageNavLink";
        let recipeClass = "pageNavLink";
        let submitClass = "pageNavLink";
        let adminClass = "pageNavLink";
        let dataClass = "pageNavLink";
        var path = require('url').parse(window.location.href, true).path;
        console.log('debugrob path=',path);
        if (path === '/' || path.startsWith('/register_new_experiment') ||
            path.startsWith('/experiment') || path.startsWith('/add_rack') ||
            path.startsWith('/rack_dashboard')) {
            experimentClass = "pageActiveNavLink";
            recipeClass = "pageNavLink";
            submitClass = "pageNavLink";
            adminClass = "pageNavLink";
            dataClass = "pageNavLink";
        }
        else if (path.startsWith('/recipe')) {
            experimentClass = "pageNavLink";
            recipeClass = "pageActiveNavLink";
            submitClass = "pageNavLink";
            adminClass = "pageNavLink";
            dataClass = "pageNavLink";
        }
        else if (path.startsWith('/submitdata')) {
            experimentClass = "pageNavLink";
            recipeClass = "pageNavLink";
            submitClass = "pageActiveNavLink";
            adminClass = "pageNavLink";
            dataClass = "pageNavLink";
        }
        else if (path.startsWith('/admin')) {
            experimentClass = "pageNavLink";
            recipeClass = "pageNavLink";
            submitClass = "pageNavLink";
            adminClass = "pageActiveNavLink";
            dataClass = "pageNavLink";
        }
        else if (path.startsWith('/datadocs')) {
            experimentClass = "pageNavLink";
            recipeClass = "pageNavLink";
            submitClass = "pageNavLink";
            adminClass = "pageNavLink";
            dataClass = "pageActiveNavLink";
        }

        if(this.login_page) {
            return ( <div></div> );
        } else {
            return (
            <Navbar className="pageNavHeader">
                <Container fluid>
                    <div className="row header-row">
                        <div className="col-md-2">
                            <img src={logo} className="logoImg" alt=""/>
                        </div>
                        <div className="col-md-10">
                            <div className="row">
                                 <div className="col-md-2">
                                    {/*<NavbarBrand className={submitClass} href="/submitdata">Submit Data</NavbarBrand>*/}
                                </div>
                                <div className="col-md-2">
                                    {/*<NavbarBrand className={adminClass} href="/admin">Admin</NavbarBrand>*/}
                                </div>
                                <div className="col-md-2">
                                    <NavbarBrand className={experimentClass} href="/">Experiments</NavbarBrand>
                                </div>
                                <div className="col-md-2">
                                    <NavbarBrand className={recipeClass} href="/recipes">Recipes</NavbarBrand>
                                </div>
                                {/*<div className="col-md-2">*/}
                                    {/*<NavbarBrand className={submitClass} href="/submitdata">Submit Data</NavbarBrand>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-2">*/}
                                    {/*<NavbarBrand className={adminClass} href="/admin">Admin</NavbarBrand>*/}
                                {/*</div>*/}
                                <div className="col-md-2">
                                    <NavbarBrand className={dataClass} href="/datadocs">Data Docs</NavbarBrand>
                                </div>
                                <div className="col-md-2">
                                    <NavbarBrand className="pageNavLink" href="/login" onClick={this.logout}>Logout</NavbarBrand>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Navbar>
            );
        }
    }
}

export default withCookies(Header);
