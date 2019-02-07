const apiKey = "z9M_PqVRJdemQ5Ctd3zAPE4BD9AZ4XBf";
const baseUrl = "https://api.mlab.com/api/1/databases/andrey_todo/collections/todos";
let currLogin;
let currPassword;
let url;

function getLogin() {
    return currLogin;
}

function loadTasks(login, password, callback) {
    let q = {user : login, password : password};
    currLogin = login;
    currPassword = password;
    let query = JSON.stringify(q);
    let fields = '{_id:0,todos:1}';
    url = baseUrl+"?apiKey="+apiKey+"&q="+query+"&f="+fields;
    $.ajax({url: url}).then(function (res) {
        if(res.length === 0){
            callback(false, "Wrong email or password! Please, try again!");
        }else {
            callback(true, res[0].todos);
        }
    }, function (err) {
        console.log(err);
    });
}

function regTasks(login, password, callback) {
    let q = {user : login};
    query = JSON.stringify(q);
    url = baseUrl+"?apiKey="+apiKey+"&q="+query;
    $.ajax({url: url}).then(function (res) {
        if(res.length !== 0){
            callback(false, "User already exist!");
        }else {
            let q = {user : login, password : password, todos : []};
            query = JSON.stringify(q);
            url = baseUrl+"?apiKey="+apiKey;
            $.ajax({url: url, data: query, type: "POST", contentType: "application/json"}).then(function (res) {
                currLogin = login;
                currPassword = password;
                callback(true, []);
            }, function (err) {
                callback(false, err);
            });
        }
    }, function (err) {
        callback(false, err);
    });
}

function saveTasks(arr) {
    let q = {user : currLogin, password : currPassword};
    let query = JSON.stringify(q);
    let data = JSON.stringify({ "$set" : { "todos" : arr } } );
    url = baseUrl+"?apiKey="+apiKey+"&q="+query;
    $.ajax({url: url, data : data, type : "PUT", contentType : "application/json"}).then(function (res) {
    }, function (err) {
        console.log(err);
    });
}

function logoutTasks() {
    currLogin = "";
    currPassword = "";
}