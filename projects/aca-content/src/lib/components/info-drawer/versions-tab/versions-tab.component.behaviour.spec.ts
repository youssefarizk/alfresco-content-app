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

import { VersionsTabComponent } from './versions-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Node } from '@alfresco/js-api';

describe('VersionsTabComponent - behaviour', () => {
  let component: VersionsTabComponent;
  let fixture: ComponentFixture<VersionsTabComponent>;

  const getVersionManager = () => fixture.nativeElement.querySelector('adf-version-manager');
  const getEmptyPlaceholder = () => fixture.nativeElement.querySelector('.adf-manage-versions-empty');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, VersionsTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(VersionsTabComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render version manager for the node when a file is selected', () => {
    component.node = { id: 'file-node-id', isFile: true, isFolder: false } as Node;

    fixture.detectChanges();

    expect(component.isFileSelected).toBe(true);
    expect(getEmptyPlaceholder()).toBeNull();
    expect(getVersionManager()).not.toBeNull();
  });

  it('should render empty placeholder with icon when selection is not a file', () => {
    component.node = { id: 'folder-node-id', isFile: false, isFolder: true } as Node;

    fixture.detectChanges();

    expect(component.isFileSelected).toBe(false);
    expect(getVersionManager()).toBeNull();
    expect(getEmptyPlaceholder()).not.toBeNull();
    expect(getEmptyPlaceholder().querySelector('mat-icon').textContent.trim()).toBe('face');
    expect(getEmptyPlaceholder().textContent).toContain('VERSION.SELECTION.EMPTY');
  });

  it('should treat a shared file entry exposing nodeId as a file', () => {
    component.node = { nodeId: 'shared-node-id', isFile: false } as any;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isFileSelected).toBe(true);
    expect(getVersionManager()).not.toBeNull();
  });

  it('should re-evaluate the selection when the node input changes', () => {
    component.node = { id: 'file-node-id', isFile: true, isFolder: false } as Node;
    fixture.detectChanges();

    expect(getVersionManager()).not.toBeNull();

    component.node = { id: 'folder-node-id', isFile: false, isFolder: true } as Node;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.isFileSelected).toBe(false);
    expect(getVersionManager()).toBeNull();
    expect(getEmptyPlaceholder()).not.toBeNull();
  });
});
