import { createContext, useCallback, useContext, useEffect, useReducer} from "react";

const URL = "https://intermediate-torch-fork.glitch.me";

//we create a context a function that returns then context .provider as component contains values amd we use it with usecontext
const CityContext=createContext()
const intitalState={cities:[],isLoading:false,currentcity:{},error:""}
function reducer(state,action){
  switch (action.type) {
    case"loading":
    return {...state,isLoading:true}
    case "cities/Recieved":
      return {...state,cities:action.payload,isLoading:false}
    case "cities/Arrived":
      return {...state,currentcity:action.payload,isLoading:false}
    case 'cities/Created':
      return {...state,cities:[...state.cities,action.payload],isLoading:false,currentcity:action.payload}
    case "cities/Deleted":
      return{...state,cities:state.cities.filter(city=>city.id!==action.payload),isLoading:false,currentcity:{}}
    case "rejected":
      return {...state,isLoading:false,error:action.payload}
    default:
      throw new Error("Unkown action type")
  }
}
function CitiesProvider({children}) {

  const [{cities,isLoading,currentcity,error},dispatch]=useReducer(reducer,intitalState);
    // const [cities, setcities] = useState([]);
    // const [isLoading, setisLoading] = useState(false);
    // const [currentcity,setcurrencity]=useState({});

    useEffect(function () {
      async function fetchCitites() {
        dispatch({type:"loading"})
        try {
          const res = await fetch(`${URL}/cities`);
          const data = await res.json();
          console.log(data)
          dispatch({type:"cities/Recieved",payload:data}) 
        } catch(err) {dispatch({type:"rejected",payload:'error loading data '})}
      }
      fetchCitites()
    }, []); 
   const getcity=useCallback(async function getcity(id){
      dispatch({type:"loading"})
      // if(+id===currentcity.id) return
        try {
          const res = await fetch(`${URL}/cities/${id}`);
            const data = await res.json();
            dispatch({type:"cities/Arrived",payload:data}) 
          } catch(err) {dispatch({type:"rejected",payload:'error loading data '})}
    },[currentcity.id])
    async function createcity(newcity){
      dispatch({type:"loading"})
        try {
            const res = await fetch(`${URL}/cities`,{method:'POST',body:JSON.stringify(newcity),headers:{"Content-Type": "application/json",
            Accept: "application/json"},});
            const data = await res.json();
            dispatch({type:"cities/Created",payload:data}) 
          } catch(err) {dispatch({type:"rejected",payload:'error loading data '})}
    }
    async function deletecity(id){
      dispatch({type:"loading"})
        try {
           await fetch(`${URL}/cities/${id}`,{method:'DELETE'});
           dispatch({type:"cities/Deleted",payload:id}) 
          } catch(err) {dispatch({type:"rejected",payload:'error loading data '})}
    }

    return (
        <CityContext.Provider value={{cities,isLoading,currentcity,getcity,createcity,deletecity,error}}>
            {children}
        </CityContext.Provider>
    )
}
function useCities(){
    const context=useContext(CityContext);
    if(context===undefined) throw new Error('cities context was used outside the cities provider !')
    return context;
}
export {CitiesProvider,useCities}