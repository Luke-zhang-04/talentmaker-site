/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as utils from "~/utils"
import cacheUtils from "~/utils/cache"
import globals from "~/globals"
import qs from "query-string"
import type yup from "yup"

class AdapterError extends Error {
    public readonly name = "AdapterError"
}

const adapterError = (message?: string) => new AdapterError(message)

const catcherPromise = async <T>(func: () => Promise<T>): Promise<T | Error> => {
    try {
        return await func()
    } catch (err) {
        if (err instanceof AdapterError) {
            return err
        }

        utils.handleError(err)

        return utils.createError(err)
    }
}

type AdapterCallback<ArgsType, Args extends ArgsType[], S extends yup.BaseSchema | void> = (
    tools: {
        adapterError: typeof adapterError
        request: typeof utils.request
        url: typeof globals.url
        cache: typeof cacheUtils
        schema: S
        qs: typeof qs
    },
    ...args: Args
) => Promise<S extends yup.BaseSchema ? S["__outputType"] : void>

type ReturnType<S extends yup.BaseSchema | void> =
    | (S extends yup.BaseSchema ? S["__outputType"] : void)
    | Error

// I tried making another generic type, but kept getting type errors, so enjoy this atrocity
/**
 * Creates an adapter
 *
 * @param func - Function to execute
 * @returns An adapter
 */
export const createAdapter =
    <ArgsType, Args extends ArgsType[], S extends yup.BaseSchema | void = undefined>(
        func: AdapterCallback<ArgsType, Args, S>,
        schema?: S,
    ): ((...args: Args) => Promise<ReturnType<S>>) =>
    (...args: Args) =>
        catcherPromise(
            async () =>
                await func(
                    {
                        adapterError,
                        request: utils.request,
                        url: globals.url,
                        cache: cacheUtils,
                        schema: schema as S,
                        qs,
                    },
                    ...args,
                ),
        )

export default createAdapter
