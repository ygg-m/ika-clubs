import { Group } from '@core/models/group.model';
import { createReducer, on } from '@ngrx/store';
import * as GroupsActions from './groups.actions';

export interface State {
  groups: Group[];
  loading: boolean;
  error: any;
  selectedGroupId: string | null;
}

export const initialState: State = {
  groups: [],
  loading: false,
  error: null,
  selectedGroupId: null,
};

export const reducer = createReducer(
  initialState,
  // Load Groups
  on(GroupsActions.loadGroups, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GroupsActions.loadGroupsSuccess, (state, { groups }) => ({
    ...state,
    groups,
    loading: false,
    error: null,
  })),
  on(GroupsActions.loadGroupsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Group
  on(GroupsActions.createGroup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GroupsActions.createGroupSuccess, (state, { group }) => ({
    ...state,
    groups: [...state.groups, group],
    loading: false,
    error: null,
  })),
  on(GroupsActions.createGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
