const tbody = document.getElementById('tbody_watchlist');
let watchList = JSON.parse(localStorage.getItem('watchlist')) || [];

function generateTable(data) {
tbody.innerHTML = '';
console.log(data);

data.forEach(episode => {
    console.log(episode);
    let i = 1
    tbody.innerHTML += `<tr>
                     <th scope="row">${i}</th>
                   <td>${episode.episodeName}</td>
                   <td>${episode.episode}</td>
                   <td>${episode.dateToAdd}</td>
                   <td> <input class="form-check-input" type="checkbox" id="checkDefault" ${episode.watched ? 'checked' : ''}></td>
                   <td><button class="btn btn-danger btn-sm add_to_watchlist" onclick="removeFromWatchlist(${i - 1})" data-episode-id="${episode.id}"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
<path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
</svg></button></td>
                 </tr>`;
    i++;
})
};

generateTable(watchList);

function removeFromWatchlist(index) {
    console.log(index);

    watchList.splice(index, 1);
    console.log(watchList);

    localStorage.setItem('watchlist', JSON.stringify(watchList));
    generateTable(watchList);

}

function watched(index){
    if(watchList[index].watched){
        watchList[index].watched = false;
    } else {
        watchList[index].watched = true;
    }
    localStorage.setItem('watchlist', JSON.stringify(watchList));
    generateTable(watchList);
}