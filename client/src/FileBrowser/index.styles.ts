import { css } from "linaria"

export const active = css`
    background-color: var(--bg2);
`

export const nav = css`
    font-size: 10px;
    background-color: var(--bg1);
    background-color: #181818;
    margin: 0;
    padding: 0;
    display: flex;
    color: var(--fg2);
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
