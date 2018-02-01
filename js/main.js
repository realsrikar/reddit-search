// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('./sw.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// } else {
// 	console.log('Service worker not supported!')
// }
// commented out due to console errors

const container = document.querySelector('.container'),
  form = document.querySelector('form'),
  input = form.querySelector('input')

let iter = 0;

function fetData(request) {
  fetch('https://www.reddit.com/search.json?q=' + request)
    .then(blob => blob.json())
    .then(blob => blob.data.children)
    .then(blob => {
      blob.forEach(res => {
        if (iter < 10) {
          iter++
          container.innerHTML += `
        <section class="post">
        <span class="score d-block">
        <img src="img/updoot.png" width="15" style="margin-right: .25em; transform: translate(2px, -1px);">
        ${res.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </span>

        <a target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com/u/${res.data.author}">u/${res.data.author}</a>:

        "${res.data.title}"
        <span class="info d-block my-2">
        <a href="https://reddit.com/${res.data.subreddit_name_prefixed}" target="_blank" rel="nofollow noopener noreferrer">${res.data.subreddit_name_prefixed}</a>
        &mdash; <a target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com${res.data.permalink}">Comments</a>
        </span>


        <span class="text-warning gold ${res.data.gilded != 0 ? 'd-block' : 'd-none'}">
        ${res.data.gilded != 0 ? res.data.gilded : ''} &times;
        </span>

        ${selfText(res)}
        ${preview(res.data.preview, res.data.url)}

        </section>`


        }
      })
      collapse()
      document.body.classList.remove('hide')
    })
    .catch(err => console.info(err));
}


if (localStorage.getItem('query')) {
  fetData(JSON.parse(localStorage.getItem('query'))[0])
  input.value = JSON.parse(localStorage.getItem('query'))[0]
}
form.addEventListener('submit', getData)
input.addEventListener('keyup', getData)

function getData(e) {
  e.preventDefault()
  container.innerHTML = ''
  iter = 0
  document.body.classList.add('hide')
  let InputVal = input.value.replace(/ /gi, '+').replace(/‘/gi, '&lsquo;').replace(/’/gi, '&rsquo;').replace(/“/gi, '&ldquo;').replace(/”/gi, '&rdquo;'),
    OriginalInputVal = input.value
  fetData(InputVal)
  saveToStorage(OriginalInputVal)
}

function preview(ar, link) {
  if (!ar) return '';
  if (ar.images[0].variants.mp4) {
    let image = ar.images[0].variants.mp4.source 
    const ht = image.height
    const wt = image.width
    const url = image.url

    return `
    <div class="self-text">
    <button class="collapse-icon btn btn-none gif-toggle" data-ht="${ht}" data-wt="${wt}" data-url="${url}" data-type="mp4"></button>
	  <span class="text"></span>
  </div>
    `
  } else if (ar.images[0].variants.gif) {
    let image = ar.images[0].variants.gif.source 
    const ht = image.height
    const wt = image.width
    const url = image.url

    return `
    <div class="self-text">
    <button class="collapse-icon btn btn-none gif-toggle" data-ht="${ht}" data-wt="${wt}" data-url="${url}" data-type="gif"></button>
	  <span class="text"></span>
  </div>
    `
  }



  let image = ar.images[0].source

  const ht = image.height
  const wt = image.width + 'px'
  const url = image.url

  return `
  <a target="_blank" rel="nofollow noopener noreferrer" href="${link}">
    <img class="thumb-img" src="${url}" style="max-height: ${(ht / 9 * 16) + 'px'}" class="d-block mx-auto">
  </a>`
}

function saveToStorage(query) {
  queryArray = [query]
  localStorage.setItem('query', JSON.stringify(queryArray))
  fetData(JSON.parse(localStorage.getItem('query'))[0].replace(/ /gi, '+').replace(/‘/gi, '&lsquo;').replace(/’/gi, '&rsquo;').replace(/“/gi, '&ldquo;').replace(/”/gi, '&rdquo;'))
}


input.addEventListener('click', e => e.target.select())


function decodeHtml(html) { //
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


function selfText(arg) {
  if (!arg.data.selftext_html) return ''

  return `
  <div class="self-text">
	  <button class="collapse-icon btn btn-none"></button>
	  <span class="text">${decodeHtml(arg.data.selftext_html)}</span>
  </div>`
}



function collapse() {
  const collapseIcon = document.querySelectorAll('.collapse-icon')

  collapseIcon.forEach(el => el.addEventListener('click', e => {
      e.target.parentElement.classList.toggle('open')

      if (e.target.classList.contains('gif-toggle')) {
       if (e.target.dataset.type == 'mp4') {
         e.target.nextElementSibling.innerHTML = `
          <video playsinline autoplay controls heigth="${e.target.dataset.ht}" width="${e.target.dataset.wt}">
            <source src="${e.target.dataset.url}" type="video/mp4">
          </video>
         `
       }
      } else {
        e.target.nextElementSibling.innerHTML = `
          <img heigth="${e.target.dataset.ht}" width="${e.target.dataset.wt} src="${e.target.dataset.url}" type="image/gif">
         `
      }
  }))
}