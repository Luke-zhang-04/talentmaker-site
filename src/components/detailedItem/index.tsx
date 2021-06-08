/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import "./index.scss"
import {IFrame, Img} from "../elements"
import React, {ReactNode} from "react"
import DefaultPFP from "~/images/profile.svg"
import {Link} from "react-router-dom"
import {Spinner} from "../bootstrap"

type UserInfoProps = {
    pfp?: string
    username?: string
    desc?: string
}

export const UserInfo: React.FC<UserInfoProps> = ({pfp, username, desc, children}) => (
    <div className="row">
        <div className="col-lg-2">
            <div className="px-4 my-3">
                <Img src={pfp ?? DefaultPFP} className="pfp" alt="Profile" />
            </div>
        </div>
        <div className="col-lg-5 d-flex flex-column justify-content-center">
            {username ? <p className="username">{username}</p> : undefined}
            {desc ? <p className="sub text-muted">{desc}</p> : undefined}
        </div>
        <div className="col-lg-5 d-flex flex-row align-items-center justify-content-end">
            {children}
        </div>
    </div>
)

export const Video: React.FC<React.ComponentProps<typeof IFrame>> = (props) => {
    const [didVideoLoad, setLoad] = React.useState(false)

    return (
        <div className="mx-3 mt-3">
            <div className={`video-container ${didVideoLoad ? "" : "p-0"}`}>
                <IFrame
                    {...props}
                    title={props.title ?? "video"}
                    className={`video ${props.className}`}
                    onLoad={(event): void => {
                        setLoad(true)

                        props.onLoad?.(event)
                    }} // Change state to add padding
                    onError={(event): void => {
                        setLoad(true)

                        props.onError?.(event)
                    }}
                >
                    <Spinner color="danger" size="25vw" className="my-5" centered />
                </IFrame>
            </div>
        </div>
    )
}

type SidebarProps = {
    items: (
        | {title: string; icon?: undefined; contents: ReactNode; href?: string; to?: undefined}
        | {icon: string; title?: undefined; contents: ReactNode; href?: string; to?: undefined}
        | {title: string; icon?: undefined; contents: ReactNode; to?: string; href?: undefined}
        | {icon: string; title?: undefined; contents: ReactNode; to?: string; href?: undefined}
        | undefined
    )[]
}

const linkProps = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-decoration-none mb-3 d-block",
}

const SidebarItem: React.FC<SidebarProps["items"][0]> = ({icon, title, contents, to, href}) => {
    if (icon) {
        if (to) {
            return (
                <Link className={linkProps.className} to={to}>
                    <span className="material-icons">{icon}</span> {contents}
                </Link>
            )
        } else if (href) {
            return (
                <a {...linkProps} href={href}>
                    <span className="material-icons">{icon}</span> {contents}
                </a>
            )
        }

        return (
            <p>
                <span className="material-icons">{icon}</span> {contents}
            </p>
        )
    }

    if (to) {
        return (
            <p>
                <b>{title}</b>
                <Link className={linkProps.className} to={to}>
                    {contents}
                </Link>
            </p>
        )
    } else if (href) {
        return (
            <p>
                <b>{title}</b>
                <a {...linkProps} href={href}>
                    {contents}
                </a>
            </p>
        )
    }

    return (
        <p>
            <b>{title}</b>
            {contents}
        </p>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({items}) => (
    <div className="p-3 position-sticky top-0">
        <button
            className="btn-circle"
            onClick={(): void => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }}
        >
            <span className="material-icons">expand_less</span>
        </button>
        <h1>About</h1>
        <ul className="list-unstyled text-dark">
            {items.map((item, index) =>
                item ? <SidebarItem {...item} key={`sidebaritem-${index}`} /> : undefined,
            )}
        </ul>
    </div>
)
