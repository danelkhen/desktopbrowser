import { Draft } from "immer"

export type Produce<T> = (v: Draft<T>) => Draft<T>
