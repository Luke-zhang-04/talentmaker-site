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
import {Field, useField} from "formik"
import type {Competition} from "../../schemas/competition"
import React from "react"
import UserContext from "../../contexts/userContext"
import {competitionAdapter} from "../../adapters/competition"
import {handleError} from "../../utils/errorHandler"
import {hash} from "../../utils/crypto"
import notify from "../../utils/notify"

export interface Props {
    /**
     * Competition id
     */
    id?: number
}

export interface State {
    /**
     * Markdown Description
     */
    desc: string

    /**
     * Markdown editor state
     */
    mode: "preview" | "edit"

    /**
     * Already entered competition data if it exists
     */
    competition?: Competition

    /**
     * Deadline
     */
    deadline: Date
}

export interface FormProps {
    label: string
    name: string
    type: string
    placeholder?: string
    children?: JSX.Element
}

export interface FormValues {
    name?: string
    shortDesc: string
    videoURL?: string
    website?: string
    coverImageURL?: string
}

export default class BaseComponent extends React.Component<Props, State> {
    /**
     * Input field component
     *
     * @param props - Props for form
     */
    protected static input = (props: FormProps): JSX.Element => {
        const [field, meta] = useField<FormProps>(props)
        const errorText = meta.error && meta.touched ? meta.error : ""

        let errorClass: string | undefined
        let feedback: JSX.Element | undefined

        if (errorText) {
            errorClass = "is-invalid"
            feedback = <div className="invalid-feedback">{errorText}</div>
        } else if (meta.touched) {
            errorClass = "is-valid"
            feedback = <></>
        }

        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">{props.children ?? ""}</span>
                </div>
                <Field
                    type={props.type}
                    {...field}
                    placeholder={props.placeholder || props.label}
                    className={`form-control bg-lighter text-dark ${errorClass ?? ""}`}
                />
                {feedback}
            </div>
        )
    }

    /**
     * Fields for:
     *
     * - Name
     * - ShortDesc
     */
    protected static topFields = (): JSX.Element => (
        <>
            <BaseComponent.input
                name="name"
                type="text"
                label="Submission Title"
                placeholder="Submission Title"
            >
                <span className="material-icons">sort</span>
            </BaseComponent.input>
            <BaseComponent.input
                name="shortDesc"
                type="text"
                label="Short Description"
                placeholder="Short Description"
            >
                <span className="material-icons">description</span>
            </BaseComponent.input>
        </>
    )

    /**
     * Fields for:
     *
     * - VideoURL
     * - Website
     * - CoverImageURL
     */
    protected static otherFields = (): JSX.Element => (
        <>
            <BaseComponent.input
                name="videoURL"
                type="url"
                label="Video URL"
                placeholder="Video URL"
            >
                <span className="material-icons">video_library</span>
            </BaseComponent.input>
            <BaseComponent.input
                name="website"
                type="url"
                label="Website URL"
                placeholder="Website URL"
            >
                <span className="material-icons">language</span>
            </BaseComponent.input>
            <BaseComponent.input
                name="coverImageURL"
                type="url"
                label="Cover Image URL"
                placeholder="Cover Image URL"
            >
                <span className="material-icons">insert_photo</span>
            </BaseComponent.input>
        </>
    )

    public constructor(props: Props, context: React.ContextType<typeof UserContext>) {
        super(props)

        this.user = context.currentUser ?? undefined
        this.hasUser = this.user !== undefined

        this.state = {
            desc: `# New Competition\n\nThis is Markdown. You can find out how to use markdown [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)`,
            mode: "edit",
            deadline: new Date(),
        }
    }

    public componentDidMount = async (): Promise<void> => {
        const {id: compId} = this.props
        const {user} = this

        if (!user) {
            return handleError({
                name: "Not authorized",
                message: "User is not authorized to modify this. You may be logged out.",
            })
        } else if (compId) {
            try {
                const data = await competitionAdapter(this.user, compId.toString())

                if (data instanceof Error) {
                    return
                }

                if (this.user?.sub === data.orgId) {
                    this.didSetData = true
                    this.setState({
                        competition: data,
                        deadline: new Date(data.deadline),
                    })

                    if (data.desc) {
                        // Update description
                        this.setState({desc: data.desc})
                    }

                    this.initialDataHash = await hash("SHA-256", {
                        ...this.initialValues(),
                        desc: this.state.desc,
                    })
                } else {
                    notify({
                        title: "Unauthorized",
                        icon: "report_problem",
                        iconClassName: "text-danger",
                        content: `You can't modify this competition.`,
                    })
                }
            } catch (err: unknown) {
                handleError(err)
            }
        }
    }

    public componentDidUpdate = (): void => {
        if (!this.hasUser && this.user) {
            this.componentDidMount()

            this.hasUser = true
        }
    }

    public readonly user?: User

    public static contextType = UserContext

    context!: React.ContextType<typeof UserContext>

    protected initialValues = (): FormValues => {
        const {competition} = this.state

        return {
            name: competition?.name ?? "",
            shortDesc: competition?.shortDesc ?? "",
            videoURL: competition?.videoURL ?? "",
            website: competition?.website ?? "",
            coverImageURL: competition?.coverImageURL ?? "",
        }
    }

    protected static validationSchema = yup.object({
        name: yup.string().max(64),
        shortDesc: yup.string().required("Short description is required").max(128),
        videoURL: yup
            .string()
            .url()
            .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
            .max(256),
        website: yup.string().url().max(256),
        coverImageURL: yup.string().url().max(256),
    })

    protected didSetData = this.props.id === undefined || false

    protected hasUser: boolean

    protected initialDataHash: string | undefined
}