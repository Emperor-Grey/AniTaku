// network.js

const BASE_URL = 'http://192.168.0.104:3000';

// Helper function to handle API requests
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error to handle it in the component
  }
}

// Function to get Recent Episodes
export async function getRecentEpisodes() {
  try {
    const data = await fetchData(
      'meta/anilist/recent-episodes?page=1&perPage=15&provider=gogoanime',
    );
    return data.results.map(anime => {
      return {
        id: anime.id,
        title: anime.title,
        image: anime.image,
        episodeId: anime.episodeId,
        episodeTitle: anime.episodeTitle,
        episodeNumber: anime.episodeNumber,
        type: anime.type,
      };
    });
  } catch (error) {
    throw error;
  }
}

// Function to get popular anime data
export async function getPopularData() {
  try {
    const data = await fetchData('meta/anilist/popular?page=1&perPage=10');
    return data.results.map(anime => {
      return {
        id: anime.id,
        title: anime.title,
        image: anime.image,
        trailer: anime.trailer,
        description: anime.description,
        status: anime.status,
        cover: anime.cover,
        rating: `${anime.rating}%`,
        releaseDate: anime.releaseDate,
        color: anime.color,
        genres: anime.genres,
        totalEpisodes: anime.totalEpisodes,
        duration: anime.duration,
        type: anime.type,
      };
    });
  } catch (error) {
    throw error;
  }
}

// // Function to get trending anime data
//! i don't trust this shit
// export async function getTrendingData() {
//   try {
//     const data = await fetchData('meta/anilist/trending?page=3&perPage=10');
//     return data.results.map(anime => ({
//       id: anime.id,
//       title: anime.title,
//       image: anime.image,
//       trailer: anime.trailer,
//       description: anime.description,
//       status: anime.status,
//       cover: anime.cover,
//       rating: `${anime.rating}%`,
//       releaseDate: anime.releaseDate,
//       color: anime.color,
//       genres: anime.genres,
//       totalEpisodes: anime.totalEpisodes,
//       duration: anime.duration,
//       type: anime.type,
//     }));
//   } catch (error) {
//     throw error;
//   }
// }

// Function to get random anime data
// ! For Strange Reason This Does not work every time hence not used
// export async function getRandomData() {
//   try {
//     const data = await fetchData('random-anime');
//     return data.results.map(anime => ({
//       id: anime.id,
//       title: anime.title,
//       image: anime.image,
//       trailer: anime.trailer,
//       description: anime.description,
//       status: anime.status,
//       cover: anime.cover,
//       rating: `${anime.rating} %`,
//       releaseDate: anime.releaseDate,
//       color: anime.color,
//       genres: anime.genres,
//       totalEpisodes: anime.totalEpisodes,
//       duration: anime.duration,
//       type: anime.type,
//     }));
//   } catch (error) {
//     throw error;
//   }
// }

// function to fetch episodeData
export async function episodeData(episodeId) {
  try {
    const data = await fetchData(`meta/anilist/watch/${episodeId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function RecentEpisodeData(episodeId) {
  try {
    const data = await fetchData(`meta/anilist/watch${episodeId}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getEpisodeData(id) {
  try {
    const data = await fetchData(`meta/anilist/info/${id}`);
    return {
      anime: {
        id: data.id,
        title: data.title,
        image: data.image,
        trailer: data.trailer,
        description: data.description,
        status: data.status,
        cover: data.cover,
        rating: `${data.rating} %`,
        releaseDate: data.releaseDate,
        genres: data.genres,
        totalEpisodes: data.totalEpisodes,
        duration: data.duration,
        // Add additional properties here
        season: data.season,
        subOrDub: data.subOrDub,
        recommendations: data.recommendations,
        characters: data.characters,
        episodes: data.episodes,
      },
    };
  } catch (error) {
    throw error;
  }
}

// Function to get anime data by genre
export async function getAnimeDataByGenre(genre, page = 1, perPage = 15) {
  try {
    const data = await fetchData(
      `meta/anilist/advanced-search?genres=["${genre}"]&page=${page}&perPage=${perPage}`,
    );
    return data.results.map(anime => ({
      id: anime.id,
      title: anime.title,
      image: anime.image,
      description: anime.description,
      status: anime.status,
      cover: anime.cover,
      rating: `${anime.rating} %`,
      releaseDate: anime.releaseDate,
      color: anime.color,
      genres: anime.genres,
      totalEpisodes: anime.totalEpisodes,
      type: anime.type,
    }));
  } catch (error) {
    throw error;
  }
}

export async function getSchedule() {
  try {
    // const url = 'https://api.anify.tv/schedule?type=anime&fields=[id,title,coverImage,status,season,currentEpisode,mappings,synonyms,countryOfOrigin,description,duration,color,year,rating,popularity,type,format,relations,totalEpisodes,genres,tags,episodes,averageRating,averagePopularity,artwork,characters,airingAt,airingEpisode]';
    const url = 'https://api.anify.tv/schedule?type=anime';

    const response = await fetch(url);
    const data = await response.json();

    const schedule = {
      sunday: mapAnimeData(data.sunday),
      monday: mapAnimeData(data.monday),
      tuesday: mapAnimeData(data.thursday),
      wednesday: mapAnimeData(data.wednesday),
      thursday: mapAnimeData(data.thursday),
      friday: mapAnimeData(data.friday),
      saturday: mapAnimeData(data.saturday),
    };

    return schedule;
  } catch (error) {
    throw error;
  }
}

function mapAnimeData(animeArray) {
  return animeArray.map(anime => ({
    id: anime.id,
    coverImage: anime.coverImage,
    title: anime.title,
    color: anime.color,
    airingAt: anime.airingAt,
    airingEpisode: anime.airingEpisode,
  }));
}
