const client = algoliasearch('I2VKMNNAXI', '2b8406f84cd4cc507da173032c46ee7b');
const index = client.initIndex('ForgetMeNot_Context');

const searchAndDisplay = function(searchText) {
  console.log(searchText);

  index.search(searchText.substring(100, 500), function(err, content) {
    if (err) {
      console.log(err);
    } else {
      // $('.abc').html(searchText)
      // $('.abc').html(JSON.stringify(content.hits))
      console.log(content.hits);
      $('.abc').html($('.abc').html() + content.hits.map(function(hit) {
        return '<div class="card">'
        +     hit.sentence
        +   '</div>'
      }).join(''));
    }
  });
}

const searchAll = function(searchText) {

}


$(function (){
  $('#readDom').click(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"}, searchAndDisplay);
    });
  });
});

window.onload = function() {
  console.log("onload" + Date())
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"}, searchAndDisplay);
  });
};
