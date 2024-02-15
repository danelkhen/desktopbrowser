import React, { ReactComponentElement, ReactElement, useCallback, useEffect, useState } from "react"
import { colors } from "../GlobalStyle"
import { cx, css } from "@emotion/css"

export const DropdownDiv = css`
    display: flex;

    .menu {
        display: none;
        flex-direction: column;
        position: absolute;
        border: 1px solid ${colors.bg2};
        background-color: ${colors.bg1};
        top: 40px;
        z-index: 10000;
    }
    &.show {
        .menu {
            display: flex;
        }
    }
`
export interface DropdownProps {
    children: [ReactComponentElement<"button">, ReactElement]
}
export function Dropdown(props: DropdownProps) {
    const { children } = props
    const [show, setShow] = useState(false)
    const [ignore, setIgnore] = useState(false)
    const [toggler, popup] = children

    const toggle = useCallback(
        (e: React.MouseEvent | Event) => {
            if (e.defaultPrevented || ignore) return
            const { isInDropDown, isInToggleBtn } = shouldToggleDropDown(e)
            if (e.currentTarget == window) {
                if (isInDropDown || isInToggleBtn || !show) return
                setShow(false)
                return
            }
            if (isInDropDown || isInToggleBtn) {
                setShow(!show)
                setIgnore(true)
                setTimeout(() => setIgnore(false), 0)
            }
        },
        [ignore, show]
    )
    useEffect(() => {
        window.addEventListener("mousedown", toggle)
        return () => window.addEventListener("mousedown", toggle)
    }, [toggle])

    const updatedToggler = React.cloneElement(toggler, { className: cx(toggler.props.className, "dropdown-toggle") })
    return (
        <div className={cx(DropdownDiv, { show })} onClick={toggle}>
            {updatedToggler}
            {popup}
        </div>
    )
}

function shouldToggleDropDown(e: React.MouseEvent | Event) {
    const el = e.target as HTMLElement
    const dropDownEl = el.closest(".dropdown")
    const isInDropDown = dropDownEl != null
    const isInToggleBtn = el.closest(".dropdown-toggle") != null

    return { isInDropDown, isInToggleBtn }
}
