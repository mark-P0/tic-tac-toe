import { sleep } from "@tic-tac-toe/utils/sleep";
import { useEffect, useState } from "react";
import { env } from "../utils/env";
import { createNewContext } from "../utils/react";
import {
  getOldestSessionFromStorage,
  removeOldestSessionFromStorage,
} from "../utils/storage";
export const [useBackgroundSyncContext, BackgroundSyncProvider] =
  createNewContext(() => {
    const [syncCt, setSyncCt] = useState(0);

    useEffect(() => {
      let shouldProceed = true;

      async function _syncStorageWithDatabase() {
        if (!shouldProceed) return;

        const oldestSession = getOldestSessionFromStorage();
        if (oldestSession === null) return; // No stored sessions

        const url = new URL("/api/v0/sessions", env.VITE_API_BASE_URL);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(oldestSession),
        });
        if (!res.ok) {
          console.warn("Failed submitting session info to API; skipping... ");
          return;
        }

        removeOldestSessionFromStorage();
        setSyncCt((ct) => ct + 1);
      }
      async function syncStorageWithDatabase() {
        if (!shouldProceed) return;

        await sleep(1);
        try {
          await _syncStorageWithDatabase();
        } catch (error) {
          console.warn(error);
          console.warn("Failed syncing storage with database; skipping...");
        }
        setTimeout(syncStorageWithDatabase);
      }
      setTimeout(syncStorageWithDatabase);

      return () => {
        shouldProceed = false;
      };
    });

    return { syncCt };
  });
