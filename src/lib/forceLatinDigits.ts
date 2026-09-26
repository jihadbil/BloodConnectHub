// Force Latin (English) digits globally for all localization formatting
if (typeof Number.prototype.toLocaleString === 'function') {
  const originalToLocaleString = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return originalToLocaleString.call(this, locales, opt);
  };
}

if (typeof Date.prototype.toLocaleDateString === 'function') {
  const originalDateToLocaleDateString = Date.prototype.toLocaleDateString;
  Date.prototype.toLocaleDateString = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return originalDateToLocaleDateString.call(this, locales, opt);
  };
}

if (typeof Date.prototype.toLocaleString === 'function') {
  const originalDateToLocaleString = Date.prototype.toLocaleString;
  Date.prototype.toLocaleString = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return originalDateToLocaleString.call(this, locales, opt);
  };
}

if (typeof Date.prototype.toLocaleTimeString === 'function') {
  const originalDateToLocaleTimeString = Date.prototype.toLocaleTimeString;
  Date.prototype.toLocaleTimeString = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return originalDateToLocaleTimeString.call(this, locales, opt);
  };
}

if (typeof Intl !== 'undefined') {
  const OriginalNumberFormat = Intl.NumberFormat;
  // @ts-ignore
  Intl.NumberFormat = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return new OriginalNumberFormat(locales, opt);
  };
  Intl.NumberFormat.prototype = OriginalNumberFormat.prototype;
  if (typeof OriginalNumberFormat.supportedLocalesOf === 'function') {
    Object.defineProperty(Intl.NumberFormat, 'supportedLocalesOf', {
      value: OriginalNumberFormat.supportedLocalesOf,
      writable: true,
      configurable: true
    });
  }

  const OriginalDateTimeFormat = Intl.DateTimeFormat;
  // @ts-ignore
  Intl.DateTimeFormat = function(this: any, locales?: string | string[], options?: any) {
    const opt = { ...options, numberingSystem: 'latn' };
    return new OriginalDateTimeFormat(locales, opt);
  };
  Intl.DateTimeFormat.prototype = OriginalDateTimeFormat.prototype;
  if (typeof OriginalDateTimeFormat.supportedLocalesOf === 'function') {
    Object.defineProperty(Intl.DateTimeFormat, 'supportedLocalesOf', {
      value: OriginalDateTimeFormat.supportedLocalesOf,
      writable: true,
      configurable: true
    });
  }
}

export {};
