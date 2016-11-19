let http = require('http');
let url = require('url');

let infourl = "http://cn.bing.com/cnhp/life?currentDate="
let data = {
    format: 'js',
    idx: 0,
    n: 1,
    pid: 'hp',
    mkt: 'zh_CN',
    video: 1
};

let getWallpaper = function (data) {

    let qs = require('querystring');

    let content = qs.stringify(data);

    let options = {
        hostname: 'cn.bing.com',
        port: 80,
        path: '/HPImageArchive.aspx?' + content,
        method: 'GET'
    };

    let req = http.get(options, (res) => {
        var data = ""
        res.on('data', function (chunk) {
            data += chunk
        });
        res.on('end', function () {
            document.querySelector(".bgimage").style.opacity = 0
            document.querySelector(".info-content").style.opacity = 0
             setBackground(JSON.parse(data).images[0])
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}





let setBackground = function (data) {
    document.querySelector(".copyright").innerHTML = data.copyright
    document.querySelector(".button-download").setAttribute("href",data.url)
    document.querySelector(".button-download").setAttribute("download",data.url.match(/([A-z0-9-_]*?)\.jpg$/g))
    setTimeout(function () {
        var img = new Image();
        img.src = data.url;
        img.onload = function () {
            let req = http.get(infourl + data.enddate, (res) => {
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

let switchWallpaper = function (count) {
    data.idx += count
    getWallpaper(data)
    setNextButton()
}

let setNextButton = function () {
    console.log(data.idx)
    if (data.idx == 0) {
        console.log(1)
        document.querySelector('.button-next').style["-webkit-app-region"] = "drag"
        document.querySelector('.button-next').style.opacity = 0.4;
    } else {
        document.querySelector('.button-next').style["-webkit-app-region"] = "no-drag"
        document.querySelector('.button-next').style.opacity = 1;
    }
}

let infoSwitch = function(){
    var t = document.querySelector('.info')
    if(t.className != null && t.className.indexOf(' info-hide') > -1){
        t.className = t.className.replace(' info-hide', '');
    }else{
        t.className = t.className + ' info-hide'; 
    }
}

let downloadImage = {
    
}


setNextButton()
getWallpaper(data)