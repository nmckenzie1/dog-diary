import { doc } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { createLogAndUpdateTotals } from "@/lib/firebase/firestore";
import { createStableId } from "@/lib/utils/id";
import { deleteDogPhoto, uploadDogPhoto } from "@/lib/firebase/storage";
import type { LogInput } from "@/types/models";

export async function submitDogLog(args: {
  userId: string;
  displayName: string;
  input: LogInput;
  photoFile: File;
}): Promise<void> {
  const logRef = doc(db, "dog_logs", createStableId());
  const year = args.input.loggedAt.getFullYear();

  let imagePath = "";

  try {
    const uploaded = await uploadDogPhoto(args.userId, year, logRef.id, args.photoFile);
    imagePath = uploaded.imagePath;

    await createLogAndUpdateTotals({
      userId: args.userId,
      displayName: args.displayName,
      logId: logRef.id,
      imagePath: uploaded.imagePath,
      imageUrl: uploaded.imageUrl,
      input: args.input,
    });
  } catch (error) {
    if (imagePath) {
      await deleteDogPhoto(imagePath).catch(() => undefined);
    }
    throw error;
  }
}



