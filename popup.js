const client = algoliasearch('I2VKMNNAXI', '2b8406f84cd4cc507da173032c46ee7b');
const index = client.initIndex('ForgetMeNot_Context');

// const searchAndDisplay = function(searchText, hitsPerPage) {
//   console.log(searchText);
//
//   index.search(searchText.substring(400), {
//     hitsPerPage: hitsPerPage
//   }, function(err, content) {
//     if (err) {
//       console.log(err);
//     } else {
//       // $('.abc').html(searchText)
//       // $('.abc').html(JSON.stringify(content.hits))
//       console.log(content.hits);
//       $('.abc').html($('.abc').html() + content.hits.map(function(hit) {
//         return '<div class="card">'
//         +     hit.sentence
//         +   '</div>'
//       }).join(''));
//     }
//   });
// }

const searchCards = function(searchText, hitsPerPage) {
  const d = Q.defer()
  console.log(searchText);
  index.search(searchText.substring(400), {
    hitsPerPage: hitsPerPage
  }, function(err, content) {
    if (err) {
      console.log(err);
      d.reject()
    } else {
      d.resolve(content.hits)
    }
  });
  return d.promise
}

const searchAll = function(searchText) {
  console.log(searchText);
  const maxLength = 400;
  const searchTextArray = [];
  const hitsPerPage = Math.max(Math.ceil(10 / (searchText.length / maxLength)), 3)
  console.log('hitsPerPage');
  console.log(hitsPerPage);
  for (var i = 0; i < searchText.length; i += maxLength) {
    searchTextArray.push(searchText.substring(i, i+maxLength))
  }
  console.log(searchTextArray);
  const promises = searchTextArray.map(function(t, j) {
    console.log(j);
    return searchCards(t, hitsPerPage);
  });
  Q.allSettled(promises)
  .then(function(results) {
    console.log('results');
    console.log(results);
    var results2 = [].concat.apply([], results.map(function(r) {return r.value}));
    console.log('results2');
    console.log(results2);
    var results3 = removeDuplicates(results2, 'objectID')
    console.log('results3');
    console.log(results3);
    $('.abc').html($('.abc').html() + results3.map(function(hit) {
      return '<div class="card">'
      +     hit.sentence
      +   '</div>'
    }).join(''));
		d.resolve(results)
	});
}

function removeDuplicates(originalArray, objKey) {
  var trimmedArray = [];
  var values = [];
  var value;

  for(var i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey];

    if(values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }

  return trimmedArray;
}


$(function (){
  $('#readDom').click(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"}, searchAll);
    });
  });
});

window.onload = function() {
  console.log("onload" + Date())
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "readDom"}, searchAll);
  });
};
