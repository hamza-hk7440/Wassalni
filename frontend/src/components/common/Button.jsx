import '../../App.css';

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false }) => {
  return (
    <button
      type={type}
      className={`custom-btn ${variant}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;