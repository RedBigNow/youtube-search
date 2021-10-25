"use strict";

const API_KEY = 'AIzaSyBxWfjZlEa70dKikAj-VtIpg0Rf1caj8tw';
const API_URL = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
gapi.load("client", loadClient);

function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load(API_URL);
}

const form = document.querySelector('.form');
const queryInput = document.getElementById('query-input');
const resultList = document.querySelector('.result-list');
let pageToken = '';
form.addEventListener('submit', e => {
  e.preventDefault();
  showVideos();
});

function showVideos() {
  const searchString = queryInput.value;
  const arr_search = {
    'part': 'snippet',
    'type': 'video',
    'order': 'viewCount',
    'maxResults': 10,
    'q': searchString
  };

  if (pageToken != '') {
    arr_search.pageToken = pageToken;
  }

  return gapi.client.youtube.search.list(arr_search).then(function (response) {
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
                <p class="result-item__author">Автор: ${channelName} <span class="result-item__date">(${videoDate})</span></p>
                <div class="result-item__video">
                  <iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}"></iframe>
                </div>
              </div>
            </div>
          `;
      });
      resultList.innerHTML = output;
      document.querySelector('.result-text').classList.add('result-text--active');
      document.getElementById('query').innerHTML = queryInput.value;
      queryInput.value = '';
    }

    const items = document.querySelectorAll(".result-item__title");
    accordionList(items);
  }, function (err) {
    console.error("error", err);
  });
}

function accordionList(items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.addEventListener("click", function (e) {
      if (e.target.parentNode.classList.contains('result-item--active')) {
        this.parentNode.classList.remove('result-item--active');
      } else {
        e.target.parentNode.classList.add('result-item--active');
      }
    });
  }
}