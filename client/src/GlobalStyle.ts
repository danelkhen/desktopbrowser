import { createGlobalStyle } from "styled-components"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const lightTheme = {
    fg1: "#333",
    fg2: "#666",
    fg3: "#999",
    bg1: "#fff",
    bg2: "#eee",
    bg3: "#ccc",
    bgSel1: "#8ac8ff",
    bgSel2: "#c8dbea",
    bgSel3: "#f9e24e",
    bgSel4: "#fbec88",
    bgSel5: "#fffbe7",
} as const

export const darkTheme = {
    bg1: "#111",
    bg2: "#333",
    bg3: "#666",
    fg1: "#eee",
    fg2: "#ddd",
    fg3: "#bbb",
    bgSel1: "#2468a2",
    bgSel2: "#164783",
    bgSel3: "#002552",
    bgSel4: "#5d5517",
    bgSel5: "#423e22",
} as const

export const colors = darkTheme

export const GlobalStyle = createGlobalStyle`

@font-face {
    font-family: "FreightSansProBook-Regular";
    src: url("/fonts/FreightSansProBook-Regular.eot");
}

@font-face {
    font-family: "FreightTextBold";
    src: url("/fonts/FreightTextBold.eot");
}

html {
    margin: 0;
    padding: 0;
}

body {
    background-color: #060606;
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    font-size: 1em;
    margin: 0;
    padding: 0 0 50px 0;
    cursor: default;
    color: ${colors.fg1};
}


input,
select {
    box-sizing: border-box;
    color: ${colors.fg1};
    background-color: ${colors.bg1};
    font-size: inherit;
}

button {
    color: ${colors.fg1};
    background-color: ${colors.bg1};
    font-size: inherit;
}

a {
    color: inherit;
}

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
    border-bottom: 1px solid ${colors.fg3};
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
