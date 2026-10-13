const ArrayDetails2Object = (array = []) => {
  const object = {};
  array.forEach(item => {
    object[item.page + '.' + item.name] = item.description
  });
  return object
}

export default ArrayDetails2Object