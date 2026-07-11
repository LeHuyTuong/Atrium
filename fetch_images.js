const fs = require('fs');
const https = require('https');
const path = require('path');

const exhibits = {
  // Phase 1
  'watt-steam': 'Watt_steam_engine',
  'spinning-jenny': 'Spinning_jenny',
  'cotton-gin': 'Cotton_gin',
  'puddling-furnace': 'Puddling_furnace',
  'rocket-locomotive': 'Stephenson%27s_Rocket',
  'jacquard-loom': 'Jacquard_machine',
  'gas-lamp': 'Gas_lighting',
  'thames-tunnel': 'Thames_Tunnel',

  // Phase 3
  'intel-4004': 'Intel_4004',
  'arpanet': 'ARPANET',
  'www': 'World_Wide_Web',
  'bar-code': 'Universal_Product_Code',
  'gps': 'Global_Positioning_System',
  'cell-phone': 'Motorola_DynaTAC',
  'pc-monitor': 'IBM_Personal_Computer',
  'ethernet': 'Ethernet',

  // Phase 4
  'neural-net': 'Artificial_neural_network',
  '3d-printer': '3D_printing',
  'tesla-autopilot': 'Tesla_Autopilot',
  'cloud-aws': 'Amazon_Web_Services',
  'smartphone': 'IPhone',
  'falcon-9': 'Falcon_9',
  'humanoid-robot': 'Humanoid_robot',
  'transformer-arch': 'Transformer_(machine_learning_model)'
};

const outputDir = path.join(__dirname, 'public', 'images', 'museum');

async function fetchImage(id, title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1000`;
  
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MuseumApp/1.0 (test@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1' || !pages[pageId].thumbnail) {
            console.log(`[!] No image found for ${id} (${title})`);
            resolve(null);
            return;
          }
          const imgUrl = pages[pageId].thumbnail.source;
          resolve(imgUrl);
        } catch (e) {
          console.log(`[!] Error parsing for ${id}: ${e.message}`);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.log(`[!] Network error for ${id}: ${e.message}`);
      resolve(null);
    });
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'MuseumApp/1.0 (test@example.com)' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const results = [];

  for (const [id, title] of Object.entries(exhibits)) {
    console.log(`Fetching ${id}...`);
    const imgUrl = await fetchImage(id, title);
    if (imgUrl) {
      const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
      const destName = `${id}${ext}`;
      const destPath = path.join(outputDir, destName);
      
      console.log(`  -> Downloading ${imgUrl} to ${destName}`);
      await downloadImage(imgUrl, destPath);
      results.push({ id, file: destName });
    }
  }

  console.log('\nDone! Add these to historical-images.ts:');
  for (const r of results) {
    console.log(`id: "${r.id}" => imageUrl: "/images/museum/${r.file}"`);
  }
}

main();
