<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FilesImageList.ascx.cs"
    Inherits="DesktopBrowser.Templates.FilesImageList" %>
<table style="width: 100%; table-layout: fixed">
    <%
        var x = 0;
        var cols = Columns;
        var perc = String.Format("{0:0.#}%", (100f / (float)cols));
        var service = new SiteService();
        var files = Files.ToList();
        var missing = cols - (files.Count % cols);
        for (var i = 0; i < missing; i++)
            files.Add(null);
        foreach (var file in files)
        {
            x++;
            if (x - 1 % cols == 0)
            { %>
    <tr>
        <%} %>
        <td style="width: <%=perc%>;" valign="top">
            <%
            if (file != null)
            {
                var image = file;
                if (file.IsFolder)
                {
                    image = GetFirstImage(file);
                }
            %>
            <a href="<%=file.GetHref() %>" class="FsElement <%=file.IsFolder.IfTrue("Folder", "File") %>"
                <%=file.IsFolder.IfFalse("target=\"_blank\"") %>>
                <%=file.Name%></a>
            <%if (image != null)
              { %>
            <br />
            <a href="<%=file.GetHref() %>" <%=file.IsFolder.IfFalse("target=\"_blank\"") %> <%=image==null ? "" :"onmousedown='Execute("+new JavaScriptSerializer().Serialize(image.Path)+");'" %>>
                <img src="<%=image.GetFileContentHref() %>" style="width: 100%;"  />
                <%} %>
            </a>
            <%} %>
        </td>
        <%if (x % cols == 0)
          { %>
    </tr>
    <%}
        } 
    %>
</table>
