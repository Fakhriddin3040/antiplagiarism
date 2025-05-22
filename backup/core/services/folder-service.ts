@Injectable({ providedIn: 'root' })
export class FolderService {
  private folders: Folder[] = [
    { id: 1, name: 'Все документы', parentId: null },
    { id: 2, name: 'Проекты', parentId: 1 },
    { id: 3, name: 'Отчеты', parentId: 1 },
    { id: 4, name: 'Черновики', parentId: 1 },
    { id: 5, name: 'Проект A', parentId: 2 },
    // ... и т.д.
  ];

  constructor(private http: HttpClient) {}

  getFolderTree(): Observable<Folder[]> {
    // В реальности: return this.http.get<Folder[]>(`/api/folders/tree`);
    // Мок-реализация:
    const rootFolders = this.folders.filter(f => f.parentId === null);
    // построить дерево рекурсивно
    rootFolders.forEach(root => this.attachChildren(root));
    return of(rootFolders);
  }

  private attachChildren(folder: Folder) {
    const children = this.folders.filter(f => f.parentId === folder.id);
    if (children.length) {
      folder.children = children;
      folder.children.forEach(child => this.attachChildren(child));
    }
  }
}
