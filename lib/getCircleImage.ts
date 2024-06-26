import { createCanvas, loadImage } from "canvas";
import { createWriteStream } from "fs";

const toRad = (x: number) => x * (Math.PI / 180);

export default async function getCircleImage(
  peoplePropics: string[],
  frameCallerProfileImage: string,
  frameCallerUsername: string
) {
  const width = 350;
  const height = 350;
  const modifier = 1000 / width;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // fill the background
  ctx.fillStyle = "#C5EDCE";
  ctx.fillRect(0, 0, width, height);

  // preparing the data
  const config = [
    { distance: 0, count: 1, radius: 110 / modifier, users: [frameCallerProfileImage] },
    { distance: 200 / modifier, count: 8, radius: 64 / modifier, users: peoplePropics.slice(0, 8) },
    { distance: 330 / modifier, count: 15, radius: 58 / modifier, users: peoplePropics.slice(8, 23) },
    { distance: 450 / modifier, count: 26, radius: 50 / modifier, users: peoplePropics.slice(23, 49) },
  ];

  // loop over the layers
  for (const [layerIndex, layer] of config.entries()) {
    const { count, radius, distance, users } = layer;

    const angleSize = 360 / count;

    // loop over each circle of the layer
    for (let i = 0; i < count; i++) {
      // We need an offset or the first circle will always be on the same line and it looks weird
      // Try removing this to see what happens
      const offset = layerIndex * 30;

      // i * angleSize is the angle at which our circle goes
      // We need to convert to radiant to work with the cos/sin
      const r = toRad(i * angleSize + offset);

      const centerX = Math.cos(r) * distance + width / 2;
      const centerY = Math.sin(r) * distance + height / 2;

      // if we are trying to render a circle but we ran out of users, just exit the loop. We are done.
      if (!users[i]) break;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();

      const defaultAvatarUrl = "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
      const avatarUrl = users[i] || defaultAvatarUrl;

      const img = await loadImage(avatarUrl);
      ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);

      ctx.restore();
    }
  }

  // Get it as a Buffer
  const buffer = canvas.toBuffer("image/png");

  // Convert the Buffer to an ArrayBuffer and return it
  const arrayBuffer = Uint8Array.from(buffer).buffer;

  return arrayBuffer;
}
