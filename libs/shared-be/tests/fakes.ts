/**
 * NOTE: These are not intended to be real, useful fakes. They are just enough to get tests for this POC library up
 * and running.
 */

import type { Request, Response } from 'express';

export class FakeRequest {
  public constructor(public readonly req: Partial<Request> = {}) {}
  public get method(): string {
    return this.req.method || 'GET';
  }
  public get path(): string {
    return this.req.path || '/';
  }
  public get url(): string {
    return this.req.url || '/';
  }
}

export class FakeResponse {
  public status: jest.Mock;
  public json: jest.Mock;

  protected readonly res: Partial<Response> = {};

  public constructor() {
    this.status = jest.fn(() => this);
    this.json = jest.fn(() => this);
  }
}
