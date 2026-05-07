const BASE_URL = 'https://rickandmortyapi.com/api/character';
const container = document.querySelector('.container_characters');

const filterInpName = document.querySelector('#filter_name');
const filterSelectStatus = document.querySelector('#filter_status');
const filterSelectGender = document.querySelector('#filter_gender');
const btnFilter = document.querySelector('#btn_filter');

let page = 1;
let filterName = '';
let filterStatus = '';
let filterGender = '';

function openModal() {
  const btnModal = document.querySelectorAll('.btn-modal');
  console.log(btnModal)
  btnModal.forEach(btn => {
    btn.addEventListener('click', () => {
      let characterId = btn.getAttribute('data-character-id');
      console.log(characterId)


      fetch(`${BASE_URL}/${characterId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const modalBody = document.querySelector('.modal-body');
          modalBody.innerHTML = `
  <div style="display: flex; gap: 20px; align-items: start;">
    <img src="${data.image}" alt="${data.name}" style="width: 200px; border-radius: 10px;">
    
    <div>
      <h1 style="margin-top: 0;">${data.name}</h1>
      <p><b>Status:</b> ${data.status}</p>
      <p><b>Species:</b> ${data.species}</p>
      <p><b>Gender:</b> ${data.gender}</p>
      <p><b>Origin:</b> ${data.origin.name}</p>
      <p><b>Location:</b> ${data.location.name}</p>
    </div>
  </div>

`
        })


    });
  })

};



getCharacters();
function generateCards(data) {
  let cardsHTML = '<div class="row">';
  data.forEach(character => {
    console.log(character);
    cardsHTML += `
    
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4 card" style="width: 18rem; margin-right: 1rem;">
             <img src="${character.image}" class="card-img-top" alt="...">
             <div class="card-body">
             <h5 class="card-title">${character.name}</h5>
             <p class="card-text">${character.status}</p>
             <button type="button" class="btn btn-primary btn-modal" data-character-id="${character.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Get more
</button>
             </div>
           </div>`;

  });
  cardsHTML += '</div>';
  container.innerHTML = cardsHTML;
  openModal();
}



function pagination(info) {
  const paginationBox = document.querySelector('.pagination');
  if (!paginationBox) return; // Safety check

  let paginationHTML = '';

  paginationHTML += `
    <li class="page-item ${info.prev === null ? 'disabled' : ''}">
      <a class="page-link prev-btn" href="#" aria-label="Previous">&laquo;</a>
    </li>`;

  let totalPages = info.pages;
  let startPage = Math.max(1, page - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  if (endPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? 'active' : ''}">
        <a class="page-link page-num" href="#">${i}</a>
      </li>`;
  }

  paginationHTML += `
    <li class="page-item ${info.next === null ? 'disabled' : ''}">
      <a class="page-link next-btn" href="#" aria-label="Next">&raquo;</a>
    </li>`;

  paginationBox.innerHTML = paginationHTML;


  attachPaginationEvents(info);
}

function attachPaginationEvents(info) {
  const nextBtn = document.querySelector('.next-btn');
  if (info.next !== null) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      page++;
      getCharacters(page, filterName, filterStatus, filterGender);
      window.scrollTo(0, 0); // Smooth experience
    };
  }


  const prevBtn = document.querySelector('.prev-btn');
  if (info.prev !== null) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      page--;
      getCharacters(page, filterName, filterStatus, filterGender);
      window.scrollTo(0, 0);
    };
  }

  const pageNums = document.querySelectorAll('.page-num');
  pageNums.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      page = parseInt(btn.innerText);
      getCharacters(page, filterName, filterStatus, filterGender);
      window.scrollTo(0, 0);
    };
  });
}
function filter() {
  btnFilter.addEventListener('click', () => {
    page = 1;
    filterName = filterInpName.value;
    filterStatus = filterSelectStatus.value;
    filterGender = filterSelectGender.value;
    getCharacters(page, filterName, filterStatus, filterGender);
  });
}

filter();

function getCharacters(page = 1, name = '', status = '', gender = '') {
  fetch(`${BASE_URL}/?page=${page}&name=${name}&status=${status}&gender=${gender}`)
    .then(response => response.json())
    .then(data => {
      if (data.results) {
        generateCards(data.results);
        pagination(data.info);
      } else {
        container.innerHTML = '<h2>No characters found with the given filters.</h2>';
        const paginationBox = document.querySelector('.pagination');
        paginationBox.innerHTML = '';
        console.warn('No characters found with the given filters.');
      }
    });
}

getCharacters(1, '', '', '');