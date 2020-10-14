import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Drink} from '../../core/models/drink';
import {Action, createReducer, on} from '@ngrx/store';
import {
  CREATE_DRINK,
  CREATE_DRINK_DONE,
  CREATE_DRINK_FAILED,
  REMOVE_DRINK,
  REMOVE_DRINK_DONE,
  REMOVE_DRINK_FAILED,
  REQUEST_ALL_DRINKS,
  REQUEST_ALL_DRINKS_DONE,
  REQUEST_ALL_DRINKS_FAILED,
  REQUEST_DRINK,
  REQUEST_DRINK_DONE,
  REQUEST_DRINK_FAILED,
  UPDATE_DRINK,
  UPDATE_DRINK_DONE,
  UPDATE_DRINK_FAILED
} from './drink.actions';

export const featureKey = 'drinks';

export interface DrinkState extends EntityState<Drink> {
  loaded: boolean;
  loading: boolean;
}

const adapter: EntityAdapter<Drink> = createEntityAdapter<Drink>();

export const {
  selectEntities,
  selectTotal,
  selectIds,
  selectAll
} = adapter.getSelectors();

const initialState: DrinkState = adapter.getInitialState({
  loaded: false,
  loading: false
});


const drinkReducer = createReducer(initialState,
  on(REQUEST_ALL_DRINKS,
    REQUEST_DRINK,
    REMOVE_DRINK,
    UPDATE_DRINK,
    CREATE_DRINK,
    (state) => ({...state, loading: true})
  ),
  on(REQUEST_ALL_DRINKS_FAILED,
    REQUEST_DRINK_FAILED,
    REMOVE_DRINK_FAILED,
    UPDATE_DRINK_FAILED,
    CREATE_DRINK_FAILED,
    (state) => ({...state, loading: false})
  ),
  on(CREATE_DRINK_DONE, (state, {drink}) => adapter.addOne(drink, {...state, loading: false})),
  on(REMOVE_DRINK_DONE, (state, {id}) => adapter.removeOne(id.toString(), {...state, loading: false})),
  on(REQUEST_ALL_DRINKS_DONE, (state, {drinks}) => adapter.addMany(drinks, {...state, loading: false})),
  on(REQUEST_DRINK_DONE, (state, {drink}) => adapter.addOne(drink, {...state, loading: false})),
  on(UPDATE_DRINK_DONE, (state, {drink}) => adapter.upsertOne(drink, {...state, loading: false})),
);

export function reducer(state: DrinkState | undefined, action: Action) {
  return drinkReducer(state, action);
}
