// model
const VideoSource = {
  url: '',
  isM3U8: false,
  quality: '',
};

const VideoInfo = {
  object: 0,
  headers: {},
  sources: [VideoSource],
  download: '',
};

export {VideoInfo, VideoSource};
