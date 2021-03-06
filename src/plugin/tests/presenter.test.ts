import Model from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';
import HandlerView from '../modules/subViews/handlerView';
import $ from 'jquery';

const input = $('<input id="test" type="text">');
const body = $('<body style="width: 500px; height: 500px;"></body>');
input.appendTo(body);

const model = new Model({
  min: 0,
  max: 100,
  showRange: false,
  values: [30, 70],
  step: 1,
  decimalPlaces: 0,
  isTooltipReversed: false,
  isBaseClickable: true,
  showTooltip: false,
  showResult: true,
  showBounds: true,
  sortValues: false,
  sortOnlyPares: false,
  resultTemplate: 'default',
  additionalClasses: {},
});

const view = new View(input);
const presenter = new Presenter(model, view);
view.init();
presenter.init();

describe('Presenter', () => {
  test('Settings and values is accessible', () => {
    expect(presenter.settings).toBeDefined();
    expect(presenter.values).toBeDefined();
    expect(presenter.sortedValues).toBeDefined();
    expect(presenter.templateValues).toBeDefined();
  });

  test('Settings and values is changeable', () => {
    presenter.settings = {
      values: [10, 60],
    };
    presenter.values = [1, 30];
    expect(presenter.settings.values).toEqual([10, 60]);
    expect(presenter.values).toEqual([1, 30]);
  });

  test('View events is working fine', () => {
    let handler1 = view.elements.handlers[0],
      handler2 = view.elements.handlers[1],
      input = view.$input,
      inputValBefore = input.val(),
      modelValueBefore = model.values[0],
      handlerValueBefore = handler1.value,
      handlerPercentageBefore = handler1.percentage;

    view.trigger('handlerMoved', handler1, 10);
    view.trigger('handlerEnd', handler1);

    expect(handlerValueBefore < handler1.value).toBeTruthy();
    expect(modelValueBefore < model.values[0]).toBeTruthy();
    expect(handlerPercentageBefore < handler1.percentage).toBeTruthy();
    expect(inputValBefore != input.val()).toBeTruthy();

    inputValBefore = input.val();
    modelValueBefore = model.values[1];
    handlerValueBefore = handler2.value;
    handlerPercentageBefore = handler2.percentage;
  });

  test('Changing the model changes the view', () => {
    let handler = view.elements.handlers[0];

    const input = view.$input,
      inputValBefore = input.val(),
      handlerValueBefore = handler.value,
      handlerPercentageBefore = handler.percentage;

    model.settings = {
      values: [10, 30, 50],
    };

    handler = view.elements.handlers[0];

    expect(view.elements.handlers.length === 3).toBeTruthy();
    expect(inputValBefore != input.val()).toBeTruthy();
    expect(handlerValueBefore != handler.value).toBeTruthy();
    expect(handlerPercentageBefore != handler.percentage).toBeTruthy();
  });
});
