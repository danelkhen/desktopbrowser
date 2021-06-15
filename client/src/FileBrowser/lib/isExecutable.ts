// // {
// //     [P in FunctionKeys<Helper>]: (arg: Parameters<Helper[P]>[0]) => void
// // }
// type Actions = {
//     [P in FunctionKeys<Helper>]: {
//         type: P
//         payload: Parameters<Helper[P]>[0]
//     }
// }[FunctionKeys<Helper>]
// let _dispatch: Dispatcher = null!
// function reducer(state: State, action: Actions): State {
//     const helper = new Helper(state) as Helper
//     const res = (helper[action.type] as any)(action.payload)
//     const newState = (helper as any as { state: State }).state
//     if (newState !== state) {
//         console.log("state changed")
//     }
//     if (isPromise(res)) {
//         ;(async () => {
//             await res
//             const newState2 = (helper as any as { state: State }).state
//             if (newState !== newState2) {
//                 _dispatch.set(newState2)
//             }
//         })()
//     }
//     return newState
// }
export function isExecutable(extension: string) {
    return [".exe", ".bat", ".com", ".cmd"].includes(extension.toLowerCase())
}
