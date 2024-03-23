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

export async function getCircleFrameBody(previousFrame: any, frameCallerHandle: string) {
  var people: string[] = [];
  try {
    const response = await axios.post("https://graph.cast.k3l.io/links/engagement/handles?limit=9", [frameCallerHandle]);
    response.data.result.forEach((element: any) => {
      if (element.fname !== frameCallerHandle || people.length > 8) {
        people.push(element.fname);
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
  return (
    <FrameContainer postUrl="/frame" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
          <div tw="flex flex-row">Calculate Circle</div>
        </div>
      </FrameImage>
      <FrameButton>Calculate Circle</FrameButton>
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
