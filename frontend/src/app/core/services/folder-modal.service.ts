import {inject, Injectable, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class FolderModalService implements OnInit {
  private modalService = inject(NgbModal);

  ngOnInit(): void {

  }
}
