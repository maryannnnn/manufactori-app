import sharp from 'sharp'

const input = 'src/scripts/assets/logo-sources/areks-source.jpg'
const meta = await sharp(input).metadata()
console.log(meta.width, meta.height)

const regions = [
  { name: 'left', left: 0, top: 28, width: 90, height: 72 },
  { name: 'sofa', left: 8, top: 36, width: 52, height: 48 },
  { name: 'banner', left: 0, top: 0, width: 312, height: 28 },
]
for (const region of regions) {
  await sharp(input)
    .extract(region)
    .resize({ width: region.width * 6, kernel: 'nearest' })
    .png()
    .toFile(`src/scripts/assets/logo-sources/areks-${region.name}.png`)
  console.log(region.name)
}
