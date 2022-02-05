var jsonPath = "./data.json";
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

/**
 * Load current book infos from openlibrary.org 
 * and modify index.html to display it in the dedicate section
 * @param isbn book isbn-13 (starting with '9 78')
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
        new_project = buildProjectBox(project);
        document.getElementById("projects_box").appendChild(new_project);
    } 
} 

function buildProjectBox(project){
    let box = document.createElement("div");
    
    let preview = document.createElement("img");
    preview.src = `./assets/images/projects/${project.id}/preview.png`;
    preview.className = "project_img";
    preview.width = 500;
    box.appendChild(preview);

    let title = document.createElement("h3");
    title.innerHTML = `<a href='${project.link}'>${project.title}</a>`;
    box.appendChild(title);

    let description = document.createElement("p");
    description.style = "font-size: 16px; width: 80%; margin: auto;";
    description.innerHTML = project.description;
    box.appendChild(description);

    let tag_box = document.createElement("ul");
    tag_box.style = "display: inline-flex;";
    for (tag in project.tags){
        let tag_text = project.tags[tag];
        // Using directly tag of projects.tags changed the size of the image. Yes, that's weird
        let tagElement = document.createElement("li");
        tagElement.innerText = `#${tag_text}`;
        tagElement.style = "margin-right: 30px; list-style-type:none; font-size: 16px;";
        tag_box.appendChild(tagElement);
    }
    box.appendChild(tag_box);

    return box;
}