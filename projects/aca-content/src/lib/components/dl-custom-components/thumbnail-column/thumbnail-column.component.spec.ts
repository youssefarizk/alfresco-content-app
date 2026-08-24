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

import { ThumbnailColumnComponent } from './thumbnail-column.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';

describe('ThumbnailColumnComponent', () => {
  let fixture: ComponentFixture<ThumbnailColumnComponent>;
  let component: ThumbnailColumnComponent;

  const getContext = (isSelected = false): any => ({
    data: {
      getValue: jasmine.createSpy('getValue').and.returnValue('thumb-url')
    },
    row: {
      isSelected,
      node: {
        entry: {
          properties: {
            'cm:lockOwner': {
              displayName: 'John'
            }
          }
        }
      }
    },
    col: {}
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatIconTestingModule, ThumbnailColumnComponent],
      providers: [{ provide: TranslationService, useClass: TranslationMock }]
    });

    fixture = TestBed.createComponent(ThumbnailColumnComponent);
    component = fixture.componentInstance;
  });

  it('should return true from isSelected when row is selected', () => {
    component.context = { row: { isSelected: true } };

    expect(component.isSelected).toBe(true);
  });

  it('should return false from isSelected when row is not selected', () => {
    component.context = { row: { isSelected: false } };

    expect(component.isSelected).toBe(false);
  });

  it('should set thumbnail url and tooltip when context changes', () => {
    const context = getContext();

    component.ngOnChanges({ context: new SimpleChange(null, context, true) });

    expect(context.data.getValue).toHaveBeenCalledWith(context.row, context.col);
    expect(component.thumbnailUrl).toBe('thumb-url');
    expect(component.tooltip).toContain('APP.LOCKED_BY');
    expect(component.tooltip).toContain('John');
  });

  it('should set thumbnail url and tooltip when context is set through input binding', () => {
    const context = getContext();

    fixture.componentRef.setInput('context', context);
    fixture.detectChanges();

    expect(context.data.getValue).toHaveBeenCalledWith(context.row, context.col);
    expect(component.thumbnailUrl).toBe('thumb-url');
    expect(component.tooltip).toContain('APP.LOCKED_BY');
    expect(component.tooltip).toContain('John');

    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.getAttribute('src')).toBe('thumb-url');
  });

  it('should set thumbnail url and tooltip to null when context changes to falsy value', () => {
    component.ngOnChanges({ context: new SimpleChange(getContext(), null, false) });

    expect(component.thumbnailUrl).toBe(null);
    expect(component.tooltip).toBe(null);
  });

  it('should set empty tooltip when node has no lock owner', () => {
    const context = getContext();
    context.row.node.entry.properties = {};

    component.ngOnChanges({ context: new SimpleChange(null, context, true) });

    expect(component.tooltip).toBe('');
  });

  it('should render image with thumbnail url and tooltip when row is not selected', () => {
    const context = getContext(false);
    component.context = context;
    component.ngOnChanges({ context: new SimpleChange(null, context, true) });

    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img).not.toBe(null);
    expect(img.nativeElement.getAttribute('src')).toBe('thumb-url');
    expect(img.nativeElement.getAttribute('alt')).toContain('John');
    expect(fixture.debugElement.nativeElement.querySelector('mat-icon.adf-datatable-selected')).toBe(null);
  });

  it('should render selected icon and no image when row is selected', () => {
    const context = getContext(true);
    component.context = context;
    component.ngOnChanges({ context: new SimpleChange(null, context, true) });

    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon.adf-datatable-selected'));
    expect(icon).not.toBe(null);
    expect(icon.attributes['svgIcon']).toBe('selected');
    expect(fixture.debugElement.nativeElement.querySelector('img')).toBe(null);
  });
});
