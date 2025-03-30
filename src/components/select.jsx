import Select from 'react-select'

const CustomSelect = ({ data, config, label, onSelect, defaultValue }) => {
  // console.log("custom selecte data is ", data)
  // console.log("default value is ", defaultValue);

  const options = data.map((item) => ({
    value: item[config.key],
    label: item[config.label],
  }))

  return (
    <div className="w-[200px]">
      {label && <label className="block text-gray-700 font-medium mb-1 text-md">{label}</label>}
      <Select
        defaultValue={defaultValue}
        options={options}
        onChange={onSelect}
        className="w-full text-sm"
        classNames={{
          control: () => 'border border-gray-300 rounded-md  px-2 min-h-[20px] text-sm',
          menu: () => 'bg-white shadow-lg rounded-md text-sm',
          option: ({ isFocused }) =>
            `px-2 py-1 cursor-pointer text-sm ${isFocused ? 'bg-blue-100' : ''}`,
        }}
      />
    </div>
  )
}

export default CustomSelect;
