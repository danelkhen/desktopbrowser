import styled from "styled-components"

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    background-color: #0c0c0c;
    text-align: center;
    margin-right: 1em;
    border-radius: 20px;
    > button:first-child {
        border-left: none;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
    > button:last-child {
        border-right: none;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
`
export const MenuDiv = styled.div`
    display: flex;
    flex: 1;
    padding: 0.5em;
    border-bottom: 1px solid #282828;
    margin-right: 0;
    max-width: 100%;
`
export const ButtonsDiv = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
`
