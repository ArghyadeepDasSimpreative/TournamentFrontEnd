import ClipLoader from 'react-spinners/ClipLoader';

const Button = ({ onClick, children, type = 'primary', disabled, loading = false }) => {
  const baseClass =
    'px-4 py-2 rounded-md text-sm font-medium transition-all min-w-[100px] max-w-[200px] flex justify-center gap-1 items-center';

  const typeClasses = disabled || loading
    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
    : type === 'primary'
    ? 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer'
    : 'text-gray-800 border border-gray-300 hover:bg-gray-100 cursor-pointer';

  return (
    <button
      className={`${baseClass} ${typeClasses}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <ClipLoader size={16} color="#ffffff" /> : children}
    </button>
  );
};

export default Button;
