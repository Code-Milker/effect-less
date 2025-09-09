// Sync Function Examples
function add(a, b) {
  return [a + b, null];
}

function fetchData(id) {
  if (!id) {
    return [null, new Error("Invalid ID")];
  }
  const data = { id };
  return [data, null];
}

function compute() {
  let res = Math.random() > 0.5 ? "success" : null;
  let err = null;
  return [res, err];
}

function multiPath() {
  if (true) {
    return ["path1", null];
  } else {
    return [null, new Error("path2")];
  }
}

// Async Function Examples
async function asyncAdd(a, b) {
  return Promise.resolve([a + b, null]);
}

async function asyncFetch(id) {
  if (!id) {
    return Promise.resolve([null, new Error("Invalid ID")]);
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Promise.resolve([{ id }, null]);
}

async function withTryCatch() {
  try {
    const res = await Promise.resolve("data");
    return Promise.resolve([res, null]);
  } catch (e) {
    return Promise.resolve([null, e]);
  }
}

// Expression Variety Examples
function inlineMath() {
  return [2 * 3 + 4, undefined];
}

function customError() {
  return ["result", new Error("Custom message")];
}

function fromVariables() {
  const result = { key: "value" };
  const error = null;
  return result;
}
