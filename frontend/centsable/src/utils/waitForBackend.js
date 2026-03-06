import { BASE_URL } from "./apiPaths";

export const waitForBackend = async () => {
  const maxRetries = 15;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/health`);

      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.log("Backend waking up...");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return false;
};
