import JSZip from 'jszip';
import type { SourceFileDescriptor } from '@/types';

export const exportAsZip = async (files: SourceFileDescriptor[]) => {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.path, file.content);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'personal-yourware-source.zip';
  link.click();
  URL.revokeObjectURL(url);
};
