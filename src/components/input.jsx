const InputComponent = ({ label, onChange, value, placeholder, type = "text" }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
        onWheel={type === "number" ? (e) => e.target.blur() : undefined} // Prevent number scrolling
        inputMode={type === "number" ? "numeric" : undefined} // Improve mobile input experience
      />
    </div>
  )
}

export default InputComponent
