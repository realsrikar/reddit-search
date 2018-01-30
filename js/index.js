const container = document.querySelector('.container'),
  form = document.querySelector('form'),
  input = form.querySelector('input')


function fetData(request) {
  fetch('https://www.reddit.com/search.json?q=' + request)
    .then(blob => blob.json())
    .then(blob => blob.data.children)
    .then(blob => {
      blob.forEach(res => {
        container.innerHTML += `
        <p>
        <span class="score d-block">
        <img src="https://img.4plebs.org/boards/s4s/image/1385/00/1385006781269.png" width="15" style="margin-right: .25em; transform: translate(2px, -1px);">
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

        ${preview(res.data.preview, res.data.url)}

        </p>`


      })
    })
    .catch(err => console.info(err));
}


if (localStorage.getItem('query')) {
  fetData(JSON.parse(localStorage.getItem('query'))[0])
  input.value = JSON.parse(localStorage.getItem('query'))[0]
}
form.addEventListener('submit', getData)

function getData(e) {
  e.preventDefault()
  let InputVal = input.value.replace(/ /gi, '+').replace(/‘/gi, '&lsquo;').replace(/’/gi, '&rsquo;').replace(/“/gi, '&ldquo;').replace(/”/gi, '&rdquo;'),
    OriginalInputVal = input.value
  container.innerHTML = ''
  fetData(InputVal)
  saveToStorage(OriginalInputVal)
}

function preview(ar, link) {
  if (!ar) return '';

  const image = ar.images[0].source

  const ht = image.height + 'px'
  const wt = '100%' || image.width + 'px'
  const url = image.url

  return `<a target="_blank" rel="nofollow noopener noreferrer" href="${link}">
  <img src="${url}" style="height: ${ht}; width: ${wt}; margin: 0.5em 0;object-fit: contain; max-height: 400px;" class="d-block mx-auto">
  </a>`
}

function saveToStorage(query) {
  queryArray = [query]
  localStorage.setItem('query', JSON.stringify(queryArray))
  fetData(JSON.parse(localStorage.getItem('query'))[0].replace(/ /gi, '+').replace(/‘/gi, '&lsquo;').replace(/’/gi, '&rsquo;').replace(/“/gi, '&ldquo;').replace(/”/gi, '&rdquo;'))
}


input.addEventListener('click', e => e.target.select())
