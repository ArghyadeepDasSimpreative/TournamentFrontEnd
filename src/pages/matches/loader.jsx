import CustomSkeleton from "../../components/skeleton"

const MatchesLoader = () => {
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">{
        [1,2,3,4,5,6].map(item=>
            <CustomSkeleton width="406px" height="158px" borderRadius="10px" />
        )
    }</div>)
}

export default MatchesLoader;