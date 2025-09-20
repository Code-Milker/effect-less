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
  if (Math.random() < 0.5) {
    return ["path1", null];
  } else {
    return [null, new Error("path2")];
  }
}
function fromVariables() {
  const result = { key: "value" };
  const error = null;
  return [result, error];
}

// Async Function Examples
async function asyncAdd(a, b) {
  return [a + b, null];
}
async function asyncFetchData(id) {
  if (!id) {
    return [null, new Error("Invalid ID")];
  }
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  const data = { id };
  return [data, null];
}
async function asyncCompute() {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  let res = Math.random() > 0.5 ? "success" : null;
  let err = null;
  return [res, err];
}
async function asyncMultiPath() {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (Math.random() < 0.5) {
    return ["path1", null];
  } else {
    return [null, new Error("path2")];
  }
}
async function asyncFromVariables() {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  const result = { key: "value" };
  const error = null;
  return [result, error];
}
async function asyncWithCatch() {
  try {
    // Simulate async operation that might fail
    const data = await new Promise((resolve, reject) => {
      Math.random() > 0.5 ? resolve("data") : reject(new Error("Failed"));
    });
    return [data, null];
  } catch (e) {
    return [null, e];
  }
}
