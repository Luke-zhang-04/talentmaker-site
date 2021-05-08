/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */
import "./Nav.scss"
import {Link, RouteComponentProps, withRouter} from "react-router-dom"
import Logo from "../images/logo.svg"
import React from "react"
import UserContext from "../userContext"

const navLinkCount = 5

interface NavState {
    location?: string
}

interface NavLinkProps {
    location: string
    name: string
}

interface NavLinkShowProps {
    isloggedin: boolean
}

@(withRouter as any)
export default class Nav extends React.Component<Partial<RouteComponentProps>, NavState> {
    public constructor(props: Partial<RouteComponentProps>) {
        super(props)

        this.state = {
            location: this.props.location?.pathname,
            dimensions: [window.innerWidth, window.innerHeight],
            currentPageCount: 0,
        }
    }

    public componentDidMount = (): void => {
        window.addEventListener("resize", () => {
            this.setState({dimensions: [window.innerWidth, window.innerHeight]})
        })
    }

    public componentDidUpdate = (prevProps: RouteComponentProps): void => {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged()
        }
    }

    public onRouteChanged = (): void => {
        this.setState({location: this.props.location?.pathname})
    }

    private _srOnly = (): JSX.Element => <span className="visually-hidden">(current)</span>

    private _navLink = ({location, name}: NavLinkProps): JSX.Element => {
        const _location = this.state.location
        const SrOnly = this._srOnly

        return (
            <li className="nav-item">
                <Link
                    className={`nav-link ${_location === location ? "active" : ""}`}
                    to={location}
                >
                    {name} {location === _location ? <SrOnly /> : ""}
                </Link>
            </li>
        )
    }

    private _navLinks = ({isloggedin}: NavLinkShowProps): JSX.Element => {
        const NavLink = this._navLink
        const navValues: string[][] = [
            ["/", "Home"],
            ["/competitions", "Competitions"],
            ["/talents", "Talents"],
            ["/talentmakers", "Talentmakers"],
            isloggedin ? ["/profile", "Profile"] : ["/auth", "Sign Up"],
        ]

        return (
            <ul className="navbar-nav">
                {navValues.map((val) => (
                    <NavLink key={`nav-link-${val[0]}`} location={val[0]} name={val[1]} />
                ))}
            </ul>
        )
    }

    private _desktopNav = ({currentUser}: AppTypes.Context): JSX.Element => {
        const NavLinks = this._navLinks

        return (
            <UserContext.Consumer>
                {({currentUser}): JSX.Element => (
                    <nav className="navbar navbar-expand-lg navbar-light bg-none">
                        <div className="container-fluid">
                            <div className="row w-100">
                                <div className="col-lg-1">
                                    <Link className="navbar-brand" to="/">
                                        <img
                                            src={Logo}
                                            alt="Talentmaker logo"
                                            title="Talentmaker"
                                        />
                                    </Link>
                                </div>
                                <div className="col-lg-11 nav-links">
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarNav"
                                        aria-controls="navbarNav"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className="collapse navbar-collapse" id="navbarNav">
                                        <NavLinks
                                            isloggedin={
                                                currentUser !== null && currentUser !== undefined
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                )}
            </UserContext.Consumer>
        )
    }
}
