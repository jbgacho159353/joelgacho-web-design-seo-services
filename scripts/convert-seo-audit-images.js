const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

const conversions = [
  {
    input: path.join(assetsDir, 'seo audit JG DigitalHub-Featured-Image.png'),
    outputs: [
      { file: path.join(assetsDir, 'seo audit JG DigitalHub-Featured-Image.webp'), width: null },
      { file: path.join(assetsDir, 'seo audit JG DigitalHub-Featured-Image-640.webp'), width: 640 },
    ],
  },
  {
    input: path.join(assetsDir, 'seo audit JG DigitalHub-blog-post-image.png'),
    outputs: [
      { file: path.join(assetsDir, 'seo audit JG DigitalHub-blog-post-image.webp'), width: null },
      { file: path.join(assetsDir, 'seo audit JG DigitalHub-blog-post-image-640.webp'), width: 640 },
    ],
  },
];

async function run() {
  for (const { input, outputs } of conversions) {
    for (const { file, width } of outputs) {
      const pipeline = sharp(input).webp({ quality: 82 });
      if (width) pipeline.resize(width);
      await pipeline.toFile(file);
      console.log('Created:', path.basename(file));
    }
  }
}

run().catch(err => { console.error(err); process.exit(1); });
