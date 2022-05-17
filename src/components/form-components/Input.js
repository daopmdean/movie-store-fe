const Input = (props) => {
  return (
    <div className="md-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        type={props.type}
        className={`form-control ${props.className}`}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
      <div className={props.errDiv}>{props.errMsg}</div>
    </div>
  );
};

export default Input;
