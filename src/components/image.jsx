import placeholderImage from "../assets/images/main/placeholder.png"

function ImageComponent({ src, className, rounded = false, alt = "", type="local" }) {
    return (<img className={`${className} ${rounded ? "rounded-[50%]" : "rounded-sm"}`} src={src ? type == "local" ? src : `http://localhost:3000/uploads/${src}` : placeholderImage} />)
}

export default ImageComponent