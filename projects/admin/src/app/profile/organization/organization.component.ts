import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../core/models/user';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {ActivatedRoute} from '@angular/router';
import {UPDATE_USER} from '../../store/auth/auth.actions';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements AfterViewInit {

  form: FormGroup = this.mountForm();
  user: User = this.activatedRoute.snapshot.data.user;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private store: Store<AppState>) {
  }

  ngAfterViewInit(): void {
    this.user = this.activatedRoute.snapshot.data.user;
    this.updateForm();
  }

  onSubmit() {
    if (this.form.valid) {
      const user: User = this.form.value;
      this.store.dispatch(UPDATE_USER({user}));
    } else {
      this.form.markAllAsTouched();
    }
  }

  private mountForm(): FormGroup {
    return this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      company_name: [null, Validators.required],
      cnpj: [null, Validators.required],
    });
  }

  private updateForm() {
    console.log(this.activatedRoute.snapshot.data);
    this.form.patchValue({
      name: this.user?.name,
      email: this.user?.email,
      company_name: this.user?.organization?.name,
      cnpj: this.user?.organization?.cnpj
    });
  }
}