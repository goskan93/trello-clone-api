export function insertElement<T>(
  array: Array<T>,
  element: T,
  index: number,
): Array<T> {
  const copyArray = array;
  copyArray.splice(index < 0 ? array.length : index, 0, element);
  return copyArray;
}
