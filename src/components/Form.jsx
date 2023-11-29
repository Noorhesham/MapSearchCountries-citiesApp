// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useContext, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
  return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}
const URL="https://api.bigdatacloud.net/data/reverse-geocode-client" ;
function Form() {
  //retriveing data about some country from the url
  const [lat,lng]=useUrlPosition(); //retrive the url lat lng 

  //states for the data itself
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji,setemoji]=useState();

  const [isLoadingGeocoding,setisLoadingGeocoding]=useState(false)
  const [err,seterr]=useState('')
  const {createcity,isLoading}=useCities()

  const navigate=useNavigate();

  useEffect(function(){
    if(!lat && !lng) return;
    async function fetchCityData(){
      try{
        setisLoadingGeocoding(true)
        seterr('')
        const res=await fetch(`${URL}?latitude=${lat}&longitude=${lng}`);
        const data=await res.json();
        if(!data.countryCode) throw new Error('That does not seem to be a city...click somewhere else 😥')
        setCityName(data.city||data.locality||"");
        setCountry(data.countryName)
        setemoji(convertToEmoji(data.countryCode))
      }catch(err){
        seterr(err.message)
      }finally{setisLoadingGeocoding(false)} 
       }
       fetchCityData()
  },[lat,lng])

 async function AddnewCity(e){
    e.preventDefault();
    if(!cityName || !date) return;
    const newcity={
      cityName,country,date,emoji,notes,position:{lat,lng}
    }
   await createcity(newcity) //upload new city to the fake api
    navigate("/app/cities")
  }
  if(!lat && !lng) return <Message message='Start by clicking somewhere in the map'/>;
  if(isLoadingGeocoding) return <Spinner/>
  if(err) return <Message message={err}/>
  return (
    <form className={`${styles.form} ${isLoading?styles.loading:""}`} onSubmit={AddnewCity}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji?flagemojiToPNG(emoji):''}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker id="date" onChange={date=>setDate(date)} value={date} Format='dd//MM//yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
       <BackButton/>
      </div>
    </form>
  );
}

export default Form;
