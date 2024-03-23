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
    <FrameContainer postUrl="/frame" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
          <div tw="flex flex-row">Pressed Button 1</div>
        </div>
      </FrameImage>
      <FrameButton>Calculate Circle</FrameButton>
    </FrameContainer>
  );
}

export function getDefaultFrameBody(previousFrame: any) {
  return (
    <FrameContainer postUrl="/frame" pathname="/" state={{}} previousFrame={previousFrame}>
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-slate-700 text-white justify-center items-center flex flex-col">
          <div tw="flex flex-row">FIRST FRAME</div>
        </div>
      </FrameImage>
      <FrameButton>Calculate Circle</FrameButton>
    </FrameContainer>
  );
}
