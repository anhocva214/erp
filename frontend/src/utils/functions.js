// remove all falsy property from  object
export function removeFalsyProperties(obj) {
  const newObj = {};
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop]) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

export function stringShorter(str, length) {
  return str?.length > length ? str.slice(0, length) + "..." : str;
}
