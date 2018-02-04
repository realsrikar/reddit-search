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

let _this
class search {
  constructor() {

    _this = this

    this.params = {
      query: '',
      limit: 10,
      sort: 'confidence'
    }

    // elements
    this.els = {
      container: document.querySelector('.container'),
      form: document.querySelector('form'),
      input: document.querySelector('input[type="text"]'),
      close: document.querySelector('.close'),
      collapseIcon: '', // will be added when searched
      sortSelect: document.querySelector('select')
    }

    this.vals = {
      original: '',
      queryArray: []
    }

    // functions

    this.getFromLS() // LS = localStorage
    this.setCloseState()
    this.AEL() // add event listeners


  }

  decodeHtml(html) { //
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  setCloseState() {
    this.els.input.value == null ||
      this.els.input.value == undefined ||
      this.els.input.value == '' ? this.els.close.style.display = 'none' :
      this.els.close.style.display = 'block';
  }

  getFromLS() {
    if (!localStorage.getItem('query')) return;

    _this.els.input.value = JSON.parse(localStorage.getItem('query'))[0]
    _this.fetchData(JSON.parse(localStorage.getItem('query'))[0])

  }

  saveToStorage(query = '') {
    _this.vals.queryArray = [query]
    localStorage.setItem('query', JSON.stringify(_this.vals.queryArray))

    _this.fetchData((JSON.parse(localStorage.getItem('query'))[0]))
  }

  fetchData(requestQuery = '') {
    if (!requestQuery || requestQuery == '') return

    fetch(`https://www.reddit.com/search.json?limit=${this.params.limit}&q=${encodeURI(requestQuery)}&sort=${_this.params.sort}`)
      .then(res => {
        if (!res.ok) {
          console.error('Bad Request')
          return;
        }
        return res
      })
      .then(blob => {
        return blob
      })
      .then(blob => blob.json())
      .then(blob => blob.data.children)
      .then(blob => {
        let iter = 0
        blob.forEach(res => {
          iter++
          if (iter == 1) {
            _this.els.container.innerHTML = _this.textDefault(res)
          } else {
            _this.els.container.innerHTML += _this.textDefault(res)
          }
        })
        _this.collapse()
      })
      .catch(err => console.info(err));
  }

  textDefault(res) {
    return `
    <section class="post">
      <span class="score d-block">
      <img src="img/updoot.png" width="15" style="margin-right: .25em; transform: translate(2px, -1px);">
      ${res.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
      </span>
      
      <a target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com/u/${res.data.author}">u/${res.data.author}</a>:
      
      "${res.data.title}"
          <span class="info d-block my-2">
            <a href="https://reddit.com/${res.data.subreddit_name_prefixed}" target="_blank"  rel="nofollow noopener noreferrer">${res.data.subreddit_name_prefixed}</a>

            &mdash;

            <a target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com${res.data.permalink}">Comments</a>
          </span>


          <span class="text-warning gold ${res.data.gilded != 0 ? 'd-block' : 'd-none'}">
            ${res.data.gilded != 0 ? res.data.gilded : ''} &times;
          </span>

        ${_this.selfText(res)}
        ${_this.preview(res.data.preview, res.data.url, res.data)}

    </section>`
  }


  selfText(arg) {
    if (!arg.data.selftext_html) return ''

    return `
      <div class="self-text">
      <button class="collapse-icon btn btn-none"></button>
      <span class="text">${this.decodeHtml(arg.data.selftext_html)}</span>
      </div>`
  }

  AEL() {
    _this.els.form.addEventListener('submit', e => {
      _this.els.container.innerHTML = ''
      _this.getData(e)
    })
    _this.els.input.addEventListener('keyup', e => {
      _this.setCloseState()
      if ('ontouchstart' in window) return;
      _this.getData(e)
    })
    _this.els.close.addEventListener('click', _this.resetData)

    _this.els.sortSelect.addEventListener('change', _this.sortChange)
  }
  sortChange() {
    _this.params.sort = this.options[this.selectedIndex].value
    _this.fetchData(_this.els.input.value)
  }

  getData(e) {

    if ((e.keyCode > 36 && e.keyCode < 41) ||
      e.keyCode == 32 ||
      e.keyCode == 91 ||
      e.keyCode == 9 ||
      e.keyCode == 2 ||
      (e.keyCode > 15 && e.keyCode < 21)) return;
    if (_this.vals.original.length > 512) {
      container.innerHTML = '<h1>Query may not be longer than 512 characters</h1>';
      return;
    }

    e.preventDefault()
    document.querySelector('.container').innerHTML = ''
    _this.vals.original = _this.els.input.value

    _this.fetchData(_this.vals.original)
    _this.saveToStorage(_this.vals.original)

  }

  resetData(e) {
    _this.els.form.reset()
    _this.els.container.innerHTML = '';
    e.target.style.display = 'none';
    _this.saveToStorage()
  }


  collapse() {
    _this.els.collapseIcon = document.querySelectorAll('.collapse-icon')

    document.documentElement.addEventListener('click', e => {
      if (e.target.classList.contains('collapse-icon')) {
        e.target.parentElement.classList.toggle('open')

        if (e.target.classList.contains('gif-toggle')) {
          if (e.target.dataset.type == 'mp4') {
            e.target.nextElementSibling.innerHTML = `
          <video playsinline autoplay controls heigth="${e.target.dataset.ht}" width="${e.target.dataset.wt}">
          <source src="${e.target.dataset.url}" type="video/mp4">
          </video>
          `
          }
        } else if (e.target.dataset.type == 'gif') {
          e.target.nextElementSibling.innerHTML = `
        <img heigth="${e.target.dataset.ht}" width="${e.target.dataset.wt} src="${e.target.dataset.url}" type="image/gif">
        `
        }
      }

    })
    return;
  }

  preview(ar, link, res) {
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
    <a target="_blank" class="post-link" rel="nofollow noopener noreferrer" href="${link}">
      <img class="thumb-img" src="${url}" style="max-height: ${(ht / 9 * 16) + 'px'}" class="d-block mx-auto">
      <p class="img-domain">${res.domain}</p>
    </a>`
  }
}

new search