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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { LanguagePickerComponent } from './language-picker.component';
import { By } from '@angular/platform-browser';
import { MatMenu } from '@angular/material/menu';

describe('LanguagePickerComponent', () => {
  let fixture: ComponentFixture<LanguagePickerComponent>;

  const getTriggerButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button[mat-menu-item]');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LanguagePickerComponent]
    });

    fixture = TestBed.createComponent(LanguagePickerComponent);
    fixture.detectChanges();
  });

  it('should render menu item with language icon and translated label', () => {
    const button = getTriggerButton();

    expect(button.querySelector('mat-icon').textContent.trim()).toBe('language');
    expect(button.textContent).toContain('APP.LANGUAGE');
  });

  it('should not render the language menu until the trigger is clicked', () => {
    expect(document.querySelector('adf-language-menu')).toBeNull();
  });

  it('should open menu with adf-language-menu on trigger click', () => {
    getTriggerButton().click();
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.directive(MatMenu)).componentInstance as MatMenu;

    expect(menu).toBeTruthy();
    expect(document.querySelector('.mat-menu-panel adf-language-menu')).not.toBeNull();
  });
});
