/* Generated by SharpKit 5 v5.4.9 */

if (typeof(dbr) == "undefined")
    var dbr = {};
dbr.DefaultPage = function (){
    this.win = null;
    this.Selector = null;
    this.Service = null;
    this.PageSize = 10;
    this.Data = null;
    this.Service = new dbr.SiteServiceClient();
    this.win = window;
    this.Data = {};
    $($CreateDelegate(this, this.DefaultClient_Load));
};
dbr.DefaultPage.prototype.DefaultClient_Load = function (){
    if (this.Data.MoreAvailable === false){
        $(".Pager .Next").addClass("disabled").attr("disabled", "disabled");
    }
    this.Selector = new dbr.utils.Selector();
    this.Selector.Selected = $CreateAnonymousDelegate(this, function (t){
        t.className = "Selected";
        this.SaveSelection($(t).find(".NameCell A").text());
    });
    this.Selector.UnSelected = $CreateAnonymousDelegate(this, function (t){
        t.className = "";
    });
    this.UpdateClock();
    this.RestoreSelection();
    $(this.win).keydown($CreateAnonymousDelegate(this, function (e){
        if (e.target != null && e.target.nodeName == "INPUT")
            return;
        if (e.which == dbr.utils.Keys.Up){
            e.preventDefault();
            this.Up();
        }
        else if (e.which == dbr.utils.Keys.Down){
            e.preventDefault();
            this.Down();
        }
        else if (e.which == dbr.utils.Keys.PageDown){
            e.preventDefault();
            this.PageDown();
        }
        else if (e.which == dbr.utils.Keys.PageUp){
            e.preventDefault();
            this.PageUp();
        }
        else if (e.which == dbr.utils.Keys.Enter){
            e.preventDefault();
            this.Enter();
        }
        else {
            $("#tbSearch").get(0).focus();
        }
    }));
};
dbr.DefaultPage.prototype.WriteLine = function (obj){
    this.win.document.body.appendChild(this.win.document.createTextNode(obj));
    this.win.document.body.appendChild(this.win.document.createElement("br"));
};
dbr.DefaultPage.prototype.CanMoveSelection = function (by){
    return this.MoveSelection(by, false);
};
dbr.DefaultPage.prototype.MoveSelection = function (by, preview){
    var by2 = by;
    var row = $(this.Selector.SelectedItem);
    if (row.length == 0)
        return false;
    while (by2 > 0){
        if (row.next().length == 0)
            break;
        row = row.next();
        by2--;
    }
    while (by2 < 0){
        if (row.prev().length == 0)
            break;
        row = row.prev();
        by2++;
    }
    if (row.length == 0 || by == by2)
        return false;
    if (!preview){
        var row2 = row.get(0);
        this.Select(row2);
    }
    return true;
};
dbr.DefaultPage.prototype.Select = function (row){
    this.Selector.Select(row);
    var pos = $(row).offset();
    if (pos.top < this.win.pageYOffset){
        row.scrollIntoView(true);
    }
    else if (pos.top > this.win.pageYOffset + this.win.innerHeight){
        row.scrollIntoView(false);
    }
};
dbr.DefaultPage.prototype.PageDown = function (){
    return this.MoveSelection(this.PageSize * 1, false);
};
dbr.DefaultPage.prototype.PageUp = function (){
    return this.MoveSelection(this.PageSize * -1, false);
};
dbr.DefaultPage.prototype.Enter = function (){
    var anchor = $(this.Selector.SelectedItem).find("a").get(0);
    if (anchor.nodeName == "A"){
        this.SimulateClick(anchor);
        return true;
    }
    return false;
};
dbr.DefaultPage.prototype.SelectFirstItem = function (){
    var first = $("grdFiles TBODY TR").first().get(0);
    if (first != null){
        this.Select(first);
        return true;
    }
    return false;
};
dbr.DefaultPage.prototype.Down = function (){
    if (!this.MoveSelection(1, false))
        return this.SelectFirstItem();
    return false;
};
dbr.DefaultPage.prototype.Up = function (){
    if (!this.MoveSelection(-1, false))
        return this.SelectFirstItem();
    return false;
};
dbr.DefaultPage.prototype.RestoreSelection = function (){
    var folder = $("#tbFilename").val();
    var filename = dbr.DefaultPage.RestoreSelection(folder);
    if (filename != null && filename.length > 0){
        $("#grdFiles .NameCell A").each($CreateAnonymousDelegate(this, function (i, el){
            var x = $(el);
            if (x.text() == filename){
                this.Selector.Select(x.parents("tr").first().get(0));
                return false;
            }
        }));
    }
};
dbr.DefaultPage.RestoreSelection = function (folder){
    var filename = dbr.DefaultPage.GetStorageItem(folder);
    return filename;
};
dbr.DefaultPage.GetStorageItem = function (key){
    return window.localStorage.getItem(key);
};
dbr.DefaultPage.SetStorageItem = function (key, value){
    window.localStorage.setItem(key, value);
};
dbr.DefaultPage.prototype.SaveSelection = function (filename){
    var folder = $("#tbFilename").val();
    dbr.DefaultPage.SaveSelection2(folder, filename);
};
dbr.DefaultPage.SaveSelection2 = function (folderName, filename){
    dbr.DefaultPage.SetStorageItem(folderName, filename);
};
dbr.DefaultPage.prototype.UpdateClock = function (){
    $("#divTime").text(new Date().format("HH:mm"));
    $("#divDate").text(new Date().format("ddd, MMM d"));
    this.win.setTimeout($CreateDelegate(this, this.UpdateClock), 5000);
};
dbr.DefaultPage.prototype.Execute = function (path){
    new dbr.SiteServiceClient().Execute({
        Path: path
    }, null);
};
dbr.DefaultPage.prototype.OpenFile = function (path){
    this.Execute(path);
};
dbr.DefaultPage.prototype.GetSelectedPath = function (){
    if (this.Selector.SelectedItem == null)
        return null;
    var filePath = $(this.Selector.SelectedItem).find(".ihFilePath").val();
    return filePath;
};
dbr.DefaultPage.prototype.btnDelete_click = function (){
    var path = this.GetSelectedPath();
    if (path == null)
        return;
    if (!this.win.confirm("are you sure you want to permanantly delete the path: " + path))
        return;
    this.Service.Delete({
        Path: path
    }, $CreateAnonymousDelegate(this, function (t){
        this.win.location.reload();
    }));
};
dbr.DefaultPage.prototype.Filter = function (el, exp){
    var x = $(el);
    x.parents("tr").first().toggle(x.text().search(exp) >= 0);
};
dbr.DefaultPage.prototype.tbFolder_keydown = function (e){
    if (e.keyCode == 13){
        this.Go();
    }
};
dbr.DefaultPage.prototype.Go = function (){
    var newPath = $("#tbFolder").val();
    this.win.location.href = "?p=" + encodeURIComponent(newPath);
};
dbr.DefaultPage.prototype.btnGo_click = function (e){
    this.Go();
};
dbr.DefaultPage.prototype.tbSearch_keyup = function (e){
    var search = $("#tbSearch").val();
    var exp = new RegExp(dbr.utils.ClientExtensions.RegexEscape(search), "i");
    $("#grdFiles .NameCell A").each($CreateAnonymousDelegate(this, function (i, el){
        this.Filter(el, exp);
    }));
};
dbr.DefaultPage.prototype.SimulateClick = function (anchor){
    var a = $(anchor);
    a.trigger("click", null);
    var href = a.attr("href");
    if (href != null && href.length > 0){
        var target = a.attr("target");
        if (target == "_blank")
            this.win.open(href, "");
        else
            this.win.location.href = href;
    }
};
if (typeof(dbr.utils) == "undefined")
    dbr.utils = {};
dbr.utils.Selector = function (){
    this.Selected = null;
    this.UnSelected = null;
    this.SelectedItem = null;
};
dbr.utils.Selector.prototype.Select = function (el){
    if (this.SelectedItem == el)
        return;
    var unselected = this.SelectedItem;
    this.SelectedItem = el;
    if (unselected != null && this.UnSelected != null)
        this.UnSelected(unselected);
    if (this.SelectedItem != null && this.Selected != null)
        this.Selected(this.SelectedItem);
};

