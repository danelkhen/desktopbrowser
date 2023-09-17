import styled from "styled-components"
import { colors } from "../lib/GlobalStyle"

export const Nav = styled.nav`
    font-size: 10px;
    background-color: ${colors.__bg1};
    background-color: #181818;
    margin: 0;
    padding: 0;
    display: flex;
    color: ${colors.__fg2};
    .find {
        display: flex;
    }
    > li {
        display: flex;
        list-style: none;
    }
    > li > a {
        text-decoration: none;
        padding: 10px;
        display: flex;
    }
    &.hidden {
        visibility: hidden;
    }

    &.fixed {
        position: fixed;
        top: 0;
        width: 100%;
    }
    .clock {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        color: #999;
    }
`
