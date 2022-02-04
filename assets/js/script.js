var jsonPath = "./projects.json";
jsonData = loadJson(jsonPath);

currentBookISBN = jsonData['current_book']['isbn'];
load_currentbook(currentBookISBN);

projects = jsonData["projects"];
load_projects(projects);


function loadJson(jsonPath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", jsonPath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return JSON.parse(result);
}

/* 
Load current book infos from openlibrary.org 
and modify index.html to display it in the dedicate section
*/
async function load_currentbook(isbn){
    let bookapi_url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
    let api_response = await fetch(bookapi_url);
    let data_json = await api_response.json();
    let isbn_object = data_json[`ISBN:${isbn}`]
    // console.log(isbn_object);

    let cover = document.getElementById('currentbook_cover');
    cover.href = isbn_object.url
    let cover_img = cover.childNodes[0];
    cover_url = isbn_object.cover.medium;
    cover_img.src = cover_url

    let basic_infos = document.getElementById('currentbook_basicinfo');
    basic_infos.innerHTML = `${isbn_object.title}<br>by ${isbn_object.authors[0].name}`;
}

function load_projects(projects_list){

    for (project of projects_list){
        console.log(project);
    } 
} 