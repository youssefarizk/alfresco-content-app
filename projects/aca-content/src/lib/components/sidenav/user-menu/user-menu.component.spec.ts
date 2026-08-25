/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { UserMenuComponent } from './user-menu.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Store } from '@ngrx/store';
import { SetUserProfileAction } from '@alfresco/aca-shared/store';
import { ContentActionType } from '@alfresco/adf-extensions';
import { Person } from '@alfresco/js-api';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, UserMenuComponent]
    });

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    component.data = { items: [] };
  });

  it('should render the initials of the user profile', async () => {
    store.dispatch(
      new SetUserProfileAction({
        person: { id: 'user1', firstName: 'John', lastName: 'Doe' } as Person,
        groups: []
      })
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="app-user-menu-button"]');
    expect(button.textContent.trim()).toBe('JD');
  });

  it('should sort the menu items by order on init', () => {
    component.data = {
      items: [
        { id: 'item-3', order: 300 },
        { id: 'item-1', order: 100 },
        { id: 'item-2', order: 200 }
      ]
    };

    component.ngOnInit();

    expect(component.data.items.map((item) => item.id)).toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('should render the menu items when the menu is opened', async () => {
    component.data = {
      items: [
        { id: 'item-2', order: 200, type: ContentActionType.button, title: 'item-2' },
        { id: 'item-1', order: 100, type: ContentActionType.button, title: 'item-1' }
      ]
    };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.body.querySelector('[id="item-1"]')).toBeNull();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-automation-id="app-user-menu-button"]');
    button.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const menuItems = Array.from(document.body.querySelectorAll('.mat-menu-panel [id]')).map((item) => item.id);
    expect(menuItems).toEqual(['item-1', 'item-2']);
  });
});
