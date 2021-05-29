/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import EditProjectComponent from "./component"
import React from "react"
import UserContext from "../../contexts/userContext"
import queryString from "query-string"
import {useParams} from "react-router-dom"

export const EditProject: React.FC<{}> = () => {
    const {id} = useParams<{id?: string}>()
    const {competition: compId, id: qId} = queryString.parse(window.location.search)

    if (id) {
        return (
            <UserContext.Consumer>
                {({currentUser: user}): JSX.Element => (
                    <EditProjectComponent id={id} user={user} />
                )}
            </UserContext.Consumer>
        )
    } else if (typeof compId === "string" && compId) {
        return (
            <UserContext.Consumer>
                {({currentUser: user}): JSX.Element => (
                    <EditProjectComponent
                        compId={compId}
                        id={typeof qId === "string" ? qId : undefined}
                        user={user}
                    />
                )}
            </UserContext.Consumer>
        )
    }

    return (
        <>
            <h1>Error:</h1>
            <p>No competition or project ID specified</p>
        </>
    )
}

export default EditProject
