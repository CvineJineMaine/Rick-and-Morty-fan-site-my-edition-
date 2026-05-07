const EPISODE_URL = 'https://rickandmortyapi.com/api/episode';
const container = document.querySelector('.container_episodes');
//const container = document.getElementById('#episodes-list');


let page = 1;

getEpisodes();

function generateTable(data) {
let episodeHTML = `<table class="table">
               <thead>
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">Episode name</th>
                   <th scope="col">Air date</th>
                   <th scope="col">Episode</th>
                   <th scope="col">Add to Watch List</th>
                 </tr>
               </thead>
               <tbody>`;
data.forEach(episode => {
    console.log(episode);
    episodeHTML += `<tr>
                     <th scope="row">${episode.id}</th>
                   <td>${episode.name}</td>
                   <td>${episode.air_date}</td>
                   <td>${episode.episode}</td>
                   <td><button class="btn btn-success btn-sm add_to_watchlist" data-episode="${episode.id}" data-episode-name="${episode.name}">Add</button></td>
                 </tr>`;
})
episodeHTML += `</tbody></table>`;
container.innerHTML = episodeHTML;
saveToWatchList();
};



function saveToWatchList() {
const btnAdds = document.querySelectorAll('.add_to_watchlist');
let watchList = JSON.parse(localStorage.getItem('watchlist')) || [];
let data = new Date();
btnAdds.forEach(btn => {
  btn.addEventListener('click', () => {
   let episodeName = btn.getAttribute('data-episode-name');
   let episode = btn.getAttribute('data-episode');
   let isAtWatchlist = false;
   watchList.forEach(item => {
    if (item.episode === episode) {
        isAtWatchlist = true;
        return alert('This episode is already in your watchlist!');
    } 
    if (isAtWatchlist) {
        return;
    }
   });

   let watchlistItem = {
    episodeName: episodeName,
    episode: episode,
    watched: false,
    dateToAdd: data.toLocaleDateString()
  
   }
   
   watchList.push(watchlistItem);
   localStorage.setItem('watchlist', JSON.stringify(watchList));
  })
});
}

// 2. Updated Fetch Function
function getEpisodes(page = 1) {
    fetch(`${EPISODE_URL}/?page=${page}`)
    .then(response => response.json())
    .then(data => {
        if (data.results) {
            generateTable(data.results);
            renderPagination(data.info); // New function
        }
    });
}

getEpisodes(page);

// 3. New Pagination Renderer (HeroUI Style)
function renderPagination(info) {
    // Make sure this ID matches your HTML and CSS
    const paginationBox = document.getElementById('pagination-container');
    if (!paginationBox) return;

    let totalPages = info.pages;
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    // Adjust range if at the end
    if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 2);
    }

    let paginationHTML = `
        <li class="page-item ${info.prev === null ? 'disabled' : ''}">
            <a class="page-link prev-btn" href="#">&laquo;</a>
        </li>`;

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link page-num" href="#">${i}</a>
            </li>`;
    }

    paginationHTML += `
        <li class="page-item ${info.next === null ? 'disabled' : ''}">
            <a class="page-link next-btn" href="#">&raquo;</a>
        </li>`;

    paginationBox.innerHTML = paginationHTML;
    attachPaginationEvents(info);
}

// 4. Attach Event Listeners
function attachPaginationEvents(info) {
    document.querySelector('.next-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (info.next) {
            page++;
            getEpisodes(page);
            window.scrollTo(0, 0);
        }
    });

    document.querySelector('.prev-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (info.prev) {
            page--;
            getEpisodes(page);
            window.scrollTo(0, 0);
        }
    });

    document.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            page = parseInt(btn.innerText);
            getEpisodes(page);
            window.scrollTo(0, 0);
        });
    });
}

