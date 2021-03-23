const base = '/.netlify/functions/';

export const post = (route, data) =>
  new Promise((resolve, reject) => {
    fetch(`${base}${route}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return new Promise((resolve, reject) => {
          res.text().then(reject);
        });
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
