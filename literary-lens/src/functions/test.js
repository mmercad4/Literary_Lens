export const getTest = async () => {
  try {
    const response = await fetch('http://localhost:8080/test', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (err) {}
};
