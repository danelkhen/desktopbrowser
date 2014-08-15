<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FilesGrid.ascx.cs" Inherits="DesktopBrowser.Templates.FilesGrid" %>
<table id="grdFiles" class="Grid" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th class="SelectionHeader" onmousedown="$('#grdFiles TBODY TR').toggleClass('Selected');">
            </th>
            <th class="NameHeader">
                <a href="<%=req.SetSortBy("Name", false) %>" class="<%=(req.Sort.Contains("Name")).IfTrue("Selected")%>"
                    oncontextmenu='window.location=<%=req.AddSortBy("Name", false).ToJavaScript() %>;return false;'
                    title="Click to sort by Name">Name</a>
            </th>
            <th class="ModifiedHeader"><a href="<%=req.SetSortBy("Modified", true) %>" class="<%=(req.Sort.Contains("Modified")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=req.AddSortBy("Modified", true).ToJavaScript() %>;return false;'
            title="Click to sort by Last Modified date">Modified</a>
            </th>
            <th class="SizeHeader"><a href="<%=req.SetSortBy("Size", true) %>" class="<%=(req.Sort.Contains("Size")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=req.AddSortBy("Size", true).ToJavaScript() %>;return false;'
            title="Click to sort by size">Size</a>
            </th>
            <th class="ExtensionHeader"><a href="<%=req.SetSortBy("Extension", false) %>" class="<%=(req.Sort.Contains("Extension")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=req.AddSortBy("Extension", false).ToJavaScript() %>;return false;'
            title="Click to sort by extension">Ext</a>
            </th>
        </tr>
    </thead>
    <tbody>
        <%
            if (Files != null)
            {
                var taken = 0;
                foreach (var file in Files)
                {
                    taken++;
                    if (req.Take != null && taken> req.Take.Value)
                    {
                        MoreAvailable = true;
                        break;
                    }
        %>
        <tr onmousedown="Selector.Select(this);return false;" ondblclick="SimulateClick($(this).find('a').get(0));return false;">
            <td>&nbsp;<input type="hidden" value="<%=file.Path %>" class="ihFilePath"/> </td>
            <td class="NameCell"><a href="<%=file.GetHref(req) %>" class="FsElement <%=file.IsFolder.IfTrue("Folder", "File") %>"<%=file.IsFolder.IfFalse("target=\"_blank\"") %>><%=file.Name%></a>
            </td>
            <td class="ModifiedCell">
                <%=file.Modified.ToFriendlyRelative2()%>
            </td>
            <td class="SizeCell">
                <%=file.Size != null ? new Size(file.Size.Value) : null%>
            </td>
            <td class="ExtensionCell">
                <%=file.Extension != null ? file.Extension.ToLower() : null%>
            </td>
        </tr>
        <%
                }
                %>
                <script>Data.MoreAvailable = <%=MoreAvailable.ToString().ToLower()%>;</script><%
                
            } %>
    </tbody>
</table>
