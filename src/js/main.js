if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
     .then((registration) => {
       console.log('thanks');
    }, e => console.log(e))
  });
}

class Search {
  constructor() {

    this.params = {
      query: '',
      limit: 10,
      sort: 'confidence',
    }

    // elements
    this.els = {
      container: document.querySelector('.container'),
      form: document.querySelector('form'),
      input: document.querySelector('input'),
      close: document.querySelector('.close'),
      collapseIcon: '', // will be added when searched
      sortSelect: document.querySelector('select'),
    }

    this.vals = {
      original: '',
      queryArray: [],
    }

    // functions

    this.getFromLS() // LS = localStorage
    this.setCloseState()
    this.AEL() // add event listeners
    this.collapse()
  }

  decodeHtml(html) { //
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  setCloseState() {
    if (this.els.input.value == null ||
      this.els.input.value == undefined ||
      this.els.input.value == '') {
      this.els.close.style.display = 'none'
    } else {
      this.els.close.style.display = 'block';
    }
  }

  getFromLS() {
    if (!localStorage.getItem('query')) return;

    const LSQuery = localStorage.getItem('query')

    this.els.input.value = JSON.parse(LSQuery)[0]

    this.fetchData(JSON.parse(LSQuery)[0])
  }

  saveToStorage(query = '') {
    this.vals.queryArray = [query]
    localStorage.setItem('query', JSON.stringify(this.vals.queryArray))

    this.fetchData((JSON.parse(localStorage.getItem('query'))[0]))
  }

  fetchData(requestQuery = '') {
    if (!requestQuery || requestQuery == '') return

    fetch(`https://www.reddit.com/search.json?limit=${this.params.limit}&q=${encodeURI(requestQuery)}&sort=${this.params.sort}`)
      .then(res => {
        if (!res.ok) {
          return;
        }
        return res
      })
      .then(blob => blob)
      .then(blob => blob.json())
      .then(blob => blob.data.children)
      .then(blob => {
        blob.forEach((res, iter) => {
          if (iter == 1) {
            this.els.container.innerHTML = this.textDefault(res)
          } else {
            this.els.container.innerHTML += this.textDefault(res)
          }
        })
      })
      .catch(err => this.err = err);
  }

  textDefault(res) {
    return `
    <section class="post">
      <span class="score d-block">
      <img src="img/updoot.png" width="15" style="margin-right: .25em; transform: translate(2px, -1px);">
      ${res.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </span>

      <a data-target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com/u/${res.data.author}">u/${res.data.author}</a>:

      "${res.data.title}"
          <span class="info d-block my-2">
            <a href="https://reddit.com/${res.data.subreddit_name_prefixed}" data-target="_blank"  rel="nofollow noopener noreferrer">${res.data.subreddit_name_prefixed}</a>

            &mdash;

            <a data-target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com${res.data.permalink}">Comments</a>
          </span>


          <span class="text-warning gold ${res.data.gilded != 0 ? 'd-block' : 'd-none'}">
            ${res.data.gilded != 0 ? res.data.gilded : ''} &times;
          </span>

        ${this.thisText(res)}
        ${this.preview(res.data.preview, res.data.url, res.data)}

    </section>`
  }


  thisText(arg) {
    if (!arg.data.thistext_html) return ''

    return `
      <div class="self-text">
      <button class="collapse-icon btn btn-none self-text-btn"></button>
      <span class="text">${this.decodeHtml(arg.data.thistext_html)}</span>
      </div>`
  }

  AEL() {
    this.els.form.addEventListener('submit', e => {
      this.els.container.innerHTML = ''
      this.setCloseState()
      this.els.input.blur()
      this.getData(e)
    })

    this.els.input.addEventListener('keyup', e => {
      this.setCloseState()
      if ('ontouchstart' in window) return;
      this.getData(e)
    })

    this.els.close.addEventListener('click', e => this.resetData(e))
    this.els.sortSelect.addEventListener('change', e => this.sortChange(e))
  }
  sortChange(e) {
    this.params.sort = e.target.options[e.target.selectedIndex].value
    this.fetchData(this.els.input.value)
  }

  getData(e) {
    if ((e.keyCode > 36 && e.keyCode < 41) ||
      e.keyCode == 32 ||
      e.keyCode == 91 ||
      e.keyCode == 9 ||
      e.keyCode == 2 ||
      (e.keyCode > 15 && e.keyCode < 21)) return;
    if (this.vals.original.length > 512) {
      this.els.container.innerHTML = '<h1>Query may not be longer than 512 characters</h1>';
      return;
    }

    e.preventDefault()
    this.vals.original = this.els.input.value

    this.fetchData(this.vals.original)
    this.saveToStorage(this.vals.original)
  }

  resetData(e) {
    this.els.form.reset()
    this.els.container.innerHTML = '';
    e.target.style.display = 'none';
    this.params.sort = 'confidence';
    this.els.input.focus()
    this.saveToStorage()
  }


  collapse() {
    this.els.collapseIcon = document.querySelectorAll('.collapse-icon')

    this.els.container.addEventListener('click', e => {
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
          e.target.nextElementSibling.innerHTML = `<img heigth="${e.target.dataset.ht}" width="${e.target.dataset.wt} src="${e.target.dataset.url}" type="image/gif">`
        }
      }
    })
  }

  preview(ar, link, res) {
    if (!ar) return '';
    if (ar.images[0].variants.mp4) {
      const image = ar.images[0].variants.mp4.source

      const { ht, wt, url } = { ht: image.height, wt: image.width, url: image.url }


      return `<div class="self-text">
        <button class="collapse-icon btn btn-none gif-toggle" data-ht="${ht}" data-wt="${wt}" data-url="${url}" data-type="mp4"></button>
      <span class="text"></span>
      </div>`
    } else if (ar.images[0].variants.gif) {
      const image = ar.images[0].variants.gif.source


      const { ht, wt, url } = { ht: image.height, wt: image.width, url: image.url }

      return `<div class="slef-text">
      <button class="collapse-icon btn btn-none gif-toggle" data-ht="${ht}" data-wt="${wt}" data-url="${url}" data-type="gif"></button>
      <span class="text"></span>
      </div>`
    }


    const image = ar.images[0].source

    const { ht, url } = { ht: image.height, url: image.url }

    return `
    <a data-target="_blank" class="post-link" rel="nofollow noopener noreferrer" href="${link}">
      <img class="thumb-img" src="${url}" style="max-height: ${`${(ht / 9) * 16}px`}" class="d-block mx-auto">
      <p class="img-domain">${res.domain}</p>
    </a>`
  }
}

new Search
