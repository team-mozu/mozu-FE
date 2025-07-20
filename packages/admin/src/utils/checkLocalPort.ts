export const checkLocalPort = async (port: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:${port}`);
    return response.status === 200;
  } catch (_error) {
    return false;
  }
};
