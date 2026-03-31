import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/lib/firebase/client";
import { compressImage } from "@/lib/utils/image";

export type UploadedPhoto = {
  imageUrl: string;
  imagePath: string;
};

export async function uploadDogPhoto(
  userId: string,
  year: number,
  logId: string,
  file: File,
): Promise<UploadedPhoto> {
  const imageBlob = await compressImage(file);
  const imagePath = `dog-photos/${userId}/${year}/${logId}.jpg`;
  const storageRef = ref(storage, imagePath);

  await uploadBytes(storageRef, imageBlob, {
    contentType: "image/jpeg",
    customMetadata: {
      ownerUid: userId,
    },
  });

  const imageUrl = await getDownloadURL(storageRef);
  return { imagePath, imageUrl };
}

export async function deleteDogPhoto(imagePath: string): Promise<void> {
  await deleteObject(ref(storage, imagePath));
}

