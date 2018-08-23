/*jslint browser: true, regexp: true, sloppy: true, continue: true */

// Shim for IE8
document.createElement('article');
document.createElement('section');

function countHash(txt, symb) {
    var len = txt.length, trim = 6;
    if (!txt) {
        return -1;
    }
    if (len < trim) {
        trim = len;
    }
    txt = txt.slice(0, trim);
    return (txt.match(new RegExp(symb, "g")) || []).length;
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function replaceImg(mdImg) {
    var linkText, linkHref = '';
    linkText = mdImg.slice(2, mdImg.indexOf(']('));
    linkHref = mdImg.slice(mdImg.indexOf('](') + 2, -1);
    return '<img src="' + linkHref + '" alt="' + linkText + '">';
}

function replaceLink(mdLink) {
    var linkText, linkHref = '';
    linkText = mdLink.slice(1, mdLink.indexOf(']('));
    linkHref = mdLink.slice(mdLink.indexOf('](') + 2, -1);

    /*
    For BL import only
    */
    if (linkHref.slice(0, 4) !== 'http') {
        linkHref = '#' + linkHref;
    }

    return '<a href="' + linkHref + '">' + linkText + '</a>';
}

function replaceBold(boldMatch) {
    return '<strong>' + boldMatch.slice(2, -2) + '</strong>';
}

function replaceItalic(italicMatch) {
    return '<em>' + italicMatch.slice(1, -1) + '</em>';
}

function replaceCode(codeMatch) {
    if (codeMatch.slice(0, 2) === '``') {
        return '<code>' + htmlEscape(codeMatch.slice(2, -2)) + '</code>';
    }
    return '<code>' + htmlEscape(codeMatch.slice(1, -1)) + '</code>';
}

function replaceInline(txt, reReplace, replacer) {
    var aMatch = txt.match(reReplace), ii, len;
    if (aMatch) {
        len = aMatch.length;
        for (ii = 0; ii < len; ii = ii + 1) {
            txt = txt.replace(aMatch[ii], replacer(aMatch[ii]));
        }
    }
    return txt;
}

function blockArray(mdText) {
    var aMd;
    mdText = mdText.replace(/\r\n/g, "\n"); // DOS to Unix
    mdText = mdText.replace(/\r/g, "\n"); // Mac to Unix

    mdText = mdText.replace(/[ ]{2}\n/gi, "<br>"); // replace "  \n" with "<br>"
    mdText = mdText.replace(/<!--[\s\S]*?-->/g, ""); // remove HTML comments

    aMd = mdText.split("\n");
    aMd.push('');
    return aMd;
}

function convertFromMd(md, wrapper) {
    var aMd = blockArray(md),
        htmlTmp = '',
        htmlNext = '',
        countTmp = 0,
        openTag = '',
        htmlTag = false,
        blockquote = [0, 0],
        htmlMd = [],
        ii,
        len;

    len = aMd.length;

    for (ii = 0; ii < len - 3; ii = ii + 1) {
        htmlTmp = aMd[ii];
        htmlNext = aMd[ii + 1];

        // block HTML
        if (htmlTmp.slice(0, 1) === '<') {
            htmlTag = true;
        }
        if (htmlTag && htmlTmp.slice(0, 2) === '</') {
            htmlTag = false;
            htmlMd.push(htmlTmp);
            continue;
        }
        if (htmlTag) {
            htmlMd.push(htmlTmp);
            continue;
        }

        // blockquote
        if (htmlTmp.slice(0, 1) === '>') {
            blockquote[1] = countHash(htmlTmp + ' ', '> ');
            htmlTmp = htmlTmp.slice(blockquote[1] * 2);
        } else {
            if (blockquote[0] > 0) {
                blockquote[1] = 0;
            }
        }

        if (htmlTmp === '' || htmlTmp.slice(0, 1) === '=' || htmlTmp.slice(0, 1) === '-') {
            // close open tags
            if (openTag === 'pre') {
                htmlTmp = '</code></pre>';
                openTag = '';
                htmlMd.push(htmlTmp);
            }
            if (openTag === 'ul') {
                htmlTmp = '</ul>';
                openTag = '';
                htmlMd.push(htmlTmp);
            }
            if (openTag === 'ol') {
                htmlTmp = '</ol>';
                openTag = '';
                htmlMd.push(htmlTmp);
            }
            continue;
        }

        // Block elements

        // h1
        if (htmlNext.slice(0, 1) === '=') {
            // For BL only
            if (htmlTmp === 'Behavioral Logic' || htmlTmp === 'Behavioral Logic Software Architecture') {
                htmlTmp = "\n" + '<h1 style="margin-top: 0.2em; ">' + htmlTmp + '</h1>';
            } else {
                htmlTmp = "\n<h2>" + htmlTmp + '</h2>';
            }
        }
        // h2
        if (htmlNext.slice(0, 1) === '-') {
            htmlTmp = "\n<h2>" + htmlTmp + '</h2>';
        }
        // ul
        if (htmlTmp.slice(0, 2) === '* ' || htmlTmp.slice(0, 2) === '+ ') {
            countTmp = htmlTmp.slice(1).search(/^\s/) + 1;
            if (openTag === 'ul') {
                htmlTmp = '<li>' + htmlTmp.slice(countTmp) + "</li>";
            } else {
                openTag = 'ul';
                htmlTmp = "\n<ul>\n<li>" + htmlTmp.slice(countTmp) + "</li>";
            }
        }

        // ol
        if (/^\d+\. /.test(htmlTmp)) {
            countTmp = htmlTmp.search(/[^0-9\.\s]/);
            if (openTag === 'ol') {
                htmlTmp = '<li>' + htmlTmp.slice(countTmp) + "</li>";
            } else {
                openTag = 'ol';
                htmlTmp = "\n<ol>\n<li>" + htmlTmp.slice(countTmp) + "</li>";
            }
        }

        // pre
        if (htmlTmp.slice(0, 4) === '    ' || htmlTmp.slice(0, 4) === "\t") {
            // pre
            if (openTag === '') {
                openTag = 'pre';
                htmlTmp = "\n<pre><code>" + htmlEscape(htmlTmp.slice(4));
            } else {
                htmlTmp = htmlTmp.slice(4);
            }
        } else {
            // h3 - h6
            if (htmlTmp.slice(0, 1) === '#') {
                countTmp = countHash(htmlTmp, '#');
                htmlTmp = "\n<h" + countTmp + '>' + htmlTmp.slice(countTmp) + '</h' + countTmp + '>';
            } else {
                // p
                if (htmlNext.slice(0, 1) === '' && !openTag) {
                    htmlTmp = "\n<p>" + htmlTmp + "</p>";
                }
            }
        }

        // Inline elements

        if (openTag === 'pre') {
            htmlMd.push(htmlTmp);
            continue;
        }

        // image
        htmlTmp = replaceInline(htmlTmp, /\!\[[^\]]+\]\([^\)]+\)/g, replaceImg);

        // links
        htmlTmp = replaceInline(htmlTmp, /\[[^\]]+\]\([^\)]+\)/g, replaceLink);

        // bold
        htmlTmp = replaceInline(htmlTmp, /\*\*[^\*]+\*\*/g, replaceBold);
        htmlTmp = replaceInline(htmlTmp, /\_\_[^\_]+\_\_/g, replaceBold);

        // italic
        htmlTmp = replaceInline(htmlTmp, /\*[^\*]+\*/g, replaceItalic);
        htmlTmp = replaceInline(htmlTmp, /\_[^\_]+\_/g, replaceItalic);

        // code
        htmlTmp = replaceInline(htmlTmp, /``.+``/g, replaceCode);
        htmlTmp = replaceInline(htmlTmp, /`[^`]+`/g, replaceCode);

        // blockquote wrap
        if (blockquote[1] !== blockquote[0]) {
            if (blockquote[1] > blockquote[0]) {
                htmlTmp = '<blockquote>' + htmlTmp;
            } else {
                htmlTmp = '</blockquote>' + htmlTmp;
            }
            blockquote[0] = blockquote[1];
        }

        htmlMd.push(htmlTmp);
    }

    if (wrapper) {
        return '<section id="' + wrapper + '">' + htmlMd.join("\n") + '</section>';
    }
    return htmlMd.join("\n");
}

function mdInclude(filePath, el) {
    var xhr = new XMLHttpRequest(),
        cacheBreaker = '?' + Math.floor(Math.random() * 65536);

    // get file with ajax
    xhr.open("GET", filePath + cacheBreaker, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 304) {
                el.innerHTML = convertFromMd(xhr.responseText, filePath);
            } else if (xhr.status === 404) {
                el.innerHTML = 'Not found: ' + xhr.responseURL;
            } else {
                el.innerHTML = 'Error status: ' + xhr.status;
            }
        }
    };
    xhr.send('');
}

window.onload = function () {
    //mdInclude('README.md', document.querySelector('div.mdImport'));
    var mdIncludes = document.querySelectorAll('div.mdImport'), ii, len;
    len = mdIncludes.length;
    for (ii = 0; ii < len; ii = ii + 1) {
        mdInclude(mdIncludes[ii].getAttribute('data-src'), mdIncludes[ii]);
    }
};
