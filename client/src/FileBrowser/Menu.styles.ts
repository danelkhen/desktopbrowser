import { css } from "linaria"
import { active } from "./index.styles"

export const buttonGroup = css`
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
export const menu = css`
    display: flex;
    flex: 1;
    padding: 0.5em;
    border-bottom: 1px solid #282828;
    margin-right: 0;
    max-width: 100%;
`
export const buttons = css`
    display: flex;
    flex: 1;
    flex-direction: row;
`
export const button = css`
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
    &${active} {
        outline: none;
        background-color: #a276f8;
        color: #fff;
    }
`
export const GotoParentDir = css`
    background: url(../../img/icons/up.svg) no-repeat 13px 46%;
`
export const GotoPrevSibling = css`
    background: url(../../img/icons/prev.svg) no-repeat 13px 46%;
`
export const GotoNextSibling = css`
    background: url(../../img/icons/next.svg) no-repeat 13px 46%;
`
export const Size = css`
    background: url(../../img/icons/folder.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Google = css`
    background: url(../../img/icons/google.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Delete = css`
    background: url(../../img/icons/trash.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Subs = css`
    background: url(../../img/icons/subtitle.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Imdb = css`
    background: url(../../img/icons/imdb.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Explore = css`
    background: url(../../img/icons/explore.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Sort = css`
    background: url(../../img/icons/sort.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const More = css`
    background: url(../../img/icons/more.svg) no-repeat 13px 46%;
    padding-left: 40px;
    border-right: none;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
`
