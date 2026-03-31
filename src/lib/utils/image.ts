type ResizeImageOptions = {
  maxWidth: number;
  maxHeight: number;
  quality: number;
};

const DEFAULTS: ResizeImageOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
};

export async function compressImage(file: File, options?: Partial<ResizeImageOptions>): Promise<Blob> {
  const { maxWidth, maxHeight, quality } = { ...DEFAULTS, ...options };

  const { width, height, draw } = await decodeImage(file);
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(1, widthRatio, heightRatio);

  const targetWidth = Math.max(1, Math.round(width * ratio));
  const targetHeight = Math.max(1, Math.round(height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process image. Please try a different photo.");
  }

  draw(context, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

type DecodedImage = {
  width: number;
  height: number;
  draw: (context: CanvasRenderingContext2D, targetWidth: number, targetHeight: number) => void;
};

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (context, targetWidth, targetHeight) => {
          context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
          bitmap.close();
        },
      };
    } catch {
      // Some mobile browsers fail createImageBitmap for camera photos; fallback below.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Image decode failed."));
      element.src = objectUrl;
    });

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      draw: (context, targetWidth, targetHeight) => {
        context.drawImage(image, 0, 0, targetWidth, targetHeight);
      },
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}


