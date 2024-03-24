import { NextServerPageProps, getFrameMessage, getPreviousFrame } from "frames.js/next/server";
import { DEFAULT_DEBUGGER_HUB_URL } from "./debug";
import { getCircleFrameBody, getDefaultFrameBody, getTransactionSubmittedFrameBody } from "../lib/getFrame";

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const frameCallerUsername = frameMessage?.requesterUserData?.username!;

  console.log("Username", frameCallerUsername);

  if (frameMessage?.transactionId) {
    return getTransactionSubmittedFrameBody(previousFrame, frameMessage.transactionId);
  } else if (frameMessage?.buttonIndex === 1) {
    return getCircleFrameBody(previousFrame, frameCallerUsername);
  } else {
    return getDefaultFrameBody(previousFrame);
  }
}
