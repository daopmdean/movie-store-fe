const Select = (props) => {
  return (
    <div className="md-3">
      <label htmlFor={props.name} className="form-label">
        {" "}
        {props.title}{" "}
      </label>
      <select
        className="form-select"
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        <option className="form-select">{props.placeholder}</option>
        {props.options.map((option) => {
          return (
            <option
              className="form-select"
              key={option.value}
              value={option.value}
            >
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
