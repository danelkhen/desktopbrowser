<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FilesGrid.ascx.cs" Inherits="DesktopBrowser.Templates.FilesGrid" %>
<table id="grdFiles" class="Grid">
    <thead>
        <tr>
            <th class="SelectionHeader" onmousedown="$('#grdFiles TBODY TR').toggleClass('Selected');">
            </th>
            <th class="NameHeader">
                <a href="<%=Req.SetSortBy("Name", false) %>" class="<%=(Req.Sort.Contains("Name")).IfTrue("Selected")%>"
                    oncontextmenu='window.location=<%=Req.AddSortBy("Name", false).ToJavaScript() %>;return false;'
                    title="Click to sort by Name">Name</a>
            </th>
            <th class="ModifiedHeader"><a href="<%=Req.SetSortBy("Modified", true) %>" class="<%=(Req.Sort.Contains("Modified")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=Req.AddSortBy("Modified", true).ToJavaScript() %>;return false;'
            title="Click to sort by Last Modified date">Modified</a>
            </th>
            <th class="SizeHeader"><a href="<%=Req.SetSortBy("Size", true) %>" class="<%=(Req.Sort.Contains("Size")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=Req.AddSortBy("Size", true).ToJavaScript() %>;return false;'
            title="Click to sort by size">Size</a>
            </th>
            <th class="ExtensionHeader"><a href="<%=Req.SetSortBy("Extension", false) %>" class="<%=(Req.Sort.Contains("Extension")).IfTrue("Selected")%>"
            oncontextmenu='window.location=<%=Req.AddSortBy("Extension", false).ToJavaScript() %>;return false;'
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
                    if (Req.Take != null && taken> Req.Take.Value)
                    {
                        MoreAvailable = true;
                        break;
                    }
        %>
        <tr onmousedown="_page.Selector.Select(this);return false;" ondblclick="_page.SimulateClick($(this).find('a').get(0));return false;">
            <td>&nbsp;<input type="hidden" value="<%=file.Path %>" class="ihFilePath"/> </td>
            <td class="NameCell"><a href="<%=file.GetHref(Req) %>" class="FsElement <%=file.IsFolder.IfTrue("Folder", "File") %>"<%=file.IsFolder.IfFalse("target=\"_blank\"") %>><%=file.Name%></a>
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
                <script>$(function(){_page.Data.MoreAvailable = <%=MoreAvailable.ToString().ToLower()%>;});</script><%
                
            } %>
    </tbody>
</table>
