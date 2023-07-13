import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, queryCallback) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["lodging"]}
  );

  autoComplete.setFields(["name", "formatted_address", 'geometry.location']);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, queryCallback)
  );
}

async function handlePlaceSelect(updateQuery, queryCallback) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.name;
  updateQuery(query)
  //console.log(addressObject);
  // 콜백 함수 호출
  if (typeof queryCallback === 'function') {
    queryCallback(addressObject);
  }
 
}

function SearchLocationInput({queryCallback}) {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAQRIT2tpNRKu9hleY2y7XHil4qxRyFGv8&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, queryCallback)
    );
  }, []);

  return (
    <label className="input-st search" name="placeSearch">
        <input ref={autoCompleteRef} type="text" id="placeSearch" name="placeSearch" onChange={event => setQuery(event.target.value)} value={query} placeholder='검색어를 입력해 주세요.' />
    </label>
  );
}

export default SearchLocationInput;