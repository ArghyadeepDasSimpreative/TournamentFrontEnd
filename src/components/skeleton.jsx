const CustomSkeleton = ({ height = "20px", width = "100%", borderRadius = "8px" }) => {
    return (
      <div
        className="bg-gray-200 animate-pulse"
        style={{ height, width, borderRadius }}
      ></div>
    )
  }
  
  export default CustomSkeleton
  