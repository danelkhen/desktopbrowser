export type AbortableResult<T> = AbortedResult<T> | NotAbortedResult<T>
export type AbortedResult<T> = {
    aborted: true
    result: T | undefined
}
export type NotAbortedResult<T> = {
    aborted: false
    result: T
}

export class Abortable<T> {
    constructor(action: (signal: AbortSignal) => Promise<T>) {
        this.abortController = new AbortController()
        this.action = action
        this._whenCompleted = this.run()
    }
    private readonly _whenCompleted: Promise<AbortableResult<T>>
    whenCompleted() {
        return this._whenCompleted
    }
    private action?: (signal: AbortSignal) => Promise<T>
    private async run(): Promise<AbortableResult<T>> {
        const action = this.action
        if (!action) {
            throw new Error("Abortable action is already running")
        }
        this.action = undefined

        const signal = this.abortController.signal
        const whenAborted = new Promise(resolve =>
            this.abortController.signal.addEventListener("abort", resolve, { once: true })
        )

        let result: T | undefined
        const whenNotAborted = (async () => {
            result = await action(signal)
        })()

        await Promise.race([whenNotAborted, whenAborted])
        this._isCompleted = true

        if (signal.aborted) {
            return { aborted: true, result }
        }
        return { aborted: false, result: result as T }
    }
    abort() {
        this.abortController.abort()
    }
    private _isCompleted?: boolean
    get isCompleted() {
        return !!this._isCompleted
    }
    get isRunning() {
        return !this._isCompleted
    }
    private abortController: AbortController
}

export class AbortableTask<T> {
    private abortable: Abortable<T> | null = null
    abort() {
        if (!this.abortable || this.abortable.isCompleted) return
        this.abortable.abort()
        this.abortable = null
    }
    abortAndRun(action: (signal: AbortSignal) => Promise<T>): Promise<AbortableResult<T>> {
        this.abort()
        this.abortable = new Abortable(action)
        return this.abortable.whenCompleted()
    }
}
