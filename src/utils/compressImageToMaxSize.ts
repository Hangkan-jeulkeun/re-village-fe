const JPEG_MIME_TYPE = 'image/jpeg';
const PNG_MIME_TYPE = 'image/png';

function renameToJpeg(fileName: string): string {
  return fileName.replace(/\.[^.]+$/u, '') + '.jpg';
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지를 불러오지 못했습니다.'));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지를 변환하지 못했습니다.'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export async function compressImageToMaxSize(
  file: File,
  maxBytes: number,
): Promise<File> {
  if (file.size <= maxBytes) {
    return file;
  }

  if (file.type !== JPEG_MIME_TYPE && file.type !== PNG_MIME_TYPE) {
    throw new Error('지원하지 않는 이미지 형식입니다.');
  }

  const image = await loadImage(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('이미지 압축을 위한 캔버스를 만들지 못했습니다.');
  }

  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const mimeType = file.type === PNG_MIME_TYPE ? JPEG_MIME_TYPE : file.type;
  let quality = 0.9;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (mimeType === JPEG_MIME_TYPE) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, mimeType, quality);

    if (blob.size <= maxBytes) {
      const outputName =
        mimeType === JPEG_MIME_TYPE ? renameToJpeg(file.name) : file.name;

      return new File([blob], outputName, {
        type: mimeType,
        lastModified: Date.now(),
      });
    }

    if (quality > 0.55) {
      quality -= 0.12;
    } else {
      width *= 0.85;
      height *= 0.85;
      quality = 0.82;
    }
  }

  throw new Error('10MB 이하로 자동 조절하지 못했습니다.');
}
