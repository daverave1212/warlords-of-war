


// Network and Location

function submitForm(_url, _data, type, callback){
    if(type == null){
        type = 'get'
    }
    $.ajax({
        type : type,
        url : _url + '?' + objectToURLParameters(_data),
        data : {},
        success : function(response){
            callback(response);
        }
    });
}

function doPost(url, data, callback){
    submitForm(url, data, 'post', callback)
}

function doGet(url, data, callback){
    submitForm(url, data, 'get', callback)
}

function getURLParametersAsObject() {
    function paramsToObject(entries) {
      const result = {}
      for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
      }
      return result;
    }
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return paramsToObject(urlParams)
}
function objectToURLParameters(obj) {
    if(obj == null) return ''
    url = Object.keys(obj).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
    }).join('&')
    return url
}













// Other utilities

function imgToBase64(img, isRegexModifiying) {    // Not sure what the second param is
    const canvas = document.createElement('canvas')
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png; base64");
    if (isRegexModifiying == false)
        return dataURL
    else 
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function playSound(path){
    new Audio(path).play();
}












// Object and Array utilities

function getRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}
function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
}
function randomizeArray(array_a){
    var iRandomize;
    for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
        var randomizeArrayIndex = randomInt(0, array_a.length - 1);
        var auxRandomize = array_a[iRandomize];
        array_a[iRandomize] = array_a[randomizeArrayIndex];
        array_a[randomizeArrayIndex] = auxRandomize;
    }
}












// Math
function roundUp(nr, by){
    return (nr - nr%by + by);
}
function roundUp25(nr){
    return (nr - nr%25 + 25);
}
function roundUp50(nr){
    return (nr - nr%50 + 50);
}
function roundDown25(nr){
    return (nr - nr%25);
}
function roundDown50(nr){
    return (nr - nr%50);
}
function round50(nr){
    var roundness = nr%50;
    var complement  = 50 - roundness;
    if(roundness <= complement){
        return nr - roundness;}
    else return nr + complement;
}
function distanceBetween(t1, t2) {
    return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y))
}
function angleBetween(t1, t2) {
    return Math.atan2(t2.y - t1.y, t2.x - t1.x) * 180 / Math.PI
}
function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}









// Strings
function quotify(str){
    return "\"" + str + "\"";
}
function isUpperCase(str){
    if(str == str.toUpperCase()){
        return true;
    }
    return false;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function isString(obj) {
    return typeof obj === 'string' || obj instanceof String
}












// DOM
function removeAllChildren(node){
    while (node.firstChild) {
        console.log("Removing " + node.firstChild);
        node.removeChild(node.firstChild);}
}
const dom = function (str, clickListeners={}) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    const firstDiv = doc.body.firstChild;
    for (const listenerName of Object.keys(clickListeners)) {
        console.log(`Checking listener name: ${listenerName}`)
        console.log(firstDiv.querySelectorAll(listenerName))
        for (const elem of Array.from(firstDiv.querySelectorAll(listenerName))) {
            elem.addEventListener('click', () => {
                clickListeners[listenerName](firstDiv)
            })
        }
    }
	return firstDiv
}



let ctxSettings = {
    'default': {}
}
function saveCtxSettings(ctx, key) {
    let ctxSettingsObject
    if (key == null) {
        ctxSettingsObject = ctxSettings['default']
    } else {
        if (ctxSettings[key] == null) {
            ctxSettings[key] = {}
        }
        ctxSettingsObject = ctxSettings[key]
    }
    ctxSettingsObject.textAlign = ctx.textAlign
    ctxSettingsObject.font = ctx.font
    ctxSettingsObject.fillStyle = ctx.fillStyle
    ctxSettingsObject.globalAlpha = ctx.globalAlpha
    console.log(`Saved ctxSettings with key "${key}" as:`)
    console.log({ctxSettingsObject})
}
function loadCtxSettings(ctx, key) {
    const ctxSettingsObject = key == null? ctxSettings['default'] : ctxSettings[key]
    for (const key of Object.keys(ctxSettingsObject)) {
        ctx[key] = ctxSettingsObject[key]
    }
}

function drawImageOnCanvasAsync(canvas, pathOrImage, x, y, width, height, alpha) {
    const ctx = canvas.getContext('2d')
    let image
    if (typeof pathOrImage === 'string' || pathOrImage instanceof String) {
        image = new Image()
        image.src = pathOrImage
    } else {
        image = pathOrImage
    }
    return new Promise((res, rej) => {
        image.onload = function() {
            saveCtxSettings(ctx)
            if (alpha != null) {
                ctx.globalAlpha = alpha
            }
            if (width != null && height == null) {
                ctx.drawImage(image, x, y, width)
            } else if (width != null && height != null) {
                ctx.drawImage(image, x, y, width, height)
            } else {
                ctx.drawImage(image, x, y)
            }
            loadCtxSettings(ctx)
            res()
        }
    })
}
function fillCanvasColor(canvas, color) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    loadCtxSettings(ctx)
}
function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.reset()
}
function clearRect(canvas, x, y, width, height) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(x, y, width, height)
}
function drawText({canvas, font, x, y, text, textAlign='center', color}) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx)
    if (color != null) {
        ctx.fillStyle = color
    }
    ctx.textAlign = textAlign
    ctx.font = font
    ctx.fillText(text, x, y)
    loadCtxSettings(ctx)
}

function drawTextLines({canvas, font, x, y, width, text, lineHeight, textAlign='center', color, isCenteredY=true}) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx, 'drawTextLines')
    ctx.font = font
    const lines = getLines(ctx, text, width)
    console.log(`Got lines as`)
    console.log({lines})
    const totalHeight = lines.length * lineHeight
    const startY = isCenteredY ? y - totalHeight / 2 : y
    for (let i = 0; i < lines.length; i++) {
        const textLine = lines[i]
        const thisY = startY + i * lineHeight
        drawText({canvas, font, x, y: thisY, text: textLine, textAlign, color})
    }
    loadCtxSettings(ctx, 'drawTextLines')
    return lines
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function getOnlyKey(obj) {
    return Object.keys(obj)[0]
}
function getTextWidth(font, text) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = font
    const width = ctx.measureText(text).width
    return width
    
}