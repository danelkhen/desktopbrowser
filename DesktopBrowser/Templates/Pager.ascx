<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Pager.ascx.cs" Inherits="DesktopBrowser.Templates.Pager" %>
<div class="btn-group btn-group-sm Pager">
<a class="btn btn-default Previous<%=PreviousDisabled %>" <%=PreviousDisabled %> href="<%=SiteRequest.PreviousPage().GetHref() %>"><span class="glyphicon glyphicon-backward"></span></a>
<a class="btn btn-default"><%=(SiteRequest.Skip / SiteRequest.Take)+1 %></a>
<a class="btn btn-default Next" href="<%=SiteRequest.NextPage().GetHref() %>"><span class="glyphicon glyphicon-forward"></span></a>   
<%foreach (var select in Selects){ %>
<div class="btn-group btn-group-sm">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><%=select.Label %><span class="caret"></span></button>
    <ul class="dropdown-menu">
          <%foreach(var option in select.Options) { %>
      <li class="<%=option.IsSelected ? "active" : "" %>"><a href="<%=option.Value %>"><%=option.Label%></a></li>
      <%} %>
    </ul>
</div>
<%} %>

</div>