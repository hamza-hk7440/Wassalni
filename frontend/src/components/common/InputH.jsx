import '../../App.css';
const Input = ({ label, type = "text", placeholder, value, onChange, name, error }) => {
  return (
    <div className="input-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      {label && <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{label}</label>}
      
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input" 
      />

      {/* Error Message */}
      {error && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;