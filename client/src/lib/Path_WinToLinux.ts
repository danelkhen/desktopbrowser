export function Path_WinToLinux(path: string): string {
    if (!path) return path
    const isNetworkShare = path.startsWith("\\\\")
    if (isNetworkShare)
        //network share
        path = "net/" + path.substr(2)
    const tokens = path.split("\\") //.where(t=>t.length>0);
    if (!isNetworkShare) tokens[0] = tokens[0].replace(/:/g, "")
    //tokens[0] = tokens[0].replaceAll(":", "");
    //tokens = tokens;
    path = tokens.join("/")
    //path = path.replaceAll(":\\", "/").replaceAll("\\", "/");
    //path = "/" + path;
    path = encodeURI(path)
    path = "/" + path
    //if (!path.startsWith("/"))
    //    path = "/" + path;
    if (!path.endsWith("/")) path += "/"
    return path
}
