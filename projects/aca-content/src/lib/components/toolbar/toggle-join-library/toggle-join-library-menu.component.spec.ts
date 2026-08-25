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

import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { LibraryMembershipDirective } from '@alfresco/adf-content-services';
import { SetSelectedNodesAction, SnackbarErrorAction, SnackbarInfoAction } from '@alfresco/aca-shared/store';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { ToggleJoinLibraryMenuComponent } from './toggle-join-library-menu.component';

describe('ToggleJoinLibraryMenuComponent', () => {
  let fixture: ComponentFixture<ToggleJoinLibraryMenuComponent>;
  let store: Store<any>;
  let membership: LibraryMembershipDirective;
  let entry;

  const getButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');
  const getLabel = (): string => fixture.nativeElement.querySelector('button > span').textContent.trim();
  const getIcons = (): DebugElement[] => fixture.debugElement.queryAll(By.directive(MatIcon));

  beforeEach(() => {
    entry = {
      id: 'lib-id',
      joinRequested: true,
      title: 'test',
      visibility: 'MODERATED'
    };

    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleJoinLibraryMenuComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => of({ library: { entry, isLibrary: true }, isAdmin: true }),
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ToggleJoinLibraryMenuComponent);
    membership = fixture.debugElement.query(By.directive(LibraryMembershipDirective)).injector.get(LibraryMembershipDirective);
    spyOn(membership, 'markMembershipRequest').and.stub();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render a menu item bound to the library selection and admin profile', () => {
    expect(getButton().classList).toContain('mat-menu-item');
    expect(membership.selection).toEqual({ entry, isLibrary: true } as any);
    expect(membership.isAdmin).toBe(true);
  });

  it('should render the join label and join icon when membership is not requested', () => {
    membership.isJoinRequested.next(false);
    fixture.detectChanges();

    expect(getLabel()).toBe('APP.ACTIONS.JOIN');
    expect(getButton().getAttribute('title')).toBe('APP.ACTIONS.JOIN');

    const icons = getIcons();
    expect(icons.length).toBe(1);
    expect((icons[0].componentInstance as MatIcon).svgIcon).toBe('adf:join_library');
  });

  it('should render the cancel label and cancel icon when membership is requested', () => {
    membership.isJoinRequested.next(true);
    fixture.detectChanges();

    expect(getLabel()).toBe('APP.ACTIONS.CANCEL_JOIN');
    expect(getButton().getAttribute('title')).toBe('APP.ACTIONS.CANCEL_JOIN');

    const icons = getIcons();
    expect(icons.length).toBe(1);
    expect((icons[0].componentInstance as MatIcon).svgIcon).toBeFalsy();
    expect(icons[0].nativeElement.textContent.trim()).toBe('cancel');
  });

  it('should dispatch `SnackbarInfoAction` when the menu item directive emits toggle', () => {
    membership.toggle.emit({ shouldReload: true, i18nKey: 'MENU_i18nKey' });

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarInfoAction('MENU_i18nKey'));
  });

  it('should dispatch `SetSelectedNodesAction` when toggle emits an updated entry without reload', () => {
    const updatedEntry: any = { ...entry, joinRequested: false };
    membership.toggle.emit({ shouldReload: false, i18nKey: 'MENU_i18nKey', updatedEntry });

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([{ entry: updatedEntry, isLibrary: true } as any]));
  });

  it('should dispatch `SnackbarErrorAction` when the menu item directive emits error', () => {
    membership.error.emit({ error: {}, i18nKey: 'MENU_ERROR_i18nKey' });

    expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('MENU_ERROR_i18nKey'));
  });
});
