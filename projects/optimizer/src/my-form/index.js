import React from 'react';

const createForm = () => {
  const state = [];

  const getFieldProps = (name, options) => {
    const newItem = {
      name,
      options,
      value: options.defaultValue
    };
    state.push(newItem);
    return {
      onChange: e => {
        const value = e.currentTarget.value;
        state.find(i => i.name === name).value = value;
      }
    };
  };

  const getFieldValue = name => {
    if (typeof name !== 'string') {
      console.error(
        `'${name}' is not string, please check getFieldValue function.`
      );
      return null;
    }
    const find = state.find(i => i.name === name);
    if (find) {
      return find.value;
    } else {
      console.error(
        `'${name}' is not registed, please registe ${name} before call getFieldValue.`
      );
      return null;
    }
  };

  const getFieldsValue = arr => {
    return state.map(i => getFieldValue(i.name));
  };

  const validateField = name => {
    const item = state.find(i => i.name === name);
    if (!item) {
      console.error(
        `not found register of '${name}' in validateField funtion, please check the name.`
      );
      return;
    }
    const {
      options: { rules },
      value
    } = item;
    const requiredRule = rules.find(i => i.required);
    const requiredFlag = Boolean(requiredRule);
    const requiredError = requiredFlag ? requiredRule.message : '';
    const patternArr = rules.filter(i => i.pattern);
    let result = true;
    if (value === '' || value === undefined) {
      return {
        name,
        rules,
        value,
        errorMsg: requiredError
      };
    }
    const patternWrongItem = patternArr.filter(i => !i.pattern.test(value));
    if (patternWrongItem) {
      return {
        name,
        rules,
        value,
        errorMsg: patternWrongItem.message
      };
    }
    return result;
  };

  const validateFields = callback => {
    let error = state.map(i => validateField(i.name));
    if (!error.find(i => typeof i === 'object')) {
      error = undefined;
    }
    const values = state.forEach(i => (state[i.name] = i.value));
    callback(error, values);
  };

  return Component => {
    const form = {
      getFieldProps,
      getFieldValue,
      getFieldsValue,
      validateField,
      validateFields
    };
    return () => <Component form={form} />;
  };
};

export default createForm;
