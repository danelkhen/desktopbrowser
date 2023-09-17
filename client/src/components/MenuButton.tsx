import { css, cx } from "@emotion/css"
import { ReactNode } from "react"

export const StyledButton = css`
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    border: none;
    border-right: 1px solid #282828;
    border-radius: 0;
    font-size: 1em;
    color: #999;
    padding: 8px 15px 8px 30px;
    -webkit-font-smoothing: antialiased;
    background: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #a276f8;
        color: #fff;
    }
    &.active {
        outline: none;
        background-color: #a276f8;
        color: #fff;
    }
    > svg {
        margin-left: -12px;
        margin-right: 6px;
    }
`

export function MenuButton({
    action,
    label,
    className,
    icon,
}: {
    action?: () => void
    label?: string
    className?: string
    icon?: ReactNode
}) {
    return (
        <button className={cx(className, StyledButton)} onClick={action}>
            {icon}
            {label}
        </button>
    )
}

export function ToggleMenuButton({
    action,
    isActive,
    label,
    className,
    icon,
}: {
    action(): void
    isActive(): boolean
    label?: string
    className?: string
    icon?: ReactNode
}) {
    return (
        <button className={cx(className, StyledButton, { active: isActive() })} onClick={action}>
            {icon}
            {label}
        </button>
    )
}
