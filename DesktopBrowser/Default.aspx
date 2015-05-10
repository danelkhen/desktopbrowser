<%@ Page Language="C#" AutoEventWireup="true" Inherits="DesktopBrowser.Default" CodeBehind="~/Default.aspx.cs" %>

<%@ OutputCache Duration="20" VaryByParam="*" %>
<%Response.BufferOutput = false; %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><%=File.Name%> - Desktop Browser v1.0.0</title>
    <link href="res/libs/bootstrap-3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link href="res/libs/bootstrap-3.3.4/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="res/css/default.css" rel="stylesheet" type="text/css" />
    <script src="res/libs/jquery/jquery-2.1.3.min.js"></script>
</head>
<body>
    <%if (!File.IsFolder)
      { %>
    <script>window.setTimeout(function () { window.close(); }, 3);</script>
    <%}
      else
      {%>
    <uc:NavBar runat="server" />
    <div>
        <div class="Panel row row-full">
            <div class="col-md-12">
                <input type="text" id="tbFilename" value="<%=File.Name %>" readonly />
            </div>
        </div>
        <form method="get" action="Default.aspx" class="form-horizontal">
            <div class="form-group row-full">
                <div class="col-md-11">
                    <input class="form-control" type="text" id="tbFolder" value="<%=Req.Path.ToHtmlAttributeValue() %>" onkeydown="_page.tbFolder_keydown(event);" name="p" />
                </div>
                <div class="col-md-1">
                    <input class="form-control btn btn-default" type="submit" value="Go" />
                </div>
            </div>
            <%if (Req.KeepView)
              {
                  foreach (var pair in Req.Serialize().Where(t => t.Key != "p"))
                  {
            %>
            <input type="hidden" name="<%=pair.Key %>" value="<%=pair.Value.ToHtmlAttributeValue() %>" />
            <%}
              } %>
        </form>
        <div class="Panel">
            <uc:FilesGrid ID="FilesGrid1" runat="server" />
        </div>
        <%if (Req.View == "ImageList")
          { %>
        <div class="Panel">
            <uc:FilesImageList ID="FilesImageList1" runat="server" />
        </div>
        <%}%>
        <%} %>
        <div class="Footer">
            <p><a href="https://github.com/danelkhen/desktopbrowser" target="_blank">DesktopBrowser</a> by Dan-el (Copyright &copy; all rights reserved 2011)</p>
            <p><a href="https://github.com/danelkhen/desktopbrowser/releases">Check for new version</a></p>
        </div>
    </div>
    <script src="res/libs/bootstrap-3.3.4/js/bootstrap.min.js"></script>
    <script src="res/js/sk.js" type="text/javascript"></script>
    <script src="res/js/date.format.js" type="text/javascript"></script>
    <script src="res/js/desktopbrowser.js" type="text/javascript"></script>
    <script src="res/js/default.js" type="text/javascript"></script>
    <script>var _page = new dbr.DefaultPage();</script>
</body>
</html>
