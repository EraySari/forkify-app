import { TIMEOUT_SEC } from './config';
import { async } from 'regenerator-runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', //gönderecegimiz verinin JSON formatinda oldugunu söyluyoruz
          },
          body: JSON.stringify(uploadData), // JSON'a dönüstürme
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} , ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} , ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', //gönderecegimiz verinin JSON formatinda oldugunu söyluyoruz
//       },
//       body: JSON.stringify(uploadData), // JSON'a dönüstürme
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     console.log(res);
//     const data = await res.json();

//     console.log(data);
//     if (!res.ok) throw new Error(`${data.message} , ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
