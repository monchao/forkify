export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status} ( ${res.status})`);

    return data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
