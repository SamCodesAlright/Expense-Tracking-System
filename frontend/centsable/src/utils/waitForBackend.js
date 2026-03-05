const API_URL = import.meta.env.VITE_API_URL;

export const waitForBackend = async () => {
  const maxRetries = 15;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${API_URL}/health`);

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
