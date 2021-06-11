import styled from "styled-components"
import { MenuButton, StyledButton } from "./MenuButton"

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
export const GotoParentDir = styled(MenuButton)`
    background: url(../../img/icons/up.svg) no-repeat 13px 46%;
`
export const GotoPrevSibling = styled(MenuButton)`
    background: url(../../img/icons/prev.svg) no-repeat 13px 46%;
`
export const GotoNextSibling = styled(MenuButton)`
    background: url(../../img/icons/next.svg) no-repeat 13px 46%;
`
export const Size = styled(MenuButton)`
    background: url(../../img/icons/folder.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Google = styled(MenuButton)`
    background: url(../../img/icons/google.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const DeleteButton = styled(MenuButton)`
    background: url(../../img/icons/trash.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Subs = styled(MenuButton)`
    background: url(../../img/icons/subtitle.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const Imdb = styled(MenuButton)`
    background: url(../../img/icons/imdb.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const ExploreButton = styled(MenuButton)`
    background: url(../../img/icons/explore.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const SortButton = styled(StyledButton)`
    background: url(../../img/icons/sort.svg) no-repeat 13px 46%;
    padding-left: 40px;
`
export const MoreButton = styled(StyledButton)`
    background: url(../../img/icons/more.svg) no-repeat 13px 46%;
    padding-left: 40px;
    border-right: none;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
`
