import dateTimeValidator from './index';

test('1234-12-12T12:12:12-12:12 should be a valid datetime', () => {
    expect(dateTimeValidator('1234-12-12T12:12:12-12:12')).toBe(null);
});

test('1234-12-12T12:12:12+12:12 should be a valid datetime', () => {
    expect(dateTimeValidator('1234-12-12T12:12:12+12:12')).toBe(null);
});

test('1234-12-12T12:1212-12:12 should not be a valid datetime', () => {
    expect(dateTimeValidator('1234-12-12T12:1212-12:12')).not.toBe(null);
});

test('1234-1212T12:12:12+12:12 should not be a valid datetime', () => {
    expect(dateTimeValidator('1234-1212T12:12:12+12:12')).not.toBe(null);
});

test('1234-12-12D12:12:12+12:12 should not be a valid datetime', () => {
    expect(dateTimeValidator('1234-12-12D12:12:12+12:12')).not.toBe(null);
});

test('empty value should be valid', () => {
    expect(dateTimeValidator('')).toBe(null);
});
