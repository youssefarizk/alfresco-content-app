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
import { UserInfoComponent } from './user-info.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

describe('UserInfoComponent', () => {
  let fixture: ComponentFixture<UserInfoComponent>;
  let user$: BehaviorSubject<any>;

  const getUserInfo = (): HTMLElement => fixture.nativeElement.querySelector('.aca-user-info');
  const getDetails = (): string[] =>
    Array.from(getUserInfo().querySelectorAll<HTMLElement>('.aca-user-info-details div')).map((element) => element.textContent.trim());

  beforeEach(() => {
    user$ = new BehaviorSubject<any>({
      initials: 'JD',
      userName: 'john.doe',
      email: 'john.doe@alfresco.com'
    });

    TestBed.configureTestingModule({
      imports: [AppTestingModule, UserInfoComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => user$,
            dispatch: jasmine.createSpy('dispatch')
          }
        }
      ]
    });

    fixture = TestBed.createComponent(UserInfoComponent);
    fixture.detectChanges();
  });

  it('should render user initials, name and email from the store profile', () => {
    expect(getUserInfo().querySelector('.aca-user-info-button').textContent.trim()).toBe('JD');
    expect(getDetails()).toEqual(['john.doe', 'john.doe@alfresco.com']);
  });

  it('should fall back to default initial when user has no initials', () => {
    user$.next({ initials: '', userName: 'john.doe', email: 'john.doe@alfresco.com' });
    fixture.detectChanges();

    expect(getUserInfo().querySelector('.aca-user-info-button').textContent.trim()).toBe('U');
  });

  it('should not render user details when profile is not available', () => {
    user$.next(null);
    fixture.detectChanges();

    expect(getUserInfo().querySelector('.aca-user-info-button')).toBeNull();
    expect(getUserInfo().querySelector('.aca-user-info-details')).toBeNull();
  });

  it('should link to the profile route and show tooltip title', () => {
    const routerLink = fixture.debugElement.query(By.directive(RouterLink)).injector.get(RouterLink);

    expect(routerLink.urlTree.toString()).toBe('/profile');
    expect(getUserInfo().getAttribute('title')).toBe('APP.TOOLTIPS.MY_PROFILE');
  });
});
