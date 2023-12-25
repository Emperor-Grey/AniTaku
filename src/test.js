const {META} = require('@consumet/extensions');

const anilist = new META.Anilist();

anilist.fetchAnimeInfo('111322').then(data => {
  console.log(data);
});
