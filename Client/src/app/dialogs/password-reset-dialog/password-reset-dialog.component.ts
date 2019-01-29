import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'password-reset-dialog.component',
  templateUrl: './password-reset-dialog.component.html',
})
export class PasswordResetDialog {

  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialog>,
    @Inject(MAT_DIALOG_DATA) public data: String) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}