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

export async function getCircleFrameBody(previousFrame: any, frameCallerUsername: string) {
  var people: string[] = [];
  try {
    const response = await axios.post("https://graph.cast.k3l.io/links/engagement/handles?limit=9", [frameCallerUsername]);
    response.data.result.forEach((element: any) => {
      console.log(element);
      if (element.username !== frameCallerUsername || people.length > 8) {
        people.push(element.username);
      }
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <FrameContainer postUrl="/mint" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
          <div tw="flex flex-row">MINT</div>
          <div tw="flex flex-col">
            {people.map((person: string, index: number) => (
              <div tw="flex" key={index}>
                {person}
              </div>
            ))}
          </div>
        </div>
      </FrameImage>
      <FrameButton action="tx" target="/mint" post_url="/">
        Mint
      </FrameButton>
    </FrameContainer>
  );
}

export function getDefaultFrameBody(previousFrame: any) {
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
        <img src={`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`} style={style.image} />
      </FrameImage>
      <FrameButton>Calculate your Circle!</FrameButton>
    </FrameContainer>
  );
}

export function getTransactionSubmittedFrameBody(previousFrame: any, transactionId: string) {
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
