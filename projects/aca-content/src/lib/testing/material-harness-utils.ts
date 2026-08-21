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

import { ComponentHarness, HarnessLoader, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture } from '@angular/core/testing';

/**
 * Harness loader scoped to the DOM rendered by the fixture.
 */
export function getHarnessLoader(fixture: ComponentFixture<unknown>): HarnessLoader {
  return TestbedHarnessEnvironment.loader(fixture);
}

/**
 * Harness loader scoped to the document root, required for content rendered in a CDK overlay,
 * such as dialogs, menus, selects, autocompletes, tooltips and snack bars.
 */
export function getOverlayHarnessLoader(fixture: ComponentFixture<unknown>): HarnessLoader {
  return TestbedHarnessEnvironment.documentRootLoader(fixture);
}

/**
 * Resolves a single harness inside the fixture, failing when there is no match.
 */
export function getHarness<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, query: HarnessQuery<T>): Promise<T> {
  return getHarnessLoader(fixture).getHarness(query);
}

/**
 * Resolves every matching harness inside the fixture.
 */
export function getAllHarnesses<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, query: HarnessQuery<T>): Promise<T[]> {
  return getHarnessLoader(fixture).getAllHarnesses(query);
}

/**
 * Resolves a single harness rendered in a CDK overlay, failing when there is no match.
 */
export function getOverlayHarness<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, query: HarnessQuery<T>): Promise<T> {
  return getOverlayHarnessLoader(fixture).getHarness(query);
}

/**
 * Resolves every matching harness rendered in a CDK overlay.
 */
export function getAllOverlayHarnesses<T extends ComponentHarness>(fixture: ComponentFixture<unknown>, query: HarnessQuery<T>): Promise<T[]> {
  return getOverlayHarnessLoader(fixture).getAllHarnesses(query);
}
