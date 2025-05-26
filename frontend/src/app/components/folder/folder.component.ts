import { Component } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Folder} from '../../core/models/folder.interface';
import {Document} from '../../core/models/document.interface';

@Component({
  selector: 'app-folder',
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {
  treeControll = new NestedTreeControl<Folder | Document>(node =>

  )
}
