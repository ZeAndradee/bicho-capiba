export interface ImageUploadResult {
  preview: string;
  file: File;
}
export interface ImageUploadError {
  message: string;
  type: "size" | "format" | "upload" | "unknown";
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateImageFile = (
  file: File
): { valid: boolean; error?: ImageUploadError } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: {
        message: "Formato de arquivo inválido. Use JPG, PNG ou WebP.",
        type: "format",
      },
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: {
        message: "Arquivo muito grande. O tamanho máximo é 5MB.",
        type: "size",
      },
    };
  }

  return { valid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return createImagePreview(file);
};

export const handleImageSelection = async (
  file: File
): Promise<
  | { success: true; data: ImageUploadResult }
  | { success: false; error: ImageUploadError }
> => {
  const validation = validateImageFile(file);

  if (!validation.valid && validation.error) {
    return { success: false, error: validation.error };
  }

  try {
    const preview = await createImagePreview(file);
    return {
      success: true,
      data: {
        preview,
        file,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        message: "Erro ao processar imagem. Tente novamente.",
        type: "unknown",
      },
    };
  }
};

export const revokeImagePreview = (preview: string) => {
  if (preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview);
  }
};

export const createImageFormData = (
  file: File,
  fieldName: string = "avatar"
): FormData => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
};

export const handleMultipleImageSelection = async (
  files: FileList
): Promise<
  | { success: true; data: ImageUploadResult[] }
  | { success: false; error: ImageUploadError }
> => {
  const results: ImageUploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validation = validateImageFile(file);

    if (!validation.valid && validation.error) {
      return { success: false, error: validation.error };
    }

    try {
      const preview = await createImagePreview(file);
      results.push({
        preview,
        file,
      });
    } catch {
      return {
        success: false,
        error: {
          message: "Erro ao processar imagem. Tente novamente.",
          type: "unknown",
        },
      };
    }
  }

  return {
    success: true,
    data: results,
  };
};

export const createMultipleImageFormData = (
  files: File[],
  fieldName: string = "images"
): FormData => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  return formData;
};

export const blobToFile = (
  blob: Blob,
  fileName: string,
  mimeType: string = "image/jpeg"
): File => {
  return new File([blob], fileName, { type: mimeType });
};

export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
