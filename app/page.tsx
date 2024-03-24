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
  const frameCallerProfileImage = frameMessage?.requesterUserData?.profileImage!;

  if (frameMessage?.buttonIndex === 2 /*|| frameMessage?.transactionId*/) {
    return getTransactionSubmittedFrameBody(
      previousFrame,
      "0x9485b102891c9dfc220ba1bb3c883d43174fedc644e29382b2ab1857cc067c8e" /*frameMessage.transactionId*/
    );
  } else if (frameMessage?.buttonIndex === 1) {
    return getCircleFrameBody(previousFrame, frameCallerUsername, frameCallerProfileImage);
  } else {
    return getDefaultFrameBody(previousFrame);
  }
}
