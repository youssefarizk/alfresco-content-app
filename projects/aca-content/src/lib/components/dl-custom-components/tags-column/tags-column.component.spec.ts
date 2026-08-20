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

import { TagsColumnComponent } from './tags-column.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { AuthModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TagService } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { TagPaging, TagPagingList } from '@alfresco/js-api';

describe('TagsColumnComponent', () => {
  let fixture: ComponentFixture<TagsColumnComponent>;
  let component: TagsColumnComponent;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), NoopAnimationsModule, TagsColumnComponent, AuthModule.forRoot()],
      providers: [{ provide: TranslationService, useClass: TranslationMock }]
    });

    fixture = TestBed.createComponent(TagsColumnComponent);
    component = fixture.componentInstance;
    tagService = TestBed.inject(TagService);
    spyOn(tagService, 'getTagsByNodeId').and.returnValue(of(new TagPaging({ list: new TagPagingList({ entries: [] }) })));
  });

  it('should set nodeId from context row id on init', () => {
    component.context = {
      row: {
        id: 'node-123'
      }
    };

    component.ngOnInit();

    expect(component.nodeId).toBe('node-123');
  });

  it('should render tag node list with node id from context', () => {
    component.context = {
      row: {
        id: 'node-123'
      }
    };

    fixture.detectChanges();

    const tagNodeList = fixture.debugElement.query(By.css('adf-tag-node-list'));
    expect(tagNodeList).not.toBe(null);
    expect(tagNodeList.componentInstance.nodeId).toBe('node-123');
  });

  it('should run change detection when tags are loaded', () => {
    const detectChangesSpy = spyOn((component as any).cd, 'detectChanges');

    component.onTagsLoaded();

    expect(detectChangesSpy).toHaveBeenCalled();
  });
});
