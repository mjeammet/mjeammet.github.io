const numColumns = 2;
const jsonPath = "./data.json";
let jsonData = loadJson(jsonPath);

let projects = jsonData["projects"];
load_projects(projects);

load_current_hobbies(jsonData['hobbies']);

load_skills_icons(jsonData['skills']);

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
 * Load projects from data file
 * @param {list} projects_list 
 * @return None
 */
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
    project_box.className = "project-box";
    
    let img_box = document.createElement("div");
    img_box.className = "img_box";

    let preview = document.createElement("img");
    preview.src = `./assets/images/projects/${project.id}/preview.webp`;
    preview.className = "project_img";
    preview.width = 500;
    preview.onclick = function() { open_images(project.id); };

    img_box.appendChild(preview);
    project_box.appendChild(img_box);

    let title = document.createElement("h3");
    title.className = "title";
    title.innerText = project.title;
    project_box.appendChild(title);

    let tags_box = document.createElement("ul");
    tags_box.className = "tags-box";
    for (tag in project.tags){
        let tag_text = project.tags[tag];
        // Using directly tag of projects.tags changed the size of the image. Yes, that's weird
        let tagElement = document.createElement("li");
        tagElement.innerText = `#${tag_text}`;
        tagElement.className = "tags";
        tags_box.appendChild(tagElement);
    }
    project_box.appendChild(tags_box);

    let description = document.createElement("p");
    description.className = "description";
    description.innerHTML = project.description;
    project_box.appendChild(description);

    let stack_box = document.createElement("div");
    stack_box.className = 'stackbox';
    for (techno in project.stack) {
        let techno_name = project.stack[techno];
        // alert(techno_name);
        stack_box.append(get_proper_icon(techno_name));
    }
    project_box.appendChild(stack_box);

    // Add a hyphen between stack and tags (if both are non null)
    if (stack_box.innerHTML && (! isEmpty(project.links))){
        stack_box.innerHTML += ` - `
    }

    if ('github' in project.links){
        repo = project.links.github;
        stack_box.innerHTML += `<a href=${repo} target="_blank"><i class="fa-brands fa-github"></i></a>`;
    }
    if ('site' in project.links){
        url = project.links.site;
        stack_box.innerHTML += `<a href=${url} target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`; // or fa-right-from-bracket
    }       
    project_box.appendChild(stack_box);

    return project_box;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

/**
 * Open modal to show 
 * @param {String} project_id 
 */
function open_images(project_id){
    let modal = document.getElementById("modal_overlay");

    let modal_content = document.createElement("div");
    modal_content.className = "modal-content";
    
    let enlarged_img = document.createElement("img");
    enlarged_img.src = `./assets/images/projects/${project_id}/big_display.webp`;
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

/**
 * Loads current hobbies from json file and openlibrary.org
 * @param {dictionary} hobbies 
 */
async function load_current_hobbies(hobbies){
    if (Object.keys(hobbies).length == 0){
        make_hobby_block(
            icon_class="fa-regular fa-face-sad-tear",
            title="All work and no play makes Marie a dull gurl",
            cover_url="https://i.pinimg.com/736x/f1/2f/7f/f12f7f38acd514ef826b655fc6f52713.jpg")
    }

    // Fetch current book(s) from my openlibrary's reading log
    reading_list = await fetch_current_book();
    // TODO if empty
    for (item of reading_list){
        book = item['work'];
        console.log(book);
        add_current_book(book);
    }   
    
    if ('rpg' in hobbies){
        current_rpg = hobbies['rpg'];
        make_hobby_block(
            icon_class="fa-solid fa-dice",
            title=current_rpg['title'],
            cover_url=current_rpg['cover'],
            link=current_rpg['link'])

    }
}

/**
 * Generic function to add a new div element to #hobbies div.
 * @param {String} icon_class font awesome class to display logo
 * @param {String} title 
 * @param {String} cover_url 
 * @param {String} link_url 
 */
function make_hobby_block(icon_class, title, cover_url="", link_url=""){
    hobbies_div = document.getElementById("hobbies");

    let block = document.createElement("div");
    block.innerHTML = `<h1><i class="${icon_class}"></i></h1>`;

    let link = document.createElement("a");
    link.href = link_url;
    link.target = "_blank";

    let cover = document.createElement("img");
    cover.src = cover_url;
    cover.className = 'hobby_image';
    link.append(cover);

    let text = document.createElement("p");
    text.innerText = title;
    link.append(text);

    block.append(link);
    hobbies_div.append(block);
}


async function fetch_current_book(){
    let profile_url = `https://openlibrary.org/people/maruey/books/currently-reading.json`;
    let response = await fetch(profile_url);
    if (response.ok){
        // cool
    }else{
        console.log("Current book not retrieved!");
        return None;
    }
    let data_json = await response.json();
    return data_json['reading_log_entries'];
}


function add_current_book(book){
    hobbies_div = document.getElementById("hobbies");

    let block = document.createElement("div");
    block.innerHTML = `<h1><i class="fa-solid fa-book"></i></h1>`;

    let link = document.createElement("a");
    let cover = document.createElement("img");
    link.href = `https://openlibrary.org/${book['key']}`;
    link.target = "_blank";
        
    cover.src = `https://covers.openlibrary.org/b/olid/${book['cover_edition_key']}-M.jpg`
    cover.className = 'hobby_image';
    link.append(cover);

    infos = `${book['title']} (${book['first_publish_year']})<br>by ${book['author_names'][0]}`;

    let text = document.createElement("p");
    text.innerHTML = infos;
    link.append(text);

    block.append(link);
    hobbies_div.append(block);
}


/**
 * OBSOLETE
 * Load current book infos from openlibrary.org 
 * and modify index.html to display it in the dedicate section
 * !! Currently not using generic function because of asynchronicity issues
 * @param {String} isbn Unique 13-digits code, starting with '9 78'
 * @return None
 */
 async function add_current_book_from_isbn(isbn){
    let bookapi_url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
    let api_response = await fetch(bookapi_url);
    let data_json = await api_response.json();

    hobbies_div = document.getElementById("hobbies");

    let block = document.createElement("div");
    block.innerHTML = `<h1><i class="fa-solid fa-book"></i></h1>`;

    let link = document.createElement("a");
    let cover = document.createElement("img");
    if (`ISBN:${isbn}` in data_json){
        let isbn_object = data_json[`ISBN:${isbn}`]

        link.href = isbn_object.url;
        link.target = "_blank";
        
        cover.src = isbn_object.cover.medium;
        cover.className = 'hobby_image';
        link.append(cover);

        infos = `${isbn_object.title}<br>by ${isbn_object.authors[0].name}`;
    } else {
        infos = `... something very interesting, I'm sure!<br>Unfortunately, couldn't find book with ISBN ${isbn}<br>using <a href=https://openlibrary.org/dev/docs/api/books> openlibrary's book API</a>.`;
    }

    let text = document.createElement("p");
    text.innerHTML = infos;
    link.append(text);

    block.append(link);
    hobbies_div.append(block);
}

/**
 * Loads skills icons
 */
function load_skills_icons(skills){
    let skill_box = document.getElementById("skills_box");
    for (skill of skills['op']) {
        skill_box.append(get_proper_icon(skill));
    }

    if (skills['learning'] != []) {
        skill_box.innerHTML += "<p>and currently learning / getting deeper with ... </p>";
        for (skill of skills['learning']) {
            skill_box.append(get_proper_icon(skill));
        }
    }
    
}

function get_proper_icon(techno){
    let icon = document.createElement('img');

    let suffix = "original"
    if (["ubuntu", "django"].includes(techno) ){
        suffix = "plain";
    }

    if (techno == "django rest framework") {
        icon.src = "https://www.django-rest-framework.org/img/favicon.ico"
        return icon
    }

    icon.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${techno}/${techno}-${suffix}.svg`;
    return icon;
}
