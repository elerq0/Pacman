import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'info-dialog.component',
  templateUrl: './info-dialog.component.html',
})
export class InfoDialog {

  constructor(
    @Optional() public dialogRef: MatDialogRef<InfoDialog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: String) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
