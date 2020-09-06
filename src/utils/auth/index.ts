/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @author Luke Zhang - luke-zhang-04.github.io
 *
 * @license GPL-3.0
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/* eslint-disable @typescript-eslint/naming-convention */

import * as AwsCognito from "amazon-cognito-identity-js"

const poolData = {
        UserPoolId: "us-east-1_6ovwzlvIj",
        ClientId: "kp3st63fo709fr67sioh0edie",
    },
    userPool = new AwsCognito.CognitoUserPool(poolData)

/**
 * Register a user. Promise based 😀
 * @param username - username
 * @param email - email
 * @param password - password
 * @returns - Promise with Cognito user
 */
export const register = (
    username: string,
    email: string,
    password: string,
): Promise<AwsCognito.CognitoUser> => {
    const attributeList = [
        new AwsCognito.CognitoUserAttribute({
            Name: "name",
            Value: username,
        }),
        new AwsCognito.CognitoUserAttribute({
            Name: "email",
            Value: email,
        }),
    ]

    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, [], (err, result) => {
            if (err) {
                reject(err)
            }

            resolve(result?.user)
        })
    })
}

export const login = (
    username: string,
    password: string
): void => {
    const authDetails = new AwsCognito.AuthenticationDetails({
            Username: username,
            Password: password,
        }),
        userData = {
            Username: username,
            Pool: userPool
        },
        cognitoUser = new AwsCognito.CognitoUser(userData)

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
            console.log(result)
        },
        onFailure: (err) => {
            console.log(err)
        },
    })
}

export default {
    register,
    login,
}