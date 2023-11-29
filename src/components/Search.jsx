import { useState } from "react"
import styles from './Search.module.css'
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
const URL_Reverse="https://api.opencagedata.com/geocode/v1/json?key=bb2a541eadbc45389f222458125326fc" ;

function Search() {
    const [query,setquery]=useState(null)
    const navigate=useNavigate()
    async function Search(e){
        e.preventDefault();
            const res=await fetch(`${URL_Reverse}&q=${query}`);
            const data=await res.json();
            const {lat,lng}=data.results[0].geometry
            navigate(`form?lat=${lat}&lng=${lng}`)
        }
    return (
       <form autoComplete="off" className={styles.search} onSubmit={Search}>
      <div className={styles.row}>
        <label className={styles.labelSearch} htmlFor="cityName">Search for city</label>
        <input
        autoComplete="off"
          id="cityName"
          onChange={(e) => setquery(e.target.value)}
          value={query}
        />
        </div>
        </form>
    )
}

export default Search
