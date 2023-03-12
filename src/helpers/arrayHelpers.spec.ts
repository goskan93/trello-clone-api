import { insertElement } from './arrayHelpers';

describe('insertElement', () => {
  it('should insert element in first position', () => {
    const array = [1, 2, 3];
    const index = 0;
    const element = 0;
    const expectedResult = [0, 1, 2, 3];
    expect(insertElement(array, element, index)).toStrictEqual(expectedResult);
  });
  it('should insert element in last position', () => {
    const array = [1, 2, 3];
    const index = -1;
    const element = 0;
    const expectedResult = [1, 2, 3, 0];
    expect(insertElement(array, element, index)).toStrictEqual(expectedResult);
  });
  it('should insert element inside array', () => {
    const array = [1, 2, 3];
    const index = 2;
    const element = 0;
    const expectedResult = [1, 2, 0, 3];
    expect(insertElement(array, element, index)).toStrictEqual(expectedResult);
  });
});
