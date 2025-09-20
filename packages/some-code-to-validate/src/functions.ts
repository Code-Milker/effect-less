import { z } from "zod";

// Sync Function Examples
export const add = z
  .function({
    input: [z.number(), z.number()],
    output: z.tuple([z.number(), z.null()]),
  })
  .implement((a, b) => {
    return [a + b, null];
  });

export const fetchData = z
  .function({
    input: [z.any()], // Adjust as needed, e.g., z.string() or z.number()
    output: z.union([
      z.tuple([z.object({ id: z.any() }), z.null()]),
      z.tuple([z.null(), z.instanceof(Error)]),
    ]),
  })
  .implement((id) => {
    if (!id) {
      return [null, new Error("Invalid ID")];
    }
    const data = { id };
    return [data, null];
  });

export const multiPath = z
  .function({
    input: [],
    output: z.union([
      z.tuple([z.string(), z.null()]),
      z.tuple([z.null(), z.instanceof(Error)]),
    ]),
  })
  .implement(() => {
    if (Math.random() < 0.5) {
      return ["path1", null];
    } else {
      return [null, new Error("path2")];
    }
  });

export const fromVariables = z
  .function({
    input: [],
    output: z.tuple([z.object({ key: z.string() }), z.null()]),
  })
  .implement(() => {
    const result = { key: "value" };
    const error = null;
    return [result, error];
  });

// Async Function Examples
export const asyncAdd = z
  .function({
    input: [z.number(), z.number()],
    output: z.tuple([z.number(), z.null()]),
  })
  .implementAsync(async (a, b) => {
    return [a + b, null];
  });

export const asyncFetchData = z
  .function({
    input: [z.any()], // Adjust as needed
    output: z.union([
      z.tuple([z.object({ id: z.any() }), z.null()]),
      z.tuple([z.null(), z.instanceof(Error)]),
    ]),
  })
  .implementAsync(async (id) => {
    if (!id) {
      return [null, new Error("Invalid ID")];
    }
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    const data = { id };
    return [data, null];
  });

export const asyncCompute = z
  .function({
    input: [],
    output: z.union([
      z.tuple([z.string().nullable(), z.null()]),
      z.tuple([z.null(), z.null()]),
    ]),
  })
  .implementAsync(async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    let res = Math.random() > 0.5 ? "success" : null;
    let err = null;
    return [res, err];
  });

export const asyncMultiPath = z
  .function({
    input: [],
    output: z.union([
      z.tuple([z.string(), z.null()]),
      z.tuple([z.null(), z.instanceof(Error)]),
    ]),
  })
  .implementAsync(async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (Math.random() < 0.5) {
      return ["path1", null];
    } else {
      return [null, new Error("path2")];
    }
  });

export const asyncFromVariables = z
  .function({
    input: [],
    output: z.tuple([z.object({ key: z.string() }), z.null()]),
  })
  .implementAsync(async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    const result = { key: "value" };
    const error = null;
    return [result, error];
  });

export const asyncWithCatch = z
  .function({
    input: [],
    output: z.union([
      z.tuple([z.string(), z.null()]),
      z.tuple([z.null(), z.instanceof(Error)]),
    ]),
  })
  .implementAsync(async () => {
    try {
      // Simulate async operation that might fail
      const data = await new Promise<string>((resolve, reject) => {
        Math.random() > 0.5 ? resolve("data") : reject(new Error("Failed"));
      });
      return [data, null];
    } catch (e) {
      return [null, e as Error];
    }
  });
