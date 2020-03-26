import React from 'react';

class CreateForm extends React.Component {
  state = [];
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.getFieldProps = this.getFieldProps.bind(this);
    this.getFieldValue = this.getFieldValue.bind(this);
    this.getFieldsValue = this.getFieldsValue.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.create = this.create.bind(this);
  }

  componentDidMount() {}

  handleChange(name, e, extraCallback) {
    let { state } = this;
    const targetItem = state.find(i => i.name === name);
    const value = e.target.value;
    targetItem.value = value;
    if (extraCallback) {
      extraCallback();
    }
  }

  getFieldProps(name, options) {
    const { state } = this;
    if (!state.find(i => i.name === name)) {
      const newItem = {
        name,
        options,
        value: options.defaultValue
      };
      state.push(newItem);
    }
    return {
      onChange: e => {
        this.handleChange(name, e, options.extraCallback);
      }
    };
  }

  getFieldValue(name) {
    if (typeof name !== 'string') {
      console.error(
        `'${name}' is not string, please check getFieldValue function.`
      );
      return null;
    }
    const { state } = this;
    const find = state.find(i => i.name === name);
    if (find) {
      return find.value;
    } else {
      console.error(
        `'${name}' is not registed, please registe ${name} before call getFieldValue.`
      );
      return null;
    }
  }

  getFieldsValue() {
    const { state } = this;
    const result = {};
    state.forEach(i => {
      result[i.name] = this.getFieldValue(i.name);
    });
    return result;
  }

  validateField(name) {
    const { state } = this;
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
    if (patternWrongItem && patternWrongItem.length) {
      return {
        name,
        rules,
        value,
        errorMsg: patternWrongItem[0].message
      };
    }
    return result;
  }

  validateFields(callback) {
    const { state } = this;
    const values = {};
    let error = state
      .map(i => this.validateField(i.name))
      .filter(i => i !== true);
    if (error.length === 0) {
      error = undefined;
    }
    state.forEach(i => (values[i.name] = i.value));
    callback(error, values);
  }

  create() {
    const form = {
      handleChange: this.handleChange,
      getFieldProps: this.getFieldProps,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      validateField: this.validateField,
      validateFields: this.validateFields
    };
    return Component => {
      return () => <Component form={form} />;
    };
  }
}

const createForm = () => new CreateForm().create();

export default createForm;
