function Input({ type, name, placeholder }) {
    return(
        <input type={type} className={name} placeholder={placeholder} />
    );
}
export default Input;