import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel-dialog',
  templateUrl: './confirm-cancel-dialog.component.html',
  styleUrls: ['./confirm-cancel-dialog.component.scss'],
})
export class ConfirmCancelDialogComponent implements OnInit {

  private answer: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public content: string,
              public dialogRef: MatDialogRef<ConfirmCancelDialogComponent>,
              public dialog: MatDialog) {
    this.dialogRef.beforeClosed().subscribe(() => { this.dialogRef.close(this.answer); });
  }

  getAnswer(): boolean {
    return this.answer;
  }

  ngOnInit(): void {
    this.answer = false;
  }

  confirm(): void {
    this.answer = true;
  }

  close(): void {
    this.dialogRef.close();
  }

}
