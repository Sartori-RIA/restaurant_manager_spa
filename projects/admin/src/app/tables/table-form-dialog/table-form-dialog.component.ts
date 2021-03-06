import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {AppState} from '../../store';
import {Table} from '../../core/models/table';
import {CREATE_TABLE, UPDATE_TABLE} from '../../store/tables/table.actions';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {selectTablesLoading} from '../../store/tables/table.selectors';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form-dialog.component.html',
  styleUrls: ['./table-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFormDialogComponent implements OnInit {

  form: FormGroup = this.mountForm();
  readonly loading$: Observable<boolean> = this.store.pipe(select(selectTablesLoading));

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AppState>,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<TableFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Table) {
  }

  ngOnInit() {
    this.updateForm();
  }

  mountForm(): FormGroup {
   return this.fb.group({
      name: [null, Validators.required],
      chairs: [null, [Validators.required,
        Validators.min(0),
        Validators.max(100)]
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.mountData();
      if (data.id) {
        this.store.dispatch(UPDATE_TABLE({table: data}));
      } else {
        this.store.dispatch(CREATE_TABLE({table: data}));
      }
      this.dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private updateForm() {
    this.form.patchValue({
      name: this.data?.name,
      chairs: this.data?.chairs,
    });
  }

  private mountData(): Table {
    const value = this.form.value;
    return {
      ...this.data,
      name: value.name,
      chairs: value.chairs
    };
  }

}
