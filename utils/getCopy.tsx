function getCopy(collection: Collection) {
  return JSON.parse(JSON.stringify(collection));
}

export default getCopy;
