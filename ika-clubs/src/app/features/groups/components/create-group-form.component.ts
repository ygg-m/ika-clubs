import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-create-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="groupForm"
      (ngSubmit)="onSubmit()"
      class="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div class="space-y-4">
        <!-- Name Field -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Group Name*
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="isFieldInvalid('name')"
          />
          <div *ngIf="isFieldInvalid('name')" class="text-red-500 text-sm mt-1">
            Group name is required
          </div>
        </div>

        <!-- Description Field -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description*
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="isFieldInvalid('description')"
          ></textarea>
          <div
            *ngIf="isFieldInvalid('description')"
            class="text-red-500 text-sm mt-1"
          >
            Description is required
          </div>
        </div>

        <!-- Icon URL Field -->
        <div>
          <label
            for="iconUrl"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Icon URL
          </label>
          <input
            id="iconUrl"
            type="text"
            formControlName="iconUrl"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Privacy Toggle -->
        <div class="flex items-center space-x-2">
          <input
            id="isPrivate"
            type="checkbox"
            formControlName="isPrivate"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="isPrivate" class="text-sm font-medium text-gray-700">
            Make this group private
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            [disabled]="groupForm.invalid || isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Group' }}
          </button>
        </div>
      </div>
    </form>
  `,
})
export class CreateGroupFormComponent {
  @Output() groupCreated = new EventEmitter<Omit<Group, 'id'>>();

  groupForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      iconUrl: [''],
      isPrivate: [false],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.groupForm.valid) {
      this.isSubmitting = true;

      const now = new Date();
      const newGroup = {
        ...this.groupForm.value,
        members: [], // Initialize with empty members array
        clubs: [], // Initialize with empty clubs array
        uniqueId: this.generateUniqueId(), // Generate unique ID for private groups
        createdAt: now,
        updatedAt: now,
      };

      this.groupCreated.emit(newGroup);
      this.groupForm.reset({
        name: '',
        description: '',
        iconUrl: '',
        isPrivate: false,
      });
      this.isSubmitting = false;
    } else {
      Object.keys(this.groupForm.controls).forEach((key) => {
        const control = this.groupForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  private generateUniqueId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
