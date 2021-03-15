export interface Version {
    _value: number
}

export interface Attr {
    version: Version
}

export interface Title {
    _text: string
}

export interface Link {
    _text: string
}

export interface PubDate {
    _text: string
}

export interface Title2 {
    _text: string
}

export interface Link2 {
    _text: string
}

export interface Guid {
    _text: string
}

export interface Description {
    _text: string
}

export interface Item {
    pubDate: PubDate[]
    title: Title2
    link: Link2
    guid: Guid
    description: Description
}

export interface Channel {
    title: Title
    link: Link
    item: Item[]
}

export interface Rss {
    _attr: Attr
    channel: Channel
}

export interface RootObject {
    rss: Rss
}
