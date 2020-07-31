/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const apiLink = "http://api.tvmaze.com/search/shows?q="+query;
  let response = await axios.get(apiLink);


  return [
    {
      id: response.data[0].show.id,
      name: response.data[0].show.name,
      summary: response.data[0].show.summary,
      image: response.data[0].show.image
    }
  ]
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  if (shows[0].image === null){
    shows[0].image = {original: "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png"};
  }
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image.original}">
           <div class="card-body">

             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" id= "modal-toggle" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#staticBackdrop">
             See Episodes
            </button>
           </div>

         </div>

       </div>

      `);
    const episodes = populateEpisodes();
    $item.append(episodes);
    $showsList.append($item);

  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
  let episodes = await getEpisodes(shows[0].id)
  console.log(episodes);

  populateEpisodes(episodes);

});





function populateEpisodes(list){


  

  let $episodesList = $(`
    <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Episode List</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div id=modal-episode-list><ol id="list"></ol></div>      
      </div>
  `);
  const ol = document.querySelector('#list');
  for (let e in list){
    const li = document.createElement("LI");
    li.innerHTML = list[e].name+" (season "+list[e].season+", number "+list[e].number+")";
    ol.appendChild(li);
  }
  const q = document.querySelector("#modal-episode-list");
  return $episodesList.append('body');


}
/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const apiLinkEp = "http://api.tvmaze.com/shows/"+id+"/episodes";
  let response = await axios.get(apiLinkEp);
  response = response.data;
  const episodeList = [];
  for (let episode of response){
    const episodeObject = {};
    episodeObject.id = episode.id;
    episodeObject.name = episode.name;
    episodeObject.season = episode.season;
    episodeObject.number = episode.number;
    episodeList.push(episodeObject);
  }
  return episodeList;
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}
