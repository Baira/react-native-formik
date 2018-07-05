import React from "react";
import PropTypes from "prop-types";
import { compose, withContext } from "recompose";
import { TextInput } from "react-native";
import { mount } from "enzyme";

import { withError } from "../..";

console.error = jest.fn();

const withFormikMock = withContext({ formik: PropTypes.object }, () => ({
  formik: {
    errors: {
      email: "This is not a valid email.",
      user: {
        password: "Password is too short!"
      }
    }
  }
}));
const Input = compose(withFormikMock, withError)(TextInput);

describe("withError", () => {
  it("sets the error prop", () => {
    const erroredInput = mount(<Input name="email" />);
    expect(erroredInput.find(TextInput).props().error).toEqual("This is not a valid email.");
    const validInput = mount(<Input name="valid" />);
    expect(validInput.find(TextInput).props().error).toBeFalsy();
  });

  it('sets the error prop for nested key name', () => {
    const emailInput = mount(<Input name="user.password" />);
    expect(emailInput.find(TextInput).props().error).toEqual("Password is too short!");
    const otherInput = mount(<Input name="user.username" />);
    expect(otherInput.find(TextInput).props().error).toEqual(undefined);
  });

  it("keeps other props", () => {
    const wrapper = mount(<Input name="inputName" someProp="someValue" />);
    expect(wrapper.find(TextInput).props().someProp).toEqual("someValue");
  });
});
