const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//修改
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
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

//新增
function removeFromFavorite(id){
  const movieIndex = movies.findIndex(movie => movie.id === id)
  //檢查是否有回傳成功
  //return console.log(movieIndex)
  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


dataPanel.addEventListener('click', function onPanelClicked(event){  
  if (event.target.matches('.btn-show-movie')){
    //console.log(event.target.dataset)
    //需字串轉成數字
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)

//localStorage.setItem("default_language", "English")
// console.log(localStorage.getItem("default_language"))
// localStorage.removeItem("default_language")
// console.log(localStorage.removeItem("default_language"))
 //  localStorage.setItem("default_language", JSON.stringify())  