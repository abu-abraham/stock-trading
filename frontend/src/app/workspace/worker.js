onmessage = function(e) {
    const ids = getIds(e.data);
    const requests = ids.map(x => request("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + x + "&apikey=WUMS5TWMV6320E0L"));
    Promise.all(requests).then((results)=>{
        postMessage(results);
    });   
}

function getIds(rows) {
    let ids = [];
    rows.forEach((element)=>{
      ids.push(element.id);
    });
    return ids;
}

function request (url){
    return new Promise((resolve, reject)=>{
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               resolve(JSON.parse(this.responseText));
            }
        };
        xhttp.onerror = function () {
            reject();
        }
    });
}
