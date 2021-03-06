import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromBeers from './beers.reducer';
import {compare} from '../../shared/util/util';

export const selectBeersState = createFeatureSelector<fromBeers.BeerState>(fromBeers.featureKey);

export const selectAllBeers = createSelector(
  selectBeersState,
  fromBeers.selectAll
);

export const selectBeerById = (id: number) => createSelector(
  selectBeersState,
  (beers) => beers.entities[id]
);

export const selectAllBeersOrderedByName = (isAsc: boolean) => createSelector(
  selectAllBeers,
  (beers) => beers.sort((a, b) => compare(a.name, b.name, isAsc))
);

export const selectAllBeersOrderedById = (isAsc: boolean) => createSelector(
  selectAllBeers,
  (beers) => beers.sort((a, b) => compare(a.id, b.id, isAsc))
);

export const selectAllBeersOrderedByPrice = (isAsc: boolean) => createSelector(
  selectAllBeers,
  (beers) => beers.sort((a, b) => compare(a.price, b.price, isAsc))
);

export const selectAllBeersOrderedByStyle = (isAsc: boolean) => createSelector(
  selectAllBeers,
  (beers) => beers.sort((a, b) => compare(a.beer_style?.name, b.beer_style?.name, isAsc))
);

export const selectAllBeersLoaded = createSelector(
  selectBeersState,
  (state) => state.loaded
);

export const selectBeerLoading = createSelector(
  selectBeersState,
  (state) => state.loading
);
