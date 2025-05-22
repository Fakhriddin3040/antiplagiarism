import {Component} from '@angular/core';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss']
})
export class FolderTreeComponent implements OnInit {
  dataSource = new MatTreeNestedDataSource<Folder>();
  treeControl = new NestedTreeControl<Folder>(node => node.children);

  constructor(private folderService: FolderService) {}

  hasChild = (_: number, node: Folder) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.folderService.getFolderTree().subscribe(folders => {
      this.dataSource.data = folders;
    });
  }
}
