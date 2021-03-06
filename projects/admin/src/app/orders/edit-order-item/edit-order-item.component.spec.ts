import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {EditOrderItemComponent} from './edit-order-item.component';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {SharedModule} from '../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {ordersInitialState} from '../../spec-helpers/states/orders.fake-state';
import {drinksInitialState} from '../../spec-helpers/states/drinks.fake-state';
import {beersInitialState} from '../../spec-helpers/states/beers.fake-state';
import {tablesInitialState} from '../../spec-helpers/states/tables.fake-state';
import {dishesInitialState} from '../../spec-helpers/states/dishes.fake-state';
import {winesInitialState} from '../../spec-helpers/states/wines.fake-state';
import {orderItemBeer} from '../../spec-helpers/factories/order-items.factory';
import {NgxTranslateModule} from '../../ngx-translate/ngx-translate.module';
import {authInitialState} from '../../spec-helpers/states/auth.fake-state';

describe('EditOrderItemComponent', () => {
  let component: EditOrderItemComponent;
  let fixture: ComponentFixture<EditOrderItemComponent>;
  let store: MockStore;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            auth: authInitialState,
            orders: ordersInitialState,
            drinks: drinksInitialState,
            beers: beersInitialState,
            table: tablesInitialState,
            dishes: dishesInitialState,
            wines: winesInitialState,
            'order-items': ordersInitialState
          }
        }),
      ],
      declarations: [EditOrderItemComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        TranslateTestingModule,
        NgxTranslateModule
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderItemComponent);
    component = fixture.componentInstance;
    component.item = orderItemBeer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
