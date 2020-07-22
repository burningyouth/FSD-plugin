import { Settings, Values } from '../types/slider';

enum Align {
  horizontal,
  vertical
}

class Model {
  public settings: Settings = {
    min: 0,
    max: 100,
    range: true,
    startValues: [30, 70],
    step: 1,
    roundTo: 0,
    align: Align.horizontal,
    sortValues: true,
    sortOnlyPares: false,
    template: 'default',
    additionalClasses: {
      wrapper: 'slider',
      base: 'slider__base',
      handlers: 'slider__handler',
      connectors: 'slider__connector',
      result: 'slider__result'
    }
  };

  private _values: Values;

  constructor(options?: Object) {
    if (options) this.settings = $.extend(this.settings, options);
    if (this.checkValue(this.settings.startValues)) {
      this._values = this.settings.startValues;
    } else {
      throw new Error('Start value is invalid (out of range)!');
    }
  }

  get values(): Values {
    return this._values;
  }

  get sortedValues(): Values {
    if (this.settings.sortValues) {
      if (this.settings.sortOnlyPares && this._values.length > 2) {
        const arr = this._values.slice(0);
        for (let i = 0; i < arr.length; i += 2) {
          if (arr[i] > arr[i + 1]) {
            let tmp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = tmp;
          }
        }
        return arr;
      } else {
        return this._values.slice(0).sort(this.compareNumbers);
      }
    }
    return this._values;
  }

  get formattedValues(): string {
    const template = this.settings.template;
    let formattedString = 'undefined';
    if (template !== 'default') {
      const arr = template.split(/\$(\d)/gm).map(item => {
        const index = parseInt(item);
        if (index) {
          return this.sortedValues[index - 1];
        }
        return item;
      });
      formattedString = arr.join('');
    } else {
      return this.sortedValues.toString();
    }
    return formattedString;
  }

  set values(newValues: Values) {
    this._values = newValues;
  }

  public compareNumbers(a: number, b: number): number {
    return a - b;
  }

  public checkValue(value: number | Values): boolean {
    if (Array.isArray(value)) {
      let result = true;
      value.forEach(item => {
        if (!this.checkValue(item)) result = false;
      });
      return result;
    } else {
      return value >= this.settings.min && value <= this.settings.max;
    }
  }

  public setValue(index: number, value: number): Model {
    this._values[index] = value;
    return this;
  }
}

export { Model, Align };
