gapi.load("client", loadClient);
  
function loadClient() {
    gapi.client.setApiKey("AIzaSyBxWfjZlEa70dKikAj-VtIpg0Rf1caj8tw");
    return gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(function() { 
                console.log("GAPI client loaded for API"); 
            },
            function(err) { 
                console.error("Произошла ошибка.", err); 
            });
}


const form = document.querySelector('.form');
const queryInput = document.getElementById('query-input');
const resultList = document.querySelector('.result-list');
const maxresult = 10;
const orderby = 'viewCount';
var pageToken = '';
  
form.addEventListener('submit', e => {
    e.preventDefault();
    execute();
});
  
// Make sure the client is loaded before calling this method.
function execute() {
    const searchString = queryInput.value;
  
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": orderby,
        "maxResults": maxresult,
        "q": searchString
    };
  
    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }
  
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        const listItems = response.result.items;
        if (listItems) {
            let output = '';
  
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                const channelName = item.snippet.channelTitle;
                const videoDate = new Date(item.snippet.publishedAt).toLocaleDateString("ru-RU");
                
                output += `
                    <div class="result-item">
                        <h2 class="result-item__title">${videoTitle}</h2>
                        <div class="result-item__content">
                            <p class="result-item__author">Автор: ${channelName} <span class="result-item__date">(Дата публикации: ${videoDate})</span></p>
                            <div class="result-item__video">
                                <iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}"></iframe>
                            </div>
                        </div>
                    </div>
                `;
            });
  
            // Output list
            resultList.innerHTML = output;
            document.getElementById('query').innerHTML = queryInput.value; // Выводим поисковый запрос под формой
            queryInput.value = ''; //Очищаем инпут с поисковым запросом
        }
    },
    function(err) { 
        console.error("Execute error", err); 
    });
}

/* jQuery*/
$(document).ready(function () {
    $('.result-list').on('click', '.result-item__title', function() {
        $(this).parent().toggleClass('result-item--active');
    });
});