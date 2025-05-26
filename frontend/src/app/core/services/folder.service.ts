import {inject, Injectable} from '@angular/core';
import {Folder, FolderApiRequest, FolderApiResponse, FolderRequest} from '../models/folder.interface';
import {Guid} from 'guid-typescript';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  apiUrl = `${environment.apiUrl}/folders`

  private http = inject(HttpClient);

  mapResult(response: FolderApiResponse): Folder {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      parentId: response.parent_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      children: []
    };
  }

  mapResults(response: FolderApiResponse[]): Folder[] {
    return response.map((item: FolderApiResponse) => {
      return this.mapResult(item);
    });
  }

  buildTree(flat: Folder[]): Folder[] {
    const idFolderMap = new Map<Guid , Folder>();
    const roots: Folder[] = [];

    flat.forEach(folder => {
      folder.children = [];
      idFolderMap.set(folder.id, folder);
    })

    flat.forEach(folder => {
      if(folder.parentId) {
        const parent = idFolderMap.get(folder.parentId);

        if(parent) {
          parent.children!.push(folder);
        }
      }
      else {
        roots.push(folder);
      }
    });

    return roots;
  }

  getDetailedUrl(value: any): string {
    return `${this.apiUrl}/${value}/`;
  }

  getTree(): Observable<Folder[]> {
    return this.getAllFolders().pipe(
      map((response) => {
        return this.buildTree(response)
      }
      )
    );
  }

  // #REGION Api methods
  create(folder: FolderRequest): Observable<Folder> {
    const requestData: FolderApiRequest = {
      title: folder.title,
      description: folder.description,
      parent_id: folder.parentId,
    }

    return this.http.post<FolderApiResponse>(
      this.apiUrl + '/', requestData
    ).pipe(
      map((response) => this.mapResult(response))
    )
  }

  update(id: Guid, folder: FolderRequest): Observable<Folder> {
    const requestData: FolderApiRequest = {
      title: folder.title,
      description: folder.description,
      parent_id: folder.parentId
    }

    return this.http.patch<Folder>(this.getDetailedUrl(id), requestData)
      .pipe(
        map((response) => this.mapResult(response))
      )
  }

  delete(folderId: Guid): Observable<any> {
    return this.http.delete(
      this.getDetailedUrl(folderId)
    )
  }

  getAllFolders(): Observable<Folder[]> {
    return this.http.get<FolderApiResponse[]>(this.apiUrl)
      .pipe(
        map(response => this.mapResults(response))
      )
  }

  getRootFolders(): Observable<Folder[]> {
    return this.http.get<FolderApiResponse[]>(this.apiUrl + `/roots`)
      .pipe(
        map(response => {
          return this.mapResults(response);
        }))
  }

}
