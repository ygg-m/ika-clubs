import { Injectable } from '@angular/core';
import { GroupsService } from '@core/services/groups.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as GroupsActions from './groups.actions';

@Injectable()
export class GroupsEffects {
  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.loadGroups),
      mergeMap(() =>
        this.groupsService.getGroups().pipe(
          map((groups) => GroupsActions.loadGroupsSuccess({ groups })),
          catchError((error) => of(GroupsActions.loadGroupsFailure({ error })))
        )
      )
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.createGroup),
      mergeMap(({ group }) =>
        this.groupsService.createGroup(group).pipe(
          map((createdGroup) =>
            GroupsActions.createGroupSuccess({ group: createdGroup })
          ),
          catchError((error) => of(GroupsActions.createGroupFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private groupsService: GroupsService
  ) {}
}
