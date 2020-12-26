var express = require("express")
var app = express()
const PORT = process.env.PORT || 80
var path = require("path")
var hbs = require('express-handlebars');
var bodyParser = require("body-parser");
var formidable = require('formidable');
var allIcons = ['aac.png', 'ace.png', 'ai.png', 'aut.png', 'avi.png', 'bin.png', 'bmp.png', 'cad.png', 'cdr.png', 'css.png', 'db.png', 'dmg.png', 'doc.png', 'docx.png', 'dwf.png', 'dwg.png', 'eps.png', 'exe.png', 'flac.png', 'gif.png', 'hlp.png', 'htm.png', 'html.png', 'ini.png', 'iso.png', 'java.png', 'jpg.png', 'js.png', 'mkv.png', 'mov.png', 'mp3.png', 'mp4.png', 'mpg.png', 'pdf.png', 'php.png', 'png.png', 'ppt.png', 'ps.png', 'psd.png', 'rar.png', 'rss.png', 'rtf.png', 'svg.png', 'swf.png', 'sys.png', 'tiff.png', 'txt.png', 'xls.png', 'xlsx.png', 'zip.png']
var listOfItems = {
    items: [

    ]
}
//LOKALNIE

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials",
}));

app.get("/", function (req, res) {
    res.render('index.hbs');
})
app.get("/up", function (req, res) {
    res.render('up.hbs');
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', listOfItems);

})
app.get("/info/:id", function (req, res) {
    var id = req.params.id
    var item
    for (litem of listOfItems.items) {
        try {
            if (litem.id == id) {
                item = litem
            }
        } catch (error) {

        }
    }
    res.render('info.hbs', item);
})
app.get("/clearAllItems", function (req, res) {
    listOfItems = { items: [] }
    res.redirect("/filemanager")
})
app.get("/delete/:id", function (req, res) {
    var id = req.params.id
    for (item of listOfItems.items) {
        try {
            if (item.id == id) {
                delete listOfItems.items[listOfItems.items.indexOf(item)]
            }
        }catch(e){

        }
    }
    res.redirect("/filemanager")
})

app.get("/download/:id", function (req, res) {
    var id = req.params.id
    var item
    for (litem of listOfItems.items) {
        try {
            if (litem.id == id) {
                item = litem
            }
        } catch (error) {

        }
    }
    try {
        res.download(item.path)
    } catch {
        res.render("alert.hbs", { content: "Nie ma takiego pliku!" })
    }
})


app.post('/handleUpload', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'
    form.parse(req, function (err, fields, files) {
        console.log("----- przesłane formularzem pliki ------");
        if (typeof files.imageupload == "undefined") {

        } else {
            if (typeof files.imageupload.length == "undefined") {
                var y = JSON.stringify(files.imageupload, null, 4)
                var x = JSON.parse(y)
                var item = new newItem(x.size, x.path, x.name, x.type, x.mtime)
                listOfItems.items.push(item)
            } else {
                var y = JSON.stringify(files.imageupload, null, 4)
                var x = JSON.parse(y)
                for (item of x) {
                    var item = new newItem(item.size, item.path, item.name, item.type, item.mtime)
                    listOfItems.items.push(item)
                }
            }
        }
        res.redirect("/filemanager")
    });
});

var id = 1;
function newItem(size, path, name, type, mtime) {
    this.id = id
    this.size = size
    this.path = path
    this.name = name
    this.type = type
    this.mtime = mtime
    this.img = function () {
        var tab = name.split(".")
        for (ele of allIcons) {
            var actual = ele.split(".")
            if (actual[0] == tab[tab.length - 1]) {
                return ("/gfx/icons/" + ele)
            }
        }
        return ("/gfx/icons/unknow.png")
    }
    id++
}

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
