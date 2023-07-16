import React, { useState } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

function SearchLocationInput({ queryCallback }) {
  const [query, setQuery] = useState("");

  const onPlaceChanged = () => {
    // Handle place selection here
    const place = autoCompleteRef.current.getPlace();
    const query = place.name;
    setQuery(query);

    // Call the callback function if provided
    if (typeof queryCallback === "function") {
      queryCallback(place);
    }
  };

  const autoCompleteRef = React.useRef(null);

  return (
    <label className="input-st search" name="placeSearch">
      <LoadScript googleMapsApiKey="AIzaSyAQRIT2tpNRKu9hleY2y7XHil4qxRyFGv8" libraries={["places"]}>
        <Autocomplete
          onLoad={(autoComplete) => {
            autoCompleteRef.current = autoComplete;
            autoComplete.setOptions({
              types: ["lodging"]
            });
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            id="placeSearch"
            name="placeSearch"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            placeholder="검색어를 입력해 주세요."
          />
        </Autocomplete>
      </LoadScript>
    </label>
  );
}

export default SearchLocationInput;