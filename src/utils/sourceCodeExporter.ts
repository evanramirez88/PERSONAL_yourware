import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { SourceFile } from '@/types';

export async function exportSourceAsZip(files: SourceFile[], archiveName = 'yourware-source.zip') {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, archiveName);
}

export function createSourceFileMap(files: SourceFile[]): Record<string, string> {
  return files.reduce<Record<string, string>>((acc, file) => {
    acc[file.path] = file.content;
    return acc;
  }, {});
}
