let errorHandle = false;
let loading = false;
let newAPIrecipe = '/api/recipes';
let searchAPI = '/api/search/?q=';
let loadingEls = document.querySelector('.loading');
let foods = document.querySelector('.foods');
let inputSearch = document.querySelector('.search');
let btnSearch = document.querySelector('.searchBtn');
let searchActive = false;
let favouriteFoods = document.querySelector('.favouriteFoods');
let dataFilter;
let searchFilter = false;
window.addEventListener('DOMContentLoaded', async () => {
  loading = true;
  loadingEls.textContent = 'Loading...'
  try {
    let data = await fetch(`https://masak-apa-tomorisakura.vercel.app${newAPIrecipe}`);
    let dataJson = await data.json();
    loadingEls.remove();
    createELsBox(dataJson);
    dataFilter = dataJson.results;
    loading = false;
    console.log(dataFilter)
  } catch (error) {
    console.error(error);
    errorHandle = true;
    if (errorHandle) loadingEls.textContent = "Sorry, we can't get the data..."
  }
});
function createELsBox(data) {
  if (searchActive) {
    foods.innerHTML = "";
    data.results.map((itemData) => {
      let box__foods = document.createElement('div');
      box__foods.classList.add('box__foods');
      box__foods.innerHTML = `<img src="${itemData.thumb}"/>
                              <div class="titleText">
                              <h4>${itemData.title}</h4>
                              <div class="hearts">
                              <i class="fa-solid fa-heart"></i>
                              </div>
                              </div>
      `
      foods.appendChild(box__foods);
    })
  } else if (searchFilter) {
    if (data.length > 0) {
      foods.innerHTML = "";
      data.map((itemData) => {
        let box__foods = document.createElement('div');
        box__foods.classList.add('box__foods');
        box__foods.innerHTML = `<img src="${itemData.thumb}"/>
                              <div class="titleText">
                              <h4>${itemData.title}</h4>
                              <div class="hearts">
                              <i class="fa-solid fa-heart"></i>
                              </div>
                              </div>
      `
        foods.appendChild(box__foods);
      })
    } else {
      foods.innerHTML = "Keywords yang anda cari tidak ada..."
    }
  } else {

    data.results.map((itemData) => {
      let box__foods = document.createElement('div');
      box__foods.classList.add('box__foods');
      box__foods.innerHTML = `<img src="${itemData.thumb}"/>
                              <div class="titleText">
                              <h4>${itemData.title}</h4>
                              <div class="hearts">
                              <i class="fa-solid fa-heart"></i>
                              </div>
                              </div>
      `
      foods.appendChild(box__foods);
    })
  }
}
foods.addEventListener('click', (e) => {
  let targetels = e.target;
  if (targetels.classList.contains('active')) {
    targetels.classList.remove('active');
    removeToLocalStorage(targetels.parentElement.children[0].textContent);
    CreateFavoriteEls()
  } else {
    targetels.classList.add('active');
    let title = targetels.parentElement.children[0].textContent;
    let img = targetels.parentElement.parentElement.children[0].getAttribute('src');
    let objFavourite = {
      titleObj: title,
      imgObj: img,
    }
    saveToLocalStorage(objFavourite);
    addFavoriteEls()
  }
});

btnSearch.addEventListener('click', async (e) => {
  e.preventDefault();
  searchActive = true;
  let valueInput = inputSearch.value;
  if (valueInput) {
    loading = true;
    try {
      loading = false;
      let dataSearch = await fetch(`https://masak-apa-tomorisakura.vercel.app${searchAPI}` + valueInput);
      let dataSearchJson = await dataSearch.json();
      createELsBox(dataSearchJson);
    } catch (error) {
      console.error(error);
      errorHandle = true;
    }
  } else {
    window.alert('Mohon jangan kosongkan fields');
  }
});

function saveToLocalStorage(data) {
  let favouriteObj;
  if (localStorage.getItem('favouriteObj') === null) {
    favouriteObj = [];
  } else {
    favouriteObj = JSON.parse(localStorage.getItem('favouriteObj'));
  }
  favouriteObj.push(data);
  localStorage.setItem('favouriteObj', JSON.stringify(favouriteObj));
}
function getToLocalStorage() {
  let favouriteObj;
  if (localStorage.getItem('favouriteObj') === null) {
    favouriteObj = [];
  } else {
    favouriteObj = JSON.parse(localStorage.getItem('favouriteObj'));
  }
  return favouriteObj;
}
function addFavoriteEls() {
  let data = getToLocalStorage();
  if (data.length > 0) {
    CreateFavoriteEls(data)
  }
}
addFavoriteEls();

function CreateFavoriteEls(data = getToLocalStorage()) {
  favouriteFoods.innerHTML = ""
  data.map((itemData, index) => {

    let boxFav = document.createElement('div');
    boxFav.classList.add('boxFav');
    boxFav.innerHTML = `<img src="${itemData.imgObj}"/>
                        <div class="close" id="${index}" onclick="removeFav(this)"><i class="fa-solid fa-square-xmark"></i></div>
                        <div class="title">
                        ${itemData.titleObj}
                        </div>
    `
    favouriteFoods.appendChild(boxFav)
  })
}
function removeFav(data) {
  let target = data.getAttribute('id');
  removeToLocalStorage(parseInt(target));
  CreateFavoriteEls();
}
function removeToLocalStorage(data) {
  let dataLocal = getToLocalStorage();
  let ObjData = dataLocal.findIndex((itemData) => {
    return itemData.titleObj === data;
  });
  let favouriteObj;
  if (localStorage.getItem('favouriteObj') === null) {
    favouriteObj = [];
  } else {
    favouriteObj = JSON.parse(localStorage.getItem('favouriteObj'));
  }
  favouriteObj.splice(ObjData, 1);
  localStorage.setItem('favouriteObj', JSON.stringify(favouriteObj))
}

// live search 
inputSearch.addEventListener('input', () => {
  searchFilter = true;
  let hasilObjFilter = dataFilter.filter((itemData) => {
    if (itemData.title.toLowerCase().includes(inputSearch.value.toLowerCase())) {
      return itemData
    }
  });
  createELsBox(hasilObjFilter)
})