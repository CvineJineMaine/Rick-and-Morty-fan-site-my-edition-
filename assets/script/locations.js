const LOCATION_BASE_URL = 'https://rickandmortyapi.com/api/location';
const container = document.querySelector('.container_locations');
const paginationBox = document.querySelector('#pagination-container');

let page = 1;

function getLocations(page = 1) {
    fetch(`${LOCATION_BASE_URL}/?page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                generateCards(data.results);
                pagination(data.info);
            }
        })
        .catch(err => console.error("Помилка завантаження:", err));
}

function generateCards(data) {
    let locationHTML = `<div class="row">`;
    data.forEach(location => {
        locationHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${location.name}</h5>
                        <p class="card-text">${location.type}</p>
                        <div class="mt-auto">
                            <button type="button" 
                                    class="btn btn-primary btn-modal" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#exampleModal" 
                                    data-location-id="${location.id}">
                                Get more
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    locationHTML += `</div>`;
    container.innerHTML = locationHTML;
}

function pagination(info) {
  const paginationBox = document.querySelector('.pagination');
  if (!paginationBox) return; // Safety check

  let paginationHTML = '';

  // 1. Previous Button
  paginationHTML += `
    <li class="page-item ${info.prev === null ? 'disabled' : ''}">
      <a class="page-link prev-btn" href="#" aria-label="Previous">&laquo;</a>
    </li>`;

  // 2. Logic for HeroUI-style numbers (showing a small window around current page)
  // info.pages is the total number of pages from the API
  let totalPages = info.pages;
  let startPage = Math.max(1, page - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  // Adjust start if we are at the very end
  if (endPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === page ? 'active' : ''}">
        <a class="page-link page-num" href="#">${i}</a>
      </li>`;
  }

  // 3. Next Button
  paginationHTML += `
    <li class="page-item ${info.next === null ? 'disabled' : ''}">
      <a class="page-link next-btn" href="#" aria-label="Next">&raquo;</a>
    </li>`;

  paginationBox.innerHTML = paginationHTML;

  // 4. Re-attach Event Listeners
  attachPaginationEvents(info);
}

function attachPaginationEvents(info) {
  // Next Button
  const nextBtn = document.querySelector('.next-btn');
  if (nextBtn && info.next !== null) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      page++;
      getLocations(page)
      window.scrollTo(0, 0); // Smooth experience
    };
  }

  // Previous Button
  const prevBtn = document.querySelector('.prev-btn');
  if (prevBtn && info.prev !== null) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      page--;
      getLocations(page)
      window.scrollTo(0, 0);
    };
  }

  // Numbered Buttons
  const pageNums = document.querySelectorAll('.page-num');
  pageNums.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      page = parseInt(btn.innerText);
      getLocations(page)
      window.scrollTo(0, 0);
    };
  });
}

function openLocationModal(locationId) {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`;

    fetch(`${LOCATION_BASE_URL}/${locationId}`)
        .then(response => response.json())
        .then(data => {
            modalBody.innerHTML = `
                <div>
                    <h3>${data.name}</h3>
                    <p><b>Type:</b> ${data.type}</p>
                    <p><b>Dimension:</b> ${data.dimension}</p>
                    <p><b>Residents:</b> ${data.residents.length} characters</p>
                    <p><b>Created:</b> ${new Date(data.created).toLocaleDateString()}</p>
                </div>
            `;
        })
        .catch(err => {
            modalBody.innerHTML = `<p class="text-danger">Помилка завантаження даних</p>`;
        });
}

container.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-modal')) {
        const id = event.target.getAttribute('data-location-id');
        openLocationModal(id);
    }
});

getLocations(page);