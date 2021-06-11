import { createGlobalStyle } from "styled-components"
export const GlobalStyle = createGlobalStyle`

@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import url("https://fonts.googleapis.com/css?family=PT+Sans:400,700");

@font-face {
    font-family: "FreightSansProBook-Regular";
    src: url("../fonts/FreightSansProBook-Regular.eot");
}

@font-face {
    font-family: "FreightTextBold";
    src: url("../fonts/FreightTextBold.eot");
}

:root {
    /* --theme: "dark"; or 'light'  */

    /* light theme  */

    --light-fg1: #333;
    /* --light-fg1a: fade(@light-fg1, 30%); */
    --light-fg2: #666;
    --light-fg3: #999;
    --light-bg1: #fff;
    --light-bg2: #eee;
    --light-bg3: #ccc;
    --light-bg-sel1: #8ac8ff; /*#053e70;*/
    --light-bg-sel2: #c8dbea; /*#e5eef5;*/
    --light-bg-sel3: #f9e24e;
    --light-bg-sel4: #fbec88;
    --light-bg-sel5: #fffbe7;

    /**************/

    /* dark theme */

    --dark-bg1: #111;
    --dark-bg2: #333;
    --dark-bg3: #666;
    --dark-fg1: #eee;
    /* --dark-fg1a: fade(@dark-fg1, 30%); */
    --dark-fg2: #ddd;
    --dark-fg3: #bbb;
    --dark-bg-sel1: #2468a2;
    --dark-bg-sel2: #164783;
    --dark-bg-sel3: #002552;
    --dark-bg-sel4: #5d5517;
    --dark-bg-sel5: #423e22;

    /**************/

    --fg1: var(--dark-fg1);
    /* --fg1a: var(--dark-fg1a)"; */
    --fg2: var(--dark-fg2);
    --fg3: var(--dark-fg3);
    --bg1: var(--dark-bg1);
    --bg2: var(--dark-bg2);
    --bg3: var(--dark-bg3);
    --bg-sel1: var(--dark-bg-sel1);
    --bg-sel2: var(--dark-bg-sel2);
    --bg-sel3: var(--dark-bg-sel3);
    --bg-sel4: var(--dark-bg-sel4);
    --bg-sel5: var(--dark-bg-sel5);
}
body {
    background-color: #060606;
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    line-height: 1.5;
    font-size: 1em;
    margin: 0;
    padding: 0 0 50px 0;
    cursor: default;
    color: var(--fg1);
}

.fg1 {
    color: var(--fg1);
}

.fg2 {
    color: var(--fg2);
}

.fg3 {
    color: var(--fg3);
}

.bg1 {
    background-color: var(--bg1);
}

.bg2 {
    background-color: var(--bg2);
}

.bg3 {
    background-color: var(--bg3);
}

.bg-sel1 {
    background-color: var(--bg)-sel1;
}

.bg-sel2 {
    background-color: var(--bg)-sel2;
}

.bg-sel3 {
    background-color: var(--bg)-sel3;
}

.bg-sel4 {
    background-color: var(--bg)-sel4;
}

.bg-sel5 {
    background-color: var(--bg)-sel5;
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
    color: var(--fg1);
    background-color: var(--bg1);
    font-size: inherit;
}

button {
    color: var(--fg1);
    background-color: var(--bg1);
    font-size: inherit;
}

a {
    color: inherit;
    /*cursor: default;*/
}

/* .active {
    background-color: var(--bg2);
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
    border-bottom: 1px solid var(--fg3);
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


`
