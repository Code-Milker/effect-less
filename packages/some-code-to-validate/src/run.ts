import { z } from "zod";
import {
  add,
  fetchData,
  multiPath,
  fromVariables,
  asyncAdd,
  asyncFetchData,
  asyncCompute,
  asyncMultiPath,
  asyncFromVariables,
  asyncWithCatch,
} from "./functions"; // Assuming the previous file is named functions.ts

// Define the main function with Zod validation
export const main = z
  .function({
    input: z.tuple([]),
    output: z.void(),
  })
  .implementAsync(async () => {
    // Sync examples
    const [addRes, addErr] = add(1, 2);
    if (addErr) {
      console.error("Error in add:", addErr);
    } else {
      console.log("add result:", addRes); // 3
    }

    const [fetchRes, fetchErr] = fetchData(123);
    if (fetchErr) {
      console.error("Error in fetchData:", fetchErr);
    } else {
      console.log("fetchData result:", fetchRes); // { id: 123 }
    }

    const [fetchInvalidRes, fetchInvalidErr] = fetchData(null);
    if (fetchInvalidErr) {
      console.error("Error in fetchData (invalid):", fetchInvalidErr); // Error: Invalid ID
    } else {
      console.log("fetchData (invalid) result:", fetchInvalidRes);
    }

    const [multiPathRes, multiPathErr] = multiPath();
    if (multiPathErr) {
      console.error("Error in multiPath:", multiPathErr);
    } else {
      console.log("multiPath result:", multiPathRes);
    }

    const [fromVarsRes, fromVarsErr] = fromVariables();
    if (fromVarsErr) {
      console.error("Error in fromVariables:", fromVarsErr);
    } else {
      console.log("fromVariables result:", fromVarsRes); // { key: "value" }
    }

    // Async examples
    const [asyncAddRes, asyncAddErr] = await asyncAdd(3, 4);
    if (asyncAddErr) {
      console.error("Error in asyncAdd:", asyncAddErr);
    } else {
      console.log("asyncAdd result:", asyncAddRes); // 7
    }

    const [asyncFetchRes, asyncFetchErr] = await asyncFetchData(456);
    if (asyncFetchErr) {
      console.error("Error in asyncFetchData:", asyncFetchErr);
    } else {
      console.log("asyncFetchData result:", asyncFetchRes); // { id: 456 }
    }

    const [asyncFetchInvalidRes, asyncFetchInvalidErr] =
      await asyncFetchData(null);
    if (asyncFetchInvalidErr) {
      console.error("Error in asyncFetchData (invalid):", asyncFetchInvalidErr); // Error: Invalid ID
    } else {
      console.log("asyncFetchData (invalid) result:", asyncFetchInvalidRes);
    }

    const [asyncComputeRes, asyncComputeErr] = await asyncCompute();
    if (asyncComputeErr) {
      console.error("Error in asyncCompute:", asyncComputeErr);
    } else {
      console.log("asyncCompute result:", asyncComputeRes); // "success" or null
    }

    const [asyncMultiPathRes, asyncMultiPathErr] = await asyncMultiPath();
    if (asyncMultiPathErr) {
      console.error("Error in asyncMultiPath:", asyncMultiPathErr);
    } else {
      console.log("asyncMultiPath result:", asyncMultiPathRes);
    }

    const [asyncFromVarsRes, asyncFromVarsErr] = await asyncFromVariables();
    if (asyncFromVarsErr) {
      console.error("Error in asyncFromVariables:", asyncFromVarsErr);
    } else {
      console.log("asyncFromVariables result:", asyncFromVarsRes); // { key: "value" }
    }

    const [asyncCatchRes, asyncCatchErr] = await asyncWithCatch();
    if (asyncCatchErr) {
      console.error("Error in asyncWithCatch:", asyncCatchErr);
    } else {
      console.log("asyncWithCatch result:", asyncCatchRes); // "data"
    }
  });

// Run main with error handling
main().catch(console.error);
