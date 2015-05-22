<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default2.aspx.cs" Inherits="DesktopBrowser.Default2" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/res/img/clapperboard.png">

    <title>Desktop Browser v1.0.0</title>
    <link href="/res/libs/bootstrap-3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link href="/res/libs/bootstrap-3.3.4/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="/res/css/default2.css" rel="stylesheet" type="text/css" />
    <script src="/res/libs/jquery/jquery-2.1.3.min.js"></script>
    <script src="/res/libs/bootstrap-3.3.4/js/bootstrap.min.js"></script>
    <script src="/res/libs/corex/corex.js"></script>
    <script src="/res/libs/corex/corex-sk.js"></script>
    <script src="/res/libs/corex/corex-jquery.js"></script>
    <script src="/res/libs/corex/grid.js"></script>
    <script src="/res/js/sk.js" type="text/javascript"></script>
    <script src="/res/js/desktopbrowser.js" type="text/javascript"></script>
    <script src="/res/js/default.js" type="text/javascript"></script>
    <script src="/res/js/default2.js" type="text/javascript"></script>
    <script>var _page = new dbr.DefaultPage2();</script>
</head>
<body>
    <!-- Fixed navbar view-source:http://getbootstrap.com/examples/navbar-fixed-top/ -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
<%--        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Project name</a>
        </div>--%>
        <div id="navbar" class="navbar-collapse collapse">
          <ul id="navleft" class="nav navbar-nav">
          </ul>
          <ul id="navright" class="nav navbar-nav navbar-right">
            <li><a id="clock"></a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
    <div id="main" class="container-fluid"></div>
</body>
</html>
