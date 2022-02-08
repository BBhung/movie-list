const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovie = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('#pagination')

function renderMovieList(data){
  let rawHTML = ''
  
  //使用forEach將裡面的東西一個一個印出來
  data.forEach(item => {
    //需要title, image
    console.log(item)
    rawHTML += `    
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">Movie</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPagination(amount){
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  
  for (let page = 1; page <= numberOfPages; page ++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  pagination.innerHTML = rawHTML
}


function getMoviesByPage(page){
  //這裡的movies可能是總量的80部電影，或是filter出來的電影
  //如果filter movie是有長度的就會顯示filter movie,如果是空的 就會顯示movies
  const data = filteredMovie.length ? filteredMovie : movies
  const startIndex = (page -1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-model-title')
  const modalImage = document.querySelector('#movie-model-image')
  const modalDate = document.querySelector('#movie-model-date')
  const modalDescription = document.querySelector('#movie-model-description')

  axios.get(INDEX_URL + id).then((response) => {
    //console.log(response.data.results)
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = `Release date:` + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id){
  // function isMovieMatched(movie){
  //   return movie.id === id
  // }
 //console.log(id)

 //因為getItem只能產生字串,所以用json.parse變成物件或陣列
 //const list = localStorage.getItem('favoriteMovies') || []
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //const movie = movies.find(isMovieMatched)
  const movie = movies.find(movie => movie.id === id )
  if (list.some((movie) => movie.id === id)){
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  // console.log(JSON.stringify(list)) 
  //console.log(movie)
  //console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event){  
  if (event.target.matches('.btn-show-movie')){
    //console.log(event.target.dataset)
    //需字串轉成數字
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})

  pagination.addEventListener('click', function onPaginatorClicked(event) {
//   //如果點擊的不是<a>的話，就會return 不做了
  if (event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderMovieList(getMoviesByPage(page))
  })

searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
  event.preventDefault()
  //check 搜尋欄是否有跑出值來
  //console.log(searchInput.value)
  const keyWord = searchInput.value.trim().toLowerCase()
  
  //如果keyword是個空字串 會跳出警告
  // if (!keyWord.length){
  //   return alert('Please enter valid string')
  // }

  //方法2
  filteredMovie = movies.filter(movie => movie.title.toLowerCase().includes(keyWord))
  if (filteredMovie.length === 0){
    return alert('Cannot find movies with keyword: ' + keyWord)
  }

  //方法1:使用for迴圈
  // for (const movie of movies){
  //   if (movie.title.toLowerCase().includes(keyWord)){
  //     filteredMovie.push(movie)
  //   }
  // }
  renderPagination(filteredMovie.length)
  renderMovieList(getMoviesByPage(1))
}) 


axios.get(INDEX_URL).then(response => {
  // array (80)
  //console.log(response.data.results)

  //方法一：利用for of 從陣列中一個一個拿出來
  //for (const movie of response.data.results){
  //再一個一個分別分進[]裡
  // movies.push(movie)
  // }
  
  //方法二：[...]
  movies.push(...response.data.results)
  
  //這樣會形成 [{80個物件}],但值只有1個
  //movies.push(response.data.results)
  console.log(movies)
  //renderMovieList要來呼叫陣列, movies是全部的
  //renderMovieList(movies)
  renderPagination(movies.length)
  renderMovieList(getMoviesByPage(1))
})
  .catch((err) => console.log(err))

//localStorage.setItem("default_language", "English")
// console.log(localStorage.getItem("default_language"))
// localStorage.removeItem("default_language")
// console.log(localStorage.removeItem("default_language"))
   localStorage.setItem("default_language", JSON.stringify())  