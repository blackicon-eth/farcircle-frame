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

export function getCircleFrameBody(previousFrame: any) {
  // TODO: call api to retrive user's info

  return (
    <FrameContainer postUrl="/" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
          <div tw="flex flex-row">Mint</div>
        </div>
      </FrameImage>
      <FrameButton action="tx" target="/mint">
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
