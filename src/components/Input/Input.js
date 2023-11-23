function Input({ label, name, type, onChange, value }) {
    return (
        <div className="field">
            <label htmlFor={name} className="field__label">
                {label}
            </label>
            <input type={type} id={name} name={name} className="field__input" onChange={onChange} value={value} />
        </div>
    );
}

export default Input;