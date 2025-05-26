import {Guid} from 'guid-typescript';
import {Folder} from '../../core/models/folder.interface';

export function findFolderInTree(folders: Folder[], folderId: Guid): Folder | null {
  for(const folder of folders) {
    if(folder.id === folderId) {
      return folder;
    }

    if(folder.children) {
      const found = findFolderInTree(folder.children, folderId);

      if(found) {
        return folder;
      }

    }
  }
  return null;
}
