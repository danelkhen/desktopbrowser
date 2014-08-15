<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FolderMenu.ascx.cs"
    Inherits="DesktopBrowser.Templates.FolderMenu" %>
<div class="btn-group-sm btn-group">
<a class="btn btn-default" href="<%=parentFolder.IfNotNull(t=> t.GetHref(req))%>" title="<%=parentFolder.IfNotNull(t=> t.Path)%>">Up</a>
<a class="btn btn-default" href="<%=prevSibling.IfNotNull(t=> t.GetHref(req)) %>" title="<%=prevSibling.IfNotNull(t=> t.Path)%>">Prev</a>
<a class="btn btn-default" href="<%=nextSibling.IfNotNull(t=> t.GetHref(req)) %>" title="<%=nextSibling.IfNotNull(t=> t.Path)%>">Next</a>
<a class="btn btn-default <%=req.HideFolders.Active()%>" href="<%=req.Clone(t=>t.HideFolders=!t.HideFolders) %>" title="Shows or hides folders">Folders</a>
<a class="btn btn-default <%=req.HideFiles.Active()%>" href="<%=req.Clone(t=>t.HideFiles=!t.HideFiles) %>" title="Shows or hides files">Files</a>
<a class="btn btn-default <%=req.MixFilesAndFolders.Active()%>" href="<%=req.Clone(t=>t.MixFilesAndFolders=!t.MixFilesAndFolders) %>" title="Disables Folder grouping">Mix</a>
<a class="btn btn-default <%=req.FolderSize.Active()%>" href="<%=req.Clone(t=>t.FolderSize=!t.FolderSize) %>" title="Calculates folder sizes">Folders Size</a>
<a class="btn btn-default <%=req.KeepView.Active()%>" href="<%=req.Clone(t=>t.KeepView=!t.KeepView) %>" title="Keeps the same view when navigating to other folders">Keep View</a>
<a class="btn btn-default <%=req.ShowHiddenFiles.Active()%>" href="<%=req.Clone(t=>t.ShowHiddenFiles=!t.ShowHiddenFiles) %>"         title="Shows or hides hidden files">Hidden</a>
<a class="btn btn-default <%=req.IsRecursive.Active()%>" href="<%=req.Clone(t=>t.IsRecursive=!t.IsRecursive) %>"         title="Recursively shows all files">Recursive</a>
<a class="btn btn-default <%=req.View=="ImageList" ? "Selected" : ""%>" href="<%=req.ToggleImageListView()%>"         title="Changes the view mode">Image View</a>
<a class="btn btn-default" href="<%= GetSubtitleSearchLink() %>" target="_blank">Subs</a>
<a class="btn btn-default" onclick="btnDelete_click(event);" title="Delete">Delete</a>
<a class="btn btn-default" onclick="OpenFile(<%=req.Path.ToJavaScript().ToHtmlAttributeValue() %>);" title="Open folder in windows exlorer">Explore</a>
</div>
