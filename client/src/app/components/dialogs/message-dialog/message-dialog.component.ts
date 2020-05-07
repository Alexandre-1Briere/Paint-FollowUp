import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
})
export class MessageDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public content: {width: string, content: string },
              public dialogRef: MatDialogRef<MessageDialogComponent>,
              public dialog: MatDialog) {
    this.dialogRef.beforeClosed().subscribe( () => {
      dialogRef.close();
    });
  }

  ngOnInit(): void { return; }

  close(): void {
    this.dialogRef.close();
  }

}
