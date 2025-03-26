import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [192, 384, 512];
const inputFile = 'public/favicon.svg';
const outputDir = 'public/icons';

async function generateIcons() {
  try {
    // SVGファイルを読み込む
    const svgBuffer = await fs.readFile(inputFile);

    // 各サイズのアイコンを生成
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 