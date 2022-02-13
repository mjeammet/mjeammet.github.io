const numColumns = 2;
const jsonPath = "./data.json";
let jsonData = loadJson(jsonPath);

let currentBookISBN = jsonData['current_book']['isbn'];
load_currentbook(currentBookISBN);

let projects = jsonData["projects"];
load_projects(projects);

/**
 * Load "database" json
 * @param {String} jsonPath
 * @return parsed json
 */
function loadJson(jsonPath) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
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
 * @param {String} isbn book isbn-13 (starting with '9 78')
 * @return None
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
    let current_row;
    let project_section = document.getElementById("projects_box");    

    for (let project_num = 0; project_num < projects_list.length; project_num++) {
        project = projects_list[project_num]

        if(project_num % numColumns == 0){
            current_row = 0
            current_row = document.createElement("div");
            current_row.className = "row";
        }

        new_project = buildProjectBox(project);
        current_row.appendChild(new_project);

        if(project_num % numColumns == 1 || project_num == projects_list.length-1){
            project_section.appendChild(current_row);
        }
    }
}


/**
 * Build a box to display project's information
 * @param {json} project dictionnary containing project's info
 * @return {dom element} project_box 
 */
function buildProjectBox(project){
    let project_box = document.createElement("div");
    project_box.className = "column";
    
    let img_box = document.createElement("div");
    img_box.className = "img_box";

    let preview = document.createElement("img");
    preview.src = `./assets/images/projects/${project.id}/preview.png`;
    preview.className = "project_img";
    preview.width = 500;
    preview.onclick = function() { open_images(project.id); };

    img_box.appendChild(preview);
    project_box.appendChild(img_box);

    
    let title = document.createElement("h3");
    title.innerHTML = `<a href='${project.link}'>${project.title}</a>`;
    project_box.appendChild(title);

    let description = document.createElement("p");
    description.className = "description";
    description.innerHTML = project.description;
    project_box.appendChild(description);

    let tag_box = document.createElement("ul");
    tag_box.style = "display: inline-flex;";
    for (tag in project.tags){
        let tag_text = project.tags[tag];
        // Using directly tag of projects.tags changed the size of the image. Yes, that's weird
        let tagElement = document.createElement("li");
        tagElement.innerText = `#${tag_text}`;
        tagElement.className = "tags";
        tag_box.appendChild(tagElement);
    }
    project_box.appendChild(tag_box);

    return project_box;
}

/**
 * 
 * @param {String} project_id 
 */
function open_images(project_id){
    let modal = document.getElementById("modal_overlay");

    let modal_content = document.createElement("div");
    modal_content.className = "modal-content";
    
    let enlarged_img = document.createElement("img");
    enlarged_img.src = `./assets/images/projects/${project_id}/big_display.png`;
    enlarged_img.style = "width: 100%;"
    modal_content.appendChild(enlarged_img);

    // Add a button to close the modal
    let span = document.createElement('span');
    span.className = 'close';
    span.innerHTML = '&times;';
    span.onclick = function() { close_modal(); }
    modal_content.appendChild(span);
    
    modal.appendChild(modal_content);
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            close_modal();
        }
    } 

    modal.style.display = "block";
    
    // TODO find a way to prevent scrolling when the modal is open :thinking:
    // /* Detect the button class name */
    // let overlayOpen = modal.style.display === 'block';
    // modal.setAttribute('aria-hidden', !overlayOpen);
    
    // let body = document.getElementsByClassName("body");
    // body.classList.toggle('noscroll', overlayOpen);
}

function close_modal(){
    modal = document.getElementById("modal_overlay");
    modal.style.display = "none";
    modal.innerHTML = "";
}