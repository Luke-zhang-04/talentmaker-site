/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"

export const projectSchema = yup.object({
    id: yup.number().required(),
    creator: yup.string().required(),
    createdAt: yup.date().required(),
    desc: yup.string().nullable(),
    srcURL: yup.string().nullable(),
    demoURL: yup.string().nullable(),
    license: yup.string().nullable(),
    videoURL: yup.string().nullable(),
    coverImageURL: yup.string().nullable(),
    competitionId: yup.string().required(),
    topics: yup.array(yup.string()).nullable(),
    projectId: yup.number().required(),
    name: yup.string().required(),
    creatorUsername: yup.string().required(),
    competitionName: yup.string().required(),
})

export type Project = typeof projectSchema.__outputType