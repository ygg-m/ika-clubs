import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Group } from '@core/models/group.model';
import { Store } from '@ngrx/store';
import * as GroupsActions from '@store/groups/groups.actions';
import * as GroupsSelectors from '@store/groups/groups.selectors';
import { combineLatest } from 'rxjs';
import { CreateGroupFormComponent } from './create-group-form.component';
import { GroupCardComponent } from './group-card.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    GroupCardComponent,
    CreateGroupFormComponent,
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Groups</h1>
        <button
          (click)="showCreateForm = !showCreateForm"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {{ showCreateForm ? 'Cancel' : 'Create Group' }}
        </button>
      </div>

      <app-create-group-form
        *ngIf="showCreateForm"
        (groupCreated)="onCreateGroup($event)"
      />

      <ng-container *ngIf="viewState$ | async as view">
        <div *ngIf="view.loading" class="text-center py-4">
          Loading groups...
        </div>

        <div *ngIf="view.error" class="text-red-600 mb-4">
          {{ view.error }}
        </div>

        <div
          *ngIf="!view.loading && !view.error"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <app-group-card *ngFor="let group of view.groups" [group]="group" />

          <div
            *ngIf="view.groups.length === 0"
            class="col-span-full text-center py-4 text-gray-500"
          >
            No groups found. Create your first group to get started!
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class GroupListComponent implements OnInit {
  viewState$ = combineLatest({
    groups: this.store.select(GroupsSelectors.selectAllGroups),
    loading: this.store.select(GroupsSelectors.selectGroupsLoading),
    error: this.store.select(GroupsSelectors.selectGroupsError),
  });

  showCreateForm = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(GroupsActions.loadGroups());
  }

  onCreateGroup(group: Omit<Group, 'id'>) {
    this.store.dispatch(GroupsActions.createGroup({ group }));
    this.showCreateForm = false;
  }
}
