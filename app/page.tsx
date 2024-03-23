import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
} from "frames.js/next/server";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";
import { getCircleFrameBody, getDefaultFrameBody } from "../lib/getFrame";

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  if (frameMessage?.buttonIndex === 1) {
    return getCircleFrameBody(previousFrame);
  } else {
    return getDefaultFrameBody(previousFrame);
  }
}
