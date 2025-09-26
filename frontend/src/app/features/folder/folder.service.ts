import {map, Observable} from 'rxjs';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FolderServiceInterface} from '../../core/features/folder/folder.service.interface';
import { EnvironmentHelper } from '../../helpers/environment/environment.helper';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';
import {CreateFolderDto, Folder, ShortFolderDto, UpdateFolderDto} from '../../core/features/folder/types/folder.types';
import {Query} from '../../components/data-table/types/table';
import {HttpQueryParser} from '../../core/http/helpers/http-query.parser';


export class FolderService implements FolderServiceInterface {
  private httpClient = inject(HttpClient);
  private listUrl = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.FOLDERS, false);
  private baseUrl = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.FOLDERS, true);

  private makeDetailUrl(id: string): string {
    return `${this.baseUrl}${id.toString()}/`;
  }

  getAll(): Observable<Folder[]> {
    return this.httpClient.get<Folder[]>(this.listUrl);
  }

  shortList(query: Query): Observable<ShortFolderDto[]> {
    const params = query ? HttpQueryParser.makeParams(query) : undefined;
    return this.httpClient.get<ShortFolderDto[]>(
      this.listUrl, { params }
    )
  }

  create(item: CreateFolderDto): Observable<Folder> {
    return this.httpClient.post<Folder>(this.baseUrl, item);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(this.makeDetailUrl(id));
  }

  getChildren(id: string): Observable<Folder[]> {
    return this.httpClient.get<Folder>(this.makeDetailUrl(id)).pipe(
        map((result: Folder) => result.children)
    )
  }

  getRoots(): Observable<Folder[]> {
    return this.httpClient.get<Folder[]>(EnvironmentHelper.makeApiUrl(ApiEndpointEnum.FOLDERS_ROOTS, false))
  }

  update(id: string, item: UpdateFolderDto): Observable<void> {
    return this.httpClient.patch<void>(this.makeDetailUrl(id), item);
  }

  buildTree(
    folders: Folder[],
    opts?: { sort?: (a: Folder, b: Folder) => number }
  ): Folder[] {
    const gid = (g: string | string | null | undefined) => g ? g.toString() : null;

    const sort = opts?.sort ?? ((a, b) => a.title.localeCompare(b.title, 'ru'));

    const clones: Folder[] = folders.map(f => ({
      ...f,
      children: []
    }));

    const byId = new Map<string, Folder>();
    for (const f of clones) byId.set(gid(f.id)!, f);

    const buckets = new Map<string | null, Folder[]>();
    buckets.set(null, []);

    for (const node of clones) {
      const pid = gid(node.parentId);
      const parentKey = pid && byId.has(pid) ? pid : null; // сироты → в корень
      if (!buckets.has(parentKey)) buckets.set(parentKey, []);
      buckets.get(parentKey)!.push(node);
    }

    for (const [pid, group] of buckets.entries()) {
      group.sort(sort);
      if (pid && byId.has(pid)) {
        byId.get(pid)!.children = group;
      }
    }
    return (buckets.get(null) ?? []).sort(sort);
  }

  getTree(opts?: { sort?: (a: Folder, b: Folder) => number }): Observable<Folder[]> {
    return this.getAll().pipe(
      map(folders => this.buildTree(folders, opts))
    );
  }
}
