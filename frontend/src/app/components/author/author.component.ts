// import {Component, inject} from '@angular/core';
// import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import {AuthorModalComponent} from './author-modal/author-modal.component';
//
// @Component({
//   selector: 'app-author',
//   standalone: true,
//   imports: [],
//   templateUrl: './author.component.html',
//   styleUrl: './author.component.scss'
// })
// export class AuthorComponent {
//   modalService = inject(NgbModal);
//
//   onClick(): void {
//     const modalRef = this.modalService.open(AuthorModalComponent, {
//       backdrop:'static',
//       keyboard: false,
//       centered: true
//     });
//
//     modalRef.componentInstance.actionType = "Создать Автора";
//
//     modalRef.result
//       .then((result) => {
//         console.log(`Closed with: ${result}`);
//       })
//       .catch((reason) => {
//         console.log(`Dismissed with: ${reason}`);
//       });
//   }
// }
