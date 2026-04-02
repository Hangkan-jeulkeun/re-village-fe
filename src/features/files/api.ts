import { apiClient } from '@/lib/apiClient';

export interface UploadFileRequest {
  file: File;
  name: string;
  phone: string;
  refType?: string;
  refId?: string;
}

export const filesApi = {
  upload: ({ file, name, phone, refType, refId }: UploadFileRequest) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('phone', phone);
    if (refType !== undefined) formData.append('refType', refType);
    if (refId !== undefined) formData.append('refId', refId);
    // multipart/form-data: File 객체 포함으로 FormData 직접 전달
    return apiClient.POST('/api/v1/files/upload', { body: formData as never });
  },
};
