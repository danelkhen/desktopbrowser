declare module "github-api" {
    export interface Result<T> {
        data: T
    }
    export default class GitHub {
        getRepo(user: string, repo: string): Repo
    }
    export interface Repo {
        getRelease(name: string): Promise<Result<Release>>
    }
    export interface Release {
        name: string
        browser_download_url: string
    }
}
