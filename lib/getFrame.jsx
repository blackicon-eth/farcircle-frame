import { FrameButton, FrameContainer, FrameImage } from "frames.js/next/server";
import axios from "axios";
import path from "path";
import fs, { cp } from "fs";
import * as style from "./styles/styles";
import { init, fetchQuery } from "@airstack/node";
import getCircleImage from "./getCircleImage";

init(process.env.AIRSTACK_KEY);

const query = `query GetPropicsQuery($fname: String) {
  Socials(
    input: {
      filter: {
        profileName: { _eq: $fname }
        dappName: { _eq: farcaster }
      }
      blockchain: ethereum
    }
  ) {
    Social {
      profileImage
      profileImageContentValue {
        image {
          small
        }
      }
    }
  }
}`;

export async function getCircleFrameBody(previousFrame, frameCallerUsername, frameCallerProfileImage) {
  var peoplePropics = [];

  try {
    const response = await axios.post("https://graph.cast.k3l.io/links/engagement/handles?limit=65", [frameCallerUsername]);
    const promises = response.data.result.map(async (element) => {
      if (element.fname !== frameCallerUsername && peoplePropics.length <= 50) {
        const name = element.fname;
        const { data, error } = await fetchQuery(query, { fname: name });
        if (data.Socials.Social) {
          peoplePropics.push(data.Socials.Social[0].profileImageContentValue.image.small);
        } else if (error) {
          console.log("error:", error);
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }

  const arrayBuffer = await getCircleImage(peoplePropics, frameCallerProfileImage, frameCallerUsername);

  return (
    <FrameContainer postUrl="/frame" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage
        aspectRatio="1:1"
        options={{
          width: 350,
          height: 350,
          fonts: [],
        }}
      >
        <img src={`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`} style={style.bgImage} />
      </FrameImage>
      <FrameButton action="tx" target="/mint" post_url="/">
        Mint
      </FrameButton>
      <FrameButton action="post">Mock Mint</FrameButton>
    </FrameContainer>
  );
}

export function getDefaultFrameBody(previousFrame) {
  const imagePath = path.join(process.cwd(), "public/front_image.png");
  const buffer = fs.readFileSync(imagePath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  return (
    <FrameContainer postUrl="/frame" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage
        aspectRatio="1:1"
        options={{
          width: 350,
          height: 350,
          fonts: [],
        }}
      >
        <img src={`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`} style={style.frontImage} />
      </FrameImage>
      <FrameButton>Calculate your Circle!</FrameButton>
    </FrameContainer>
  );
}

export function getTransactionSubmittedFrameBody(previousFrame, transactionId) {
  const imagePath = path.join(process.cwd(), "public/transaction_submitted.png");
  const buffer = fs.readFileSync(imagePath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  return (
    <FrameContainer pathname="/" postUrl="/" state={{}} previousFrame={previousFrame}>
      <FrameImage
        aspectRatio="1:1"
        options={{
          width: 350,
          height: 350,
          fonts: [],
        }}
      >
        <img
          src={`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`}
          style={style.transactionSubmittedImage}
        />
      </FrameImage>
      <FrameButton action="link" target={`https://basescan.org/tx/${transactionId}`}>
        View on block explorer
      </FrameButton>
    </FrameContainer>
  );
}
