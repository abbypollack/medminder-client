function Input({ label, name, type, onChange, value, checked }) {
    return (
        <div className="field">
            <label htmlFor={name} className="field__label">
                {label}
            </label>
            {type === 'checkbox' ? 
                <input type={type} id={name} name={name} className="field__input" onChange={onChange} checked={checked} /> :
                <input type={type} id={name} name={name} className="field__input" onChange={onChange} value={value} />
            }
        </div>
    );
}

export default Input;