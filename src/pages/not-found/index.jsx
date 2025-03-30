import notFoundImage from "../../assets/images/main/not-found.jpg";

const NotFound = () => {
    return (<div className="w-full h-full flex flex-col justify-center items-center">
        <img src={notFoundImage} className="w-[100px] h-[100px]" />
        <p className="text-xl text-">Ooops! This might not be the page you are looking for!</p>
    </div>)
}

export default NotFound;