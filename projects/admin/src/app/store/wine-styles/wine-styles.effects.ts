import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, filter, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';
import {AppState} from '../index';
import {FeedbackService} from '../../core/services/api/feedback.service';
import {
  ADD_WINE_STYLE,
  ADD_WINE_STYLE_DONE,
  ADD_WINE_STYLE_FAILED,
  DELETE_WINE_STYLE,
  DELETE_WINE_STYLE_DONE,
  DELETE_WINE_STYLE_FAILED,
  REQUEST_ALL_WINE_STYLES,
  REQUEST_ALL_WINE_STYLES_DONE,
  REQUEST_ALL_WINE_STYLES_FAILED,
  UPDATE_WINE_STYLE,
  UPDATE_WINE_STYLE_DONE,
  UPDATE_WINE_STYLE_FAILED
} from './wine-styles.actions';
import {selectAllWineStylesLoaded} from './wine-styles.selectors';
import {WineStyleService} from '../../core/services/api/wine-style.service';

@Injectable()
export class WineStylesEffects {

  fetchAllWines$ = createEffect(() => this.actions$.pipe(
    ofType(REQUEST_ALL_WINE_STYLES),
    withLatestFrom(this.store.pipe(select(selectAllWineStylesLoaded))),
    filter(([action, allStylesLoaded]) => !allStylesLoaded),
    mergeMap(() => this.wineStyleService.all()
      .pipe(
        map((styles) => REQUEST_ALL_WINE_STYLES_DONE({styles})),
        catchError(() => {
          this.feedbackService.errorAction('recuperar', true);
          return of(REQUEST_ALL_WINE_STYLES_FAILED());
        })
      ),
    )
  ));

  newWineStyle$ = createEffect(() => this.actions$.pipe(
    ofType(ADD_WINE_STYLE),
    mergeMap((action) => this.wineStyleService.create(action.style)
      .pipe(
        map((style) => {
          this.feedbackService.createSuccess('Estilo de Vinho');
          return ADD_WINE_STYLE_DONE({style});
        }),
        catchError((e) => {
          this.feedbackService.errorAction('criar');
          return of(ADD_WINE_STYLE_FAILED);
        })
      ),
    )
  ));

  deleteWineStyle$ = createEffect(() => this.actions$.pipe(
    ofType(DELETE_WINE_STYLE),
    mergeMap((action) => this.wineStyleService.destroy(action.id)
      .pipe(
        map((res) => {
          this.feedbackService.destroyItemSuccess('Estilo de Vinho');
          return DELETE_WINE_STYLE_DONE({id: res.id});
        }),
        catchError((err) => {
          this.feedbackService.errorAction('remover');
          return of(DELETE_WINE_STYLE_FAILED());
        })
      ),
    )
  ));

  updateWineStyle$ = createEffect(() => this.actions$.pipe(
    ofType(UPDATE_WINE_STYLE),
    mergeMap((action) => this.wineStyleService.update(action.style)
      .pipe(
        map((beerStyle) => {
          this.feedbackService.updateSuccess('Estilo de Vinho');
          return UPDATE_WINE_STYLE_DONE({style: beerStyle});
        }),
        catchError((e) => {
          this.feedbackService.errorAction('atualizar');
          return of(UPDATE_WINE_STYLE_FAILED());
        })
      ),
    )
  ));

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private feedbackService: FeedbackService,
              private wineStyleService: WineStyleService) {
  }
}
