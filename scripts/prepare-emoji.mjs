import fs from 'fs/promises';
import path from 'path';

const inputPath = path.resolve(process.cwd(), 'src/data/layout/emoji.json');
const outputPath = path.resolve(process.cwd(), 'src/data/layout/emoji-subset.json');
const emojiCount = 100;

async function prepareEmojis() {
  try {
    const data = await fs.readFile(inputPath, 'utf-8');
    const emojis = JSON.parse(data);
    const subset = emojis.slice(0, emojiCount);
    await fs.writeFile(outputPath, JSON.stringify(subset, null, 2));
    console.log(`Successfully created emoji-subset.json with ${emojiCount} emojis.`);
  } catch (error) {
    console.error('Error preparing emoji subset:', error);
  }
}

prepareEmojis();
