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

export const bulkCompetitionSchema = yup.object({
    id: yup.number().required(),
    name: yup.string().nullable(),
    desc: yup.string().nullable(),
    videoURL: yup.string().nullable(),
    deadline: yup.date().required(),
    website: yup.string().nullable(),
    email: yup.string().nullable(),
    orgId: yup.string().required(),
    coverImageURL: yup.string().nullable(),
    orgName: yup.string(),
    shortDesc: yup.string(),
})

export type BulkCompetitionType = typeof bulkCompetitionSchema.__outputType

export const competitionsSchema = yup.array(bulkCompetitionSchema).required()

export type Competitions = typeof competitionsSchema.__outputType
