/**
 * @jest-environment node
 */

import mapper from '../../../src/lib/transform';
import testRecord from '../../stubs/record.json';
import testRecordFullYear from '../../stubs/record_full_year.json';

describe('DG BUDG XLS transformer', () => {
  let yearTwoDigits = {};
  let yearFourDigits = {};

  beforeAll(() => {
    yearTwoDigits = mapper(testRecord);
    yearFourDigits = mapper(testRecordFullYear);
  });

  test('Returns null when record is not provided', () => {
    expect(mapper()).toBe(null);
  });

  test('Produces correct JSON output structure, year in 2 digits', () => {
    expect(yearTwoDigits).toMatchSnapshot();
  });

  test('Produces correct JSON output structure, year in 4 digits', () => {
    expect(yearFourDigits).toMatchSnapshot();
  });
});