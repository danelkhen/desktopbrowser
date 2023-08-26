import styled from "styled-components"

export const StyledButton = styled.button<{ active?: boolean }>`
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    border: none;
    border-right: 1px solid #282828;
    border-radius: 0;
    font-size: 0.833em;
    color: #999;
    padding: 8px 15px 8px 30px;
    -webkit-font-smoothing: antialiased;
    background: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #a276f8;
        color: #fff;
    }
    ${props =>
        props.active &&
        `
        outline: none;
        background-color: #a276f8;
        color: #fff;
`}
`

export function MenuButton({ action, label, className }: { action(): void; label?: string; className?: string }) {
    return (
        <StyledButton className={className} onClick={action}>
            {label}
        </StyledButton>
    )
}

export function ToggleMenuButton({
    action,
    isActive,
    label,
    className,
}: {
    action(): void
    isActive(): boolean
    label?: string
    className?: string
}) {
    return (
        <StyledButton className={className} active={isActive()} onClick={action}>
            {label}
        </StyledButton>
    )
}
