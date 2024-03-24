import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import axios from "axios";
import path from "path";
import fs from "fs";
import * as style from "./styles/styles";
import { init, fetchQuery } from "@airstack/node";

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
  var peopleFnames = [];
  var peoplePropics = [];

  try {
    const response = await axios.post("https://graph.cast.k3l.io/links/engagement/handles?limit=9", [frameCallerUsername]);
    response.data.result.forEach((element) => {
      if (element.username !== frameCallerUsername || peopleFnames.length > 8) {
        peopleFnames.push(element.fname);
      }
    });
  } catch (error) {
    console.error(error);
  }

  for (let i = 0; i < peopleFnames.length; i++) {
    const name = peopleFnames[i];
    const { data, error } = await fetchQuery(query, { fname: name });
    if (data) {
      console.log("Data:", JSON.stringify(data));
      peoplePropics.push(data.Socials.Social[0].profileImageContentValue.image.small);
    } else if (error) {
      console.log("error:", error);
    }
  }

  console.log(peoplePropics);

  const imagePath = path.join(process.cwd(), "public/bg_image.png");
  const buffer = fs.readFileSync(imagePath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  return (
    <FrameContainer postUrl="/mint" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage
        aspectRatio="1:1"
        options={{
          width: 420,
          height: 420,
          fonts: [],
        }}
      >
        <img src={`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`} style={style.bgImage} />
        <img src={frameCallerProfileImage} style={style.callerPropic} />
        <img src={peoplePropics[0]} style={style.friendPropicTop} />
        <img src={peoplePropics[1]} style={style.friendPropicTopLeft} />
        <img src={peoplePropics[2]} style={style.friendPropicTopRight} />
        <img src={peoplePropics[3]} style={style.friendPropicLeft} />
        <img src={peoplePropics[4]} style={style.friendPropicRight} />
        <img src={peoplePropics[5]} style={style.friendPropicBottom} />
        <img src={peoplePropics[6]} style={style.friendPropicBottomLeft} />
        <img src={peoplePropics[7]} style={style.friendPropicBottomRight} />
      </FrameImage>
      <FrameButton action="tx" target="/mint" post_url="/">
        Mint
      </FrameButton>
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
          width: 420,
          height: 420,
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
  return (
    <FrameContainer pathname="/" postUrl="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {transactionId}
        </div>
      </FrameImage>
      <FrameButton action="link" target={`https://optimistic.etherscan.io/tx/${transactionId}`}>
        View on block explorer
      </FrameButton>
    </FrameContainer>
  );
}
