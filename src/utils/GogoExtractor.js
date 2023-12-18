import axios from 'axios';
import cheerio from 'cheerio';
import CryptoJS from 'crypto-js';

class VideoExtractor {
  // Constructor initializes encryption keys, referer, and sources array
  constructor() {
    this.keys = {
      key: CryptoJS.enc.Utf8.parse('37911490979715163134003223491201'),
      secondKey: CryptoJS.enc.Utf8.parse('54674138327930866480207815084989'),
      iv: CryptoJS.enc.Utf8.parse('3134003223491201'),
    };
    this.referer = '';
    this.sources = [];
  }

  // Method to extract video sources from a given video URL
  async extract(videoUrl) {
    // Set the referer property to the URL of the video
    this.referer = videoUrl.href;

    // Make a GET request to the video URL and load the HTML content using Cheerio
    const res = await axios.get(videoUrl.href);
    const $ = cheerio.load(res.data);

    // Generate encrypted AJAX parameters
    const encryptedParams = await this.generateEncryptedAjaxParams(
      $,
      videoUrl.searchParams.get('id') || '',
    );

    // Make a request to an encryption endpoint and decrypt the response
    const encryptedData = await axios.get(
      `${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encryptedParams}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    );

    // Decrypt the AJAX data and parse it as JSON
    const decryptedData = await this.decryptAjaxData(encryptedData.data.data);
    if (!decryptedData.source) {
      throw new Error('No source found. Try a different server.');
    }

    // Extract video sources based on the decrypted data
    if (decryptedData.source[0].file.includes('.m3u8')) {
      // If the source is an m3u8 file, fetch resolutions and add sources accordingly
      const resResult = await axios.get(
        decryptedData.source[0].file.toString(),
      );
      const resolutions = resResult.data.match(
        /(RESOLUTION=)(.*)(\s*?)(\s*.*)/g,
      );
      resolutions?.forEach(res => {
        // Process each resolution and add to sources array
        const index = decryptedData.source[0].file.lastIndexOf('/');
        const quality = res.split('\n')[0].split('x')[1].split(',')[0];
        const url = decryptedData.source[0].file.slice(0, index);
        this.addSources({
          url: url + '/' + res.split('\n')[1],
          isM3U8: (url + res.split('\n')[1]).includes('.m3u8'),
          quality: quality + 'p',
        });
      });

      // Add default sources based on decrypted data
      decryptedData.source.forEach(source => {
        this.addSources({
          url: source.file,
          isM3U8: source.file.includes('.m3u8'),
          quality: 'default',
        });
      });
    } else {
      // If the source is not an m3u8 file, add sources based on decrypted data
      decryptedData.source.forEach(source => {
        this.addSources({
          url: source.file,
          isM3U8: source.file.includes('.m3u8'),
          quality: source.label.split(' ')[0] + 'p',
        });
      });
    }

    // Add backup sources based on decrypted data
    decryptedData.source_bk.forEach(source => {
      this.addSources({
        url: source.file,
        isM3U8: source.file.includes('.m3u8'),
        quality: 'backup',
      });
    });

    // Return the extracted sources
    return this.sources;
  }

  // Method to add sources to the sources array
  async addSources(source) {
    console.log(source);
    if (source.url.includes('m3u8')) {
      // If the source is an m3u8 file, fetch content and add individual video URLs
      const m3u8Urls = await axios
        .get(source.file, {
          headers: {
            Referer: this.referer,
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
          },
        })
        .catch(() => null);

      // Split m3u8 content and add each video URL to the sources array
      const videoList = m3u8Urls?.data.split('#EXT-X-I-FRAME-STREAM-INF:');
      for (const video of videoList || []) {
        if (!video.includes('m3u8')) {
          continue;
        }

        const url = video
          .split('\n')
          .find(line => line.includes('URI='))
          .split('URI=')[1]
          .replace(/"/g, '');

        const quality = video
          .split('RESOLUTION=')[1]
          .split(',')[0]
          .split('x')[1];

        this.sources.push({
          url: url,
          quality: `${quality}p`,
          isM3U8: true,
        });
      }

      return;
    }

    // If the source is not an m3u8 file, add it to the sources array
    this.sources.push({
      url: source.file,
      isM3U8: source.file.includes('.m3u8'),
    });
  }

  // Method to generate encrypted AJAX parameters
  async generateEncryptedAjaxParams($, id) {
    const encryptedKey = CryptoJS.AES.encrypt(id, this.keys.key, {
      iv: this.keys.iv,
    });

    const scriptValue =
      $("script[data-name='episode']").attr('data-value') || '';

    const decryptedToken = CryptoJS.AES.decrypt(scriptValue, this.keys.key, {
      iv: this.keys.iv,
    }).toString(CryptoJS.enc.Utf8);

    return `id=${encryptedKey}&alias=${id}&${decryptedToken}`;
  }

  // Method to decrypt AJAX data
  async decryptAjaxData(encryptedData) {
    const decryptedData = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(encryptedData, this.keys.secondKey, {
        iv: this.keys.iv,
      }),
    );

    return JSON.parse(decryptedData);
  }
}

// Export the VideoExtractor class
export default VideoExtractor;
