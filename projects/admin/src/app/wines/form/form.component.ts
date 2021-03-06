import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {Maker} from '../../core/models/maker';
import {selectAllMakers, selectMakersFilteredByName} from '../../store/makers/makers.selectors';
import {AppState} from '../../store';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MakersFormDialogComponent} from '../../makers/makers-form-dialog/makers-form-dialog.component';
import {REQUEST_ALL_MAKERS} from '../../store/makers/makers.actions';
import {Wine} from '../../core/models/wine';
import {WineStyle} from '../../core/models/wine-style';
import {
  selectAllWineStyles,
  selectWineStyleByName,
  selectWineStylesFilteredByName
} from '../../store/wine-styles/wine-styles.selectors';
import {REQUEST_ALL_WINE_STYLES} from '../../store/wine-styles/wine-styles.actions';
import {CREATE_WINE, UPDATE_WINE} from '../../store/wines/wines.actions';
import {WineStylesFormDialogComponent} from '../../wine-styles/wine-styles-form-dialog/wine-styles-form-dialog.component';
import {canCreateMakers, canCreateWineStyles} from '../../store/auth/auth.selectors';
import {BaseDialogParams} from '../../core/models/base.model';
import {selectWinesLoading} from '../../store/wines/wines.selectors';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  form: FormGroup = this.mountForm();
  wineStyles$: Observable<WineStyle[]> = this.store.pipe(select(selectAllWineStyles));
  makers$: Observable<Maker[]> = this.store.pipe(select(selectAllMakers));
  readonly canCreateWineStyle$ = this.store.pipe(select(canCreateWineStyles));
  readonly canCreateMaker$ = this.store.pipe(select(canCreateMakers));
  readonly loading$: Observable<boolean> = this.store.pipe(select(selectWinesLoading));

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<FormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BaseDialogParams<Wine>,
              private store: Store<AppState>,
              private changeDetectorRefs: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.dispatch(REQUEST_ALL_MAKERS({page: '1'}));
    this.store.dispatch(REQUEST_ALL_WINE_STYLES({page: '1'}));
    this.updateForm();
    this.form.controls.maker.valueChanges.subscribe(((value: Maker) => {
      this.makers$ = this.store.pipe(select(selectMakersFilteredByName(value.name)));
      this.changeDetectorRefs.detectChanges();
    }));
    this.form.controls.wine_style.valueChanges.subscribe(((value: WineStyle) => {
      this.wineStyles$ = this.store.pipe(select(selectWineStylesFilteredByName(value.name)));
      this.changeDetectorRefs.detectChanges();
    }));
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      const wine = this.mountData();
      if (wine.id) {
        this.store.dispatch(UPDATE_WINE({wine}));
      } else {
        this.store.dispatch(CREATE_WINE({wine}));
      }
      this.dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  openDialogWineStyle() {
    this.dialog.open(WineStylesFormDialogComponent, {
      disableClose: true,
    });
  }

  displayFn(data: Maker | WineStyle): string {
    return data?.name || '';
  }

  openDialogAddMaker() {
    this.dialog.open(MakersFormDialogComponent);
  }

  compareSelectValues(val1: WineStyle | Maker, val2: WineStyle | Maker) {
    if (!val1 || !val2) {
      return false;
    }

    return val1.id === val2.id;
  }

  onCancel() {
    this.dialogRef.close();
  }

  private filterWineStyle(value: string): Observable<WineStyle[]> {
    return this.store.pipe(select(selectWineStyleByName(value.toLocaleLowerCase())));
  }

  private updateForm() {
    if (this.data?.data) {
      const {
        name, abv, price_cents, description, wine_style, quantity_stock,
        maker, grapes, ripening, vintage_wine, visual
      } = this.data.data;
      const cents = price_cents || 0;
      this.form.patchValue({
        name, price: cents / 100, wine_style,
        maker, abv, quantity_stock, description,
        grapes, ripening, vintage_wine, visual
      });
      if (this.data.disabled) {
        this.form.disable();
      }
    }
  }

  private mountForm(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      wine_style: [null, Validators.required],
      maker: [null, Validators.required],
      abv: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)]
      ],
      description: [null],
      quantity_stock: [null, Validators.required],
      grapes: [null, Validators.required],
      ripening: [null, Validators.required],
      vintage_wine: [null, Validators.required],
      visual: [null, Validators.required],
    });
  }

  private mountData(): Wine {
    const value = this.form.value;
    return {
      name: value.name,
      description: value.description,
      price: value.price,
      wine_style_id: value.wine_style.id,
      wine_style: value.wine_style,
      maker_id: value.maker.id,
      maker: value.maker,
      abv: value.abv,
      quantity_stock: value.quantity_stock,
      vintage_wine: value.vintage_wine,
      visual: value.visual,
      ripening: value.ripening,
      grapes: value.grapes,
      id: this.data?.data?.id,
    };
  }
}
