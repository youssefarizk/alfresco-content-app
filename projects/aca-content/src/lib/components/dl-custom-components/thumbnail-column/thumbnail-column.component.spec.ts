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
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, TranslateLoaderService, TranslationService } from '@alfresco/adf-core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltip } from '@angular/material/tooltip';

describe('ThumbnailColumnComponent', () => {
  let fixture: ComponentFixture<ThumbnailColumnComponent>;
  let component: ThumbnailColumnComponent;

  const buildContext = (options: { isSelected?: boolean; lockOwner?: string; thumbnailUrl?: string } = {}) => ({
    data: {
      getValue: () => options.thumbnailUrl ?? 'thumbnail-url'
    },
    row: {
      isSelected: options.isSelected ?? false,
      node: {
        entry: {
          id: 'nodeId',
          properties: options.lockOwner ? { 'cm:lockOwner': { displayName: options.lockOwner } } : {}
        }
      }
    },
    col: { key: '$thumbnail' }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderService
          }
        }),
        ThumbnailColumnComponent,
        AuthModule.forRoot(),
        MatIconTestingModule
      ]
    });

    fixture = TestBed.createComponent(ThumbnailColumnComponent);
    component = fixture.componentInstance;
  });

  it('should render the thumbnail image with url resolved from the datatable column when row is not selected', () => {
    fixture.componentRef.setInput('context', buildContext({ thumbnailUrl: 'some/thumbnail.png' }));
    fixture.detectChanges();

    const image = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(image.getAttribute('src')).toBe('some/thumbnail.png');
    expect(fixture.debugElement.query(By.css('mat-icon.adf-datatable-selected'))).toBe(null);
  });

  it('should render the selected icon instead of the thumbnail when row is selected', () => {
    fixture.componentRef.setInput('context', buildContext({ isSelected: true }));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('mat-icon.adf-datatable-selected'))).not.toBe(null);
    expect(fixture.debugElement.query(By.css('img'))).toBe(null);
    expect(component.isSelected).toBe(true);
  });

  it('should set the locked by tooltip and image alt text when the node is locked', () => {
    spyOn(TestBed.inject(TranslationService), 'instant').and.returnValue('Locked by');
    fixture.componentRef.setInput('context', buildContext({ lockOwner: 'John Doe' }));
    fixture.detectChanges();

    expect(component.tooltip).toBe('Locked by John Doe');
    expect(fixture.debugElement.query(By.css('img')).nativeElement.getAttribute('alt')).toBe('Locked by John Doe');
    expect(fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip).message).toBe('Locked by John Doe');
  });

  it('should leave the tooltip empty when the node is not locked', () => {
    fixture.componentRef.setInput('context', buildContext());
    fixture.detectChanges();

    expect(component.tooltip).toBe('');
    expect(fixture.debugElement.query(By.directive(MatTooltip)).injector.get(MatTooltip).message).toBe('');
  });

  it('should clear thumbnail url and tooltip when context is removed', () => {
    fixture.componentRef.setInput('context', buildContext({ lockOwner: 'John Doe' }));
    fixture.detectChanges();

    const previousContext = component.context;
    component.ngOnChanges({ context: new SimpleChange(previousContext, null, false) });

    expect(component.thumbnailUrl).toBe(null);
    expect(component.tooltip).toBe(null);
  });
});
