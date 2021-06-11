import React, { ReactComponentElement, ReactElement, useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { colors } from "./GlobalStyle"
import cx from "classnames"

export const DropdownDiv = styled.div<{ show: boolean }>`
    display: inline-block;

    .menu {
        display: ${props => (props.show ? "block" : "none")};
        position: absolute;
        border: 1px solid ${colors.__bg2};
        background-color: ${colors.__bg1};
    }

    .menu button {
        display: block;
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
        <DropdownDiv show={show} onClick={toggle}>
            {updatedToggler}
            {popup}
        </DropdownDiv>
    )
}

function shouldToggleDropDown(e: React.MouseEvent | Event) {
    const el = e.target as HTMLElement
    const dropDownEl = el.closest(".dropdown")
    const isInDropDown = dropDownEl != null
    const isInToggleBtn = el.closest(".dropdown-toggle") != null

    return { isInDropDown, isInToggleBtn }
}
