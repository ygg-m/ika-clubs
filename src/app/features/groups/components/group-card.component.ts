import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Group } from '@core/models/group.model';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center mb-4">
        <img
          [src]="group.iconUrl || '/assets/default-group.png'"
          [alt]="group.name"
          class="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 class="text-xl font-semibold">{{ group.name }}</h2>
          <p class="text-gray-600">{{ group.members.length }} members</p>
        </div>
      </div>

      <p class="text-gray-700 mb-4">{{ group.description }}</p>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">
          {{ group.isPrivate ? 'Private' : 'Public' }}
        </span>
        <a
          [routerLink]="['/groups', group.id]"
          class="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          View Details
        </a>
      </div>
    </div>
  `,
})
export class GroupCardComponent {
  @Input({ required: true }) group!: Group;
}
