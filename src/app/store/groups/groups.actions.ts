import { Group } from '@core/models/group.model';
import { createAction, props } from '@ngrx/store';

export const loadGroups = createAction('[Groups] Load Groups');

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: Group[] }>()
);

export const loadGroupsFailure = createAction(
  '[Groups] Load Groups Failure',
  props<{ error: any }>()
);

export const createGroup = createAction(
  '[Groups] Create Group',
  props<{ group: Omit<Group, 'id'> }>()
);

export const createGroupSuccess = createAction(
  '[Groups] Create Group Success',
  props<{ group: Group }>()
);

export const createGroupFailure = createAction(
  '[Groups] Create Group Failure',
  props<{ error: any }>()
);
