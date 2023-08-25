var ctrl_press = false;
var m_x = 0;
var m_y = 0;
var word_cache = {};
window.onblur = function () {
    let showplace = document.getElementById("tipstool");
    if (showplace != null) {
        showplace.style.display = "none";

    }
}

document.addEventListener("keydown", function (event) {
    console.log(event.keyCode)
    if (event.keyCode === 18) {
        ctrl_press = true;
        let showplace = document.getElementById("tipstool");
        if (showplace != null) {
            showplace.style.display = "block";
        }
    }
});

document.addEventListener("keyup", function (event) {
    console.log(event.keyCode)
    if (event.keyCode === 18) {
        ctrl_press = false;
        let showplace = document.getElementById("tipstool");
        if (showplace != null) {
            showplace.style.display = "none";

        }
    }
});

document.addEventListener("mousemove", function (event) {
    m_x = event.clientX;
    m_y = event.clientY;
})
setInterval(function () {
    if (ctrl_press === false) {
        return;
    }
    let showplace = document.getElementById("tipstool");
    if (showplace == null) {
        var paragraph = document.createElement("p");

        paragraph.style.position = "fixed";
        paragraph.style.top = "5%";
        paragraph.style.left = "50%";
        paragraph.style.zIndex = "9999";
        paragraph.style.fontSize = "18px";
        paragraph.style.color = "white";
        paragraph.style.background = "black";
        paragraph.style.padding = "10px;"
        paragraph.style.borderRadius = "5px";
        paragraph.id = "tipstool";

        document.body.appendChild(paragraph);

        console.log(paragraph)
    }
    showplace = document.getElementById("tipstool");
    showplace.style.left = m_x + "px";
    showplace.style.top = m_y - 100 + "px";
    range = document.caretRangeFromPoint(m_x, m_y);
    if (range == null) {
        return

    }
    textNode = range.startContainer;
    offset = range.startOffset;
    var data = textNode.data,
        i = offset,
        begin,
        end;
    if (data === undefined)
        return;

    while (i > 0 && data[i] !== " ") {
        --i;
    }
    begin = i;

    //Find the end of the word
    i = offset;
    while (i < data.length && data[i] !== " ") {
        ++i;
    }
    end = i;
    let transContent = data.substring(begin, end);
    if (window.getSelection().toString().length > 0) {
        transContent = window.getSelection().toString();
    }

    showplace.innerHTML = transContent;
    if (transContent.length >= 13) {
        return;
    }
    if (transContent.length <= 1) {
        return;
    }
    // 如果transContent包含中文
    if (escape(transContent).indexOf("%u") >= 0) {
        return;
    }
    if (ctrl_press === false) {
        return;
    }

    if (transContent in word_cache) {
        showplace.innerHTML = word_cache[transContent];
        console.log("cache")
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://word.bybyte.cn/q?en=" + transContent, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            showplace.innerHTML = JSON.parse(xhr.responseText);
            word_cache[transContent] = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();

}, 100)
