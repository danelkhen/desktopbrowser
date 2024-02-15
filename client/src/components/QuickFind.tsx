import { useRef, useState } from "react"
import { sleep } from "../lib/sleep"
import { FsFile } from "../services/FileService"
import { cx } from "@emotion/css"

export function QuickFind({ allFiles, onFindFiles }: QuickFindProps) {
    const [value, setValue] = useState("")
    const versionRef = useRef(0)

    function onChange(value: string) {
        console.log("setQuickFindText", value)
        versionRef.current++
        setValue(value)
        if (!value) return
        quickFind(value)
        scheduleClear()
    }
    async function scheduleClear() {
        const version = versionRef.current
        await sleep(2000)
        if (version !== versionRef.current) return
        onChange("")
    }

    function quickFind(value: string) {
        const list = allFiles
        const s = value.toLowerCase()
        const item = list.find(t => t.Name.toLowerCase().includes(s))
        if (!item) return
        onFindFiles([item])
    }

    return (
        <input
            id="tbQuickFind"
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
            className={cx(value.length > 0 && "HasValue")}
        />
    )
}

export interface QuickFindProps {
    allFiles: FsFile[]
    onFindFiles(files: FsFile[]): void
}
