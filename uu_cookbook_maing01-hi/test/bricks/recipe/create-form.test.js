import CreateForm from '../../../src/bricks/recipe/create-form.js';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('uu5g05-forms', () => ({
  Form: ({ children, ...props }) => <form {...props}>{children}</form>,
  FormText: ({ label, ...props }) => (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <input id={props.name} {...props} />
    </div>
  ),
  FormSelect: ({ label, itemList, ...props }) => (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <select id={props.name} {...props}>
        {itemList && itemList.map((item, index) => (
          <option key={index} value={item.value}>{item.children}</option>
        ))}
      </select>
    </div>
  ),
  FormFile: ({ label, ...props }) => (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <input id={props.name} type="file" {...props} />
    </div>
  ),
  FormTextArea: ({ label, ...props }) => (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <textarea id={props.name} {...props}></textarea>
    </div>
  ),
  SubmitButton: ({ children, ...props }) => <button {...props}>{children}</button>,
  CancelButton: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('CreateForm', () => {
  test('should render with default props', () => {
    const {getByLabelText, getByRole} = render(<CreateForm />);
    expect(getByLabelText("Name")).toBeInTheDocument();
    expect(getByLabelText("Text")).toBeInTheDocument();
    expect(getByLabelText("Category")).toBeInTheDocument();
    expect(getByLabelText("Image")).toBeInTheDocument();
    expect(getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
  test('validates form with empty fields', () => {
    const onSubmit = jest.fn();
    const {getByRole} = render(<CreateForm onSubmit={onSubmit} />);
    fireEvent.click(getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
  test('validates onCancel prop', () => {
    const onCancel = jest.fn();
    const {getByRole} = render(<CreateForm onCancel={onCancel} />);
    fireEvent.click(getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });
  test('validates handleValidate function', () => {
    const onSubmit = jest.fn();
    window.alert = jest.fn();
    const {getByRole } = render(<CreateForm onSubmit={onSubmit} />);
    fireEvent.click(getByRole("button", { name: "Submit" }));
    expect(window.alert).toHaveBeenCalledWith("Please provide either text or image.");
  });// can't catch the alert message
});
