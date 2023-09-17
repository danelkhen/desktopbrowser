import { css } from "@emotion/css"

export interface AddressBarProps {
    path: string
    search: string
    theme: string
    pageIndex: number
    totalPages: number | null
    setTheme(theme: string, remember?: boolean): void
    setPath(v: string): void
    setSearch(v: string): void
    gotoPath(): void
    prevPage(): void
    nextPage(): void
}

export function AddressBar({
    gotoPath,
    path,
    search,
    theme,
    setTheme,
    setPath,
    setSearch,
    prevPage,
    nextPage,
    pageIndex,
    totalPages,
}: AddressBarProps) {
    return (
        <div className={style}>
            <form onSubmit={gotoPath}>
                <input
                    type="text"
                    name="path"
                    id="tbPath"
                    className="form-control"
                    placeholder="Path"
                    value={path}
                    onChange={e => setPath(e.currentTarget.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </form>
            <div className="right-side">
                {(totalPages || 0) > 1 && (
                    <span id="pager" className="Pager btn-group btn-group-sm">
                        <button className="btn btn-default navbar-btn PrevPage" onMouseDown={prevPage}>
                            {"<"}
                        </button>
                        <button className="btn btn-default navbar-btn PagerInfo">
                            {pageIndex + 1} / {totalPages}
                        </button>
                        <button className="btn btn-default navbar-btn NextPage" onMouseDown={nextPage}>
                            {">"}
                        </button>
                    </span>
                )}
                <span className="find">
                    <input
                        type="text"
                        id="tbSearch"
                        value={search}
                        onChange={e => setSearch(e.currentTarget.value)}
                        className="form-control"
                        placeholder="Find Something"
                    />
                </span>
                <select id="ddThemes" className="form-control" value={theme} onChange={e => setTheme(e.target.value)}>
                    <option value="light">light</option>
                    <option value="dark">dark</option>
                </select>
            </div>
        </div>
    )
}

const style = css`
    padding: 0.25em 0.5em;
    font-size: 14px;
    display: flex;
    > form {
        display: flex;
        flex: 1;
    }
    #tbPath {
        flex: 1;
        display: block;
        border: none;
        font-size: 0.8em;
        -webkit-font-smoothing: antialiased;
        padding: 0.5em;
        border-bottom: 1px solid #282828;
        transition: all 0.3s ease;
    }
    #tbPath:last-child {
        margin-right: 0;
    }
    #tbPath:hover {
        border-bottom: 1px solid #323232;
    }
    #tbPath:active,
    #tbPath:focus {
        outline: none;
    }
    .right-side {
        display: block;
        margin-right: 2.74614%;
        text-align: right;
    }
    .right-side:last-child {
        margin-right: 0;
    }
    .right-side #tbSearch {
        border-radius: 20px;
        border: 1px solid #141414;
        font-size: 0.833em;
        -webkit-font-smoothing: antialiased;
        padding: 0.25em 0.5em;
        transition: all 0.3s ease;
    }
    .right-side #tbSearch:hover {
        border-bottom: 1px solid #323232;
    }
    .right-side #tbSearch:active,
    .right-side #tbSearch:focus {
        outline: none;
    }
`
