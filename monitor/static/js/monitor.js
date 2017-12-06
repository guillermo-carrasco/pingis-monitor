var evtSrc = new EventSource("/subscribe");

/*
Events coming from the Paticle cloud will look like this:

{
"name": "<Name of event>",
"data": "<Event data>",
"ttl": 60,
"published_at": "2017-12-06T15:53:37.203Z",
"coreid": "2e003b001047343438323536"
}

These are the events that we want to deal with:

TableStatus --> Free or Busy
RedCounter --> Int
WhiteCounter --> Int
*/

evtSrc.onmessage = function(e) {
  var phantomEvent = JSON.parse(e.data.replace(/'/g, '"'))
  switch (phantomEvent.name) {
    case "TableStatus":
      changeTaleStatus(phantomEvent.data);
      break;
    case "WhiteCounter":
      changeWhiteCounter(phantomEvent.data);
    case "RedCounter":
      changeRedCounter(phantomEvent.data);
    default:
      break
  }
};


function changeTaleStatus(status) {
  var tableStatusHeader = document.getElementById("tableStatus");
  tableStatusHeader.innerHTML = 'Pingpong table status: ' + status;
}

function changeWhiteCounter(score) {
  var whiteScore = document.getElementById("whiteScore");
  whiteScore.innerHTML = score;
}

function changeWhiteCounter(score) {
  var redScore = document.getElementById("redScore");
  redScore.innerHTML = score;
}
