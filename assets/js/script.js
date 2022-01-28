const currentbook_ISBN = "9780099582151";
// Pardonnez cette infamie mais pas sans db, voilà commment ça se finit. json incoming ?
const bookapi_url = `https://openlibrary.org/api/books?bibkeys=ISBN:${currentbook_ISBN}&jscmd=data&format=json`;

load_currentbook();

async function load_currentbook(){
    let api_response = await fetch(bookapi_url);
    let data_json = await api_response.json();
    let isbn_object = data_json[`ISBN:${currentbook_ISBN}`]
    console.log(isbn_object);

    cover_url = isbn_object.cover.medium;

    let cover = document.getElementById('currentbook_cover');
    cover.href = isbn_object.url
    let cover_img = cover.childNodes[0];
    cover_img.src = cover_url

    let basic_infos = document.getElementById('currentbook_basicinfo');
    basic_infos.innerHTML = `${isbn_object.title}<br>by ${isbn_object.authors[0].name}`;
}
 