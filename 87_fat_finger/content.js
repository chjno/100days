var cursor = chrome.extension.getURL('images/cursor.png');
var hand = chrome.extension.getURL('images/hand.png');

var style = $('<style> body, div {cursor: url(' + cursor + '), auto !important; } a {cursor: url(' + hand + ') 35 1, auto !important; } </style>');

$('head').append(style);