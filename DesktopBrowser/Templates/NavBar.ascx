<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="NavBar.ascx.cs" Inherits="DesktopBrowser.Templates.NavBar" %>
<%@ Register Src="FolderMenu.ascx" TagName="FolderMenu" TagPrefix="uc" %>
<%@ Register Src="Pager.ascx" TagName="Pager" TagPrefix="uc" %>
<%@ Register Src="Finder.ascx" TagName="Finder" TagPrefix="uc" %>
<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top navbar-sm" role="navigation">
    <div class="btn-toolbar">
        <%-- nav navbar-nav navbar-left --%>
        <uc:FolderMenu ID="FolderMenu1" runat="server" />
        <uc:Finder ID="Finder1" runat="server"/>
        <%if (ShowGrid){ %><uc:Pager ID="Pager1" runat="server" /><%} %>
        <div id="divClock" class="btn-group btn-group-sm pull-right">
        <div class="btn btn-default">
            <span id="divTime"><%=DateTime.Now.ToString("h:mm tt") %></span><br />
            <span id="divDate"><%=DateTime.Now.ToString("ddd, MMM d")%></span>
            </div>
        </div>
    </div>
</div>
