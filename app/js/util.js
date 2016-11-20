let http = require('http');
let url = require('url');
let util = require('util');
var FFI = require('ffi');
var fs = require("fs");

var BingWallpaper = {}
Object.defineProperties(BingWallpaper, {
    infourl: {
        value: "http://cn.bing.com/cnhp/life?currentDate="
    },

    data: {
        value: {
            format: 'js',
            idx: 0,
            n: 1,
            pid: 'hp',
            mkt: 'zh_CN',
            video: 1
        }
    },
    idx: {
        get: function () {
            return this.data.idx
        },
        set: function (value) {
            this.data.idx = value
            this.getWallpaper(this.data)
            this.setNextButton()
        }
    },

    getWallpaper: {
        value: function (data) {

            let qs = require('querystring');

            let content = qs.stringify(data);

            let options = {
                hostname: 'cn.bing.com',
                port: 80,
                path: '/HPImageArchive.aspx?' + content,
                method: 'GET'
            };

            let req = http.get(options, (res) => {
                var json = ""
                res.on('data', function (chunk) {
                    json += chunk
                });
                res.on('end', function () {
                    document.querySelector(".bgimage").style.opacity = 0
                    document.querySelector(".info-content").style.opacity = 0
                    with (window) {
                        BingWallpaper.setBackground(JSON.parse(json).images[0])
                    }
                });
            }).on('error', (e) => {
                console.log(`Got error: ${e.message}`);
            });
        }
    },


    setBackground: {
        value: function (data) {
            document.querySelector(".copyright").innerHTML = data.copyright
            document.querySelector(".button-download").setAttribute("href", data.url)
            document.querySelector(".button-download").setAttribute("download", data.url.match(/([A-z0-9-_]*?)\.jpg$/g))
            setTimeout(function () {
                var img = new Image();
                img.src = data.url;
                img.onload = function () {
                    let req = http.get(BingWallpaper.infourl + data.enddate, (res) => {
                        var infohtml = ""
                        res.on('data', function (chunk) {
                            infohtml += chunk
                        })
                        res.on('end', function () {
                            document.querySelector('.info-content').innerHTML = infohtml
                            document.getElementById('hpla').removeChild(document.getElementById('hplaDL'));
                            document.getElementById('hpla').removeChild(document.getElementById('hpBingAppQR'));
                            document.querySelector(".info-content").style.opacity = 1
                        });
                    }).on('error', (e) => {
                        console.log(`Got error: ${e.message}`);
                    });
                    document.querySelector(".bgimage").style.backgroundImage = "url('" + data.url + "')"
                    document.querySelector(".bgimage").style.opacity = 1
                }
            }, 500);
        }
    },
    setNextButton: {
        value: function () {
            console.log(this.data.idx)
            if (this.data.idx == 0) {
                document.querySelector('.button-next').style["-webkit-app-region"] = "drag"
                document.querySelector('.button-next').style.opacity = 0.4;
            } else {
                document.querySelector('.button-next').style["-webkit-app-region"] = "no-drag"
                document.querySelector('.button-next').style.opacity = 1;
            }
        }
    },

    _infoSwitch: {
        value: false,
        writable: true

    },

    infoSwitch: {
        get: function () {
            return this._infoSwitch
        },
        set: function () {
            var t = document.querySelector('.info')
            console.log(this._infoSwitch)
            this._infoSwitch = !this._infoSwitch
            console.log(this._infoSwitch)
            this._infoSwitch ? t.className = t.className.replace(/ info-hide/g, '') : t.className = t.className + ' info-hide';
        }
    },

    downloadImage: {
        value: null
    },
    setSystemBackground: {
        value: function () {
            var url = document.querySelector(".button-download").attributes['href'].value
            console.log(url)
            http.get(url, function (res) {
                var imgData = "";
                var path = process.env.USERPROFILE +"\\Pictures\\BingWallpaper\\" + url.match(/([A-z0-9-_]*?)\.jpg$/g)
                console.log(path)
                res.setEncoding("binary");
                res.on("data", function (chunk) {
                    imgData += chunk;
                });
                res.on("end", function () {
                    fs.writeFile( path, imgData, "binary", function (err) {
                        if (err) {
                            console.log(err);
                        }
                        var user32 = new FFI.Library('user32', {
                            SystemParametersInfoW:
                            [
                                'int32', ['int32', 'int32', 'string', 'int32']
                            ]
                        });
                        var loc = new Buffer(path, 'ucs-2');
                        var a = user32.SystemParametersInfoW(20, true, loc, 0)
                    });
                });
            });
        }
    }
})

BingWallpaper.idx = BingWallpaper.idx