import { createContext, useContext, useReducer } from "react"

const inititalState={user:null,isAuthenticated:false,err:''}
function reducer(state,action){
    switch(action.type){
        case"login":
        return {...state,user:action.payload,isAuthenticated:true}
        case"logout":
        return inititalState
        case "err":
            return{...state,err:action.payload}
        default:
            throw new Error("Action undefined")
    }
}
const FAKE_USER = {
    name: "Noor",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };
  
const AuthContext=createContext()
function Authprovider({children}) {
    const [{user,isAuthenticated,err},dispatch]=useReducer(reducer,inititalState)

function login(email,password){
    if(email===FAKE_USER.email&&password===FAKE_USER.password) dispatch({type:'login',payload:FAKE_USER})
    else dispatch({type:'err',payload:'ERROR! Your password Or the email is not correct !!'})
}
function logout(){
 dispatch({type:'logout'})
}
    return (
        <AuthContext.Provider value={{login,logout,user,isAuthenticated,err}}>
            {children}
        </AuthContext.Provider>
    )
}
function useAuth(){
    const context=useContext(AuthContext)
    if(context===undefined)throw new Error("AuthContext was used outside the provider")
    return context;
}
export {Authprovider,useAuth}
