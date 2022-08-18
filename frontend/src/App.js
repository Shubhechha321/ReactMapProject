import { Room, Star } from "@material-ui/icons";
import * as React from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import "./app.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
 
function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = React.useState(myStorage.getItem("user"));
  const [newPlace, setNewPlace] = React.useState(null);
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [star, setStar] = React.useState(0);
  const [viewState, setViewState] = React.useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 4
  });
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  

  React.useEffect(()=>{
    const getPins = async ()=>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getPins();
  },[]);

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    console.log(id);
    setViewState({ ...viewState, latitude: lat, longitude: lng });
  };

  const handleAddClick = (e) => {
    console.log(e);
    const lat = e.lngLat.lng;
    const long = e.lngLat.lat;
    console.log(long);
    setNewPlace({
      long,
      lat
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.long,
      long: newPlace.lat,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: "100%", height: 600}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      onDblClick={handleAddClick}
      duration="200"
      
    >
      {/* {pins.map(p => ())}; */}
      {pins.map(p => (
      <>
      <Marker latitude={p.lat} longitude={p.long}
      offsetLeft={-3.5 * viewState.zoom}
      offsetTop={-7 * viewState.zoom}
      >
        <Room
          style={{
            fontSize: 7 * viewState.zoom,
            color:
                    currentUsername === p.username ? "tomato" : "slateblue",
            cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
        />
      </Marker>
      {p._id === currentPlaceId && (
      <Popup longitude={p.long} latitude={p.lat}
      anchor="bottom"
      closeButton={true}
      closeOnClick={false}
      onClose={() => setCurrentPlaceId(null)}
      >
      <div className="card">
      <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
      </div>
    </Popup>)
      }
      {newPlace && (
        <Popup longitude={newPlace.lat} latitude={newPlace.long}
        anchor="bottom"
        onClose={() => setNewPlace(null)}
        >
          <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
          </Popup>
      )}
       
    </>

      ))};
      {currentUsername ? (
          <button className="button logout"
           onClick={handleLogout}
          >
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" 
            onClick={() => setShowLogin(true)}
            >
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
    </Map>
  );
}
  export default App;