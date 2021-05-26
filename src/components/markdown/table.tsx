/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file markdown Render components
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */
import type React from "react"

type Props = {
    children: JSX.Element
}

export const Table: React.FC<Props> = (props) => (
    <table className="table table-bordered text-dark">{props.children}</table>
)

export const TableCell: React.FC<Props> = (props) => (
    <td className="text-center">{props.children}</td>
)

export default {
    Table,
    TableCell,
}
