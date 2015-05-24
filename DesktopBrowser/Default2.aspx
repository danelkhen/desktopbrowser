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
    <nav class="navbar navbar-default navbar-fixed-top small">
        <div class="container-fluid">
            <div id="navbar" class="navbar-collapse collapse">
                <ul id="navleft" class="nav navbar-nav">
                </ul>
                <ul id="navright" class="nav navbar-nav navbar-right">
                    <li><a id="clock"></a></li>
                </ul>
                <form class="navbar-form navbar-right" role="search">
                    <div class="form-group form-group-sm">
                        <input type="text" id="tbSearch" class="form-control" placeholder="Find" />
                    </div>
                </form>
                <div class="navbar-right">
                    <div class="btn-toolbar">
                        <div id="pager" class="Pager btn-group btn-group-sm">
                            <a class="btn btn-default navbar-btn PrevPage"><span class="glyphicon glyphicon-backward"></span></a>
                            <a class="btn btn-default navbar-btn PagerInfo"></a>
                            <a class="btn btn-default navbar-btn NextPage"><span class="glyphicon glyphicon-forward"></span></a>
                        </div>
                    </div>
                </div>
            </div>
            <!--/.nav-collapse -->
            <form>
                <div class="form-group form-group-sm">
                    <input type="text" id="tbPath" class="form-control" placeholder="Path" />
                </div>
            </form>
        </div>
    </nav>
    <div id="main" class="container-fluid"></div>
</body>
</html>
