import { createGlobalStyle } from "styled-components"

const themes = {
    __light_fg1: "#333",
    __light_fg2: "#666",
    __light_fg3: "#999",
    __light_bg1: "#fff",
    __light_bg2: "#eee",
    __light_bg3: "#ccc",
    __light_bg_sel1: "#8ac8ff",
    __light_bg_sel2: "#c8dbea",
    __light_bg_sel3: "#f9e24e",
    __light_bg_sel4: "#fbec88",
    __light_bg_sel5: "#fffbe7",
    __dark_bg1: "#111",
    __dark_bg2: "#333",
    __dark_bg3: "#666",
    __dark_fg1: "#eee",
    __dark_fg2: "#ddd",
    __dark_fg3: "#bbb",
    __dark_bg_sel1: "#2468a2",
    __dark_bg_sel2: "#164783",
    __dark_bg_sel3: "#002552",
    __dark_bg_sel4: "#5d5517",
    __dark_bg_sel5: "#423e22",
} as const
export const colors = {
    __fg1: themes.__dark_fg1,
    __fg2: themes.__dark_fg2,
    __fg3: themes.__dark_fg3,
    __bg1: themes.__dark_bg1,
    __bg2: themes.__dark_bg2,
    __bg3: themes.__dark_bg3,
    __bg_sel1: themes.__dark_bg_sel1,
    __bg_sel2: themes.__dark_bg_sel2,
    __bg_sel3: themes.__dark_bg_sel3,
    __bg_sel4: themes.__dark_bg_sel4,
    __bg_sel5: themes.__dark_bg_sel5,
} as const

export const GlobalStyle = createGlobalStyle`

@font-face {
    font-family: "FreightSansProBook-Regular";
    src: url("../fonts/FreightSansProBook-Regular.eot");
}

@font-face {
    font-family: "FreightTextBold";
    src: url("../fonts/FreightTextBold.eot");
}

body {
    background-color: #060606;
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    line-height: 1.5;
    font-size: 1em;
    margin: 0;
    padding: 0 0 50px 0;
    cursor: default;
    color: ${colors.__fg1};
}

.fg1 {
    color: ${colors.__fg1};
}

.fg2 {
    color: ${colors.__fg2};
}

.fg3 {
    color: ${colors.__fg3};
}

.bg1 {
    background-color: ${colors.__bg1};
}

.bg2 {
    background-color: ${colors.__bg2};
}

.bg3 {
    background-color: ${colors.__bg3};
}

.bg-sel1 {
    background-color: ${colors.__bg_sel1};
}

.bg-sel2 {
    background-color: ${colors.__bg_sel2};
}

.bg-sel3 {
    background-color: ${colors.__bg_sel3};
}

.bg-sel4 {
    background-color: ${colors.__bg_sel4};
}

.bg-sel5 {
    background-color: ${colors.__bg_sel5};
}

.palette {
    display: none;
}

.palette > div > div {
    height: 100px;
    width: 100px;
    display: inline-block;
    text-align: center;
    vertical-align: top;
}

html {
    margin: 0;
    padding: 0;
}

input,
select {
    box-sizing: border-box;
    color: ${colors.__fg1};
    background-color: ${colors.__bg1};
    font-size: inherit;
}

button {
    color: ${colors.__fg1};
    background-color: ${colors.__bg1};
    font-size: inherit;
}

a {
    color: inherit;
    /*cursor: default;*/
}

/* .active {
    background-color: ${colors.__bg2};
} */

header {
    position: sticky;
    top: 0;
    background-color: #222;
}
#tbPath {
    width: 100%;
    font-size: inherit;
}

a.Name {
    text-decoration: none;
}

a.Name:hover {
    border-bottom: 1px solid ${colors.__fg3};
}

.container-fluid {
    padding-left: 0;
}

.form-group {
    margin-bottom: 0;
}

.lnr {
    /*color: #0F52BA;*/
    font-size: 20px;
    /* To get crisp results, use sizes that are
  a multiple of 20; because Linearicons was
  designed on a 20 by 20 grid. */
}

#tbQuickFind {
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    background-color: transparent;
    opacity: 0;
}

#tbQuickFind.HasValue {
    opacity: 1;
}

.imdb label {
    margin-right: 10px;
}

.imdb .poster {
    float: right;
}

.imdb .poster img {
    max-width: 300px;
    max-height: 300px;
}

.hidden {
    display: none;
}


.FileRow {
    transition: all 0.3s ease;
    color: #999;
    &:hover {
        background-color: #000;
        color: #a276f8;
        td .Name {
            text-decoration: none;
            cursor: pointer;
        }
    }
    &.Selected {
        color: #fff;
        background-color: #a276f8;
        transition: all 0.3s ease;
    }

    &.IsFolder.HasInnerSelection.Selected {
        color: rgba(238, 238, 238, 0.7);
    }
    &.HasInnerSelection {
        color: rgba(238, 238, 238, 0.3);
    }
}


`
