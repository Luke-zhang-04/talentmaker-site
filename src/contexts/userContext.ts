/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type {AppTypes} from ".."
import React from "react"

export const UserContext = React.createContext<AppTypes.Context>({
    currentUser: undefined,
    setUser: () => new Promise((resolve) => resolve()),
    setUserFromUnknown: () => new Promise((resolve) => resolve()),
})

export default UserContext