const inputField = name => $(`#pet-form input[name="${name}"]`); // one line arrow function

const readFormData = () => {
  const getInput = name => {
    const input = inputField(name).val();
    return input ? input : undefined;
  };

  const formData = {};
  FORM_FIELDS.forEach((field) =>{
    formData[field] = getInput(field);
  });
  return formData;
};

const clearForm = () => {
  FORM_FIELDS.forEach((field) => {
    inputField(field).val('');
  });
};

const POSTURL = ' https://ada-backtrek-api.herokuapp.com/trips';




const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTripURL = (tripId) => { return `${URL}/${tripId}` };

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();
  axios.get(URL)
    .then((response) => {
      console.log(response['data']);
      response['data'].forEach((trip) => {
        // include message about successfully loading n number of trips
        tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
      })
    })
    .catch((error) => {
      console.log(error)
    });
};

const getTrip = (tripID) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
    .then((response) => {
      console.log(response);
      tripInfo.append(`<p>${response['data']['name']}</p><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`)
    })
    .catch((error) => {
      console.log(error)
    });
};

const createReservation = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload
  event.preventDefault();
  // from the form (aka the stuff on the HTML, figure out what the new pet should look like.

  let reservationData = readReservationData(); // new verson. See below.

  // ORIGINAL VERSION
  // let petData = {};
  // petData['name'] = $(`input[name="name"]`).val();
  // petData['age'] = $(`input[name="age"]`).val();
  // petData['owner'] = $(`input[name="owner"]`).val();
  // console.log(petData);

  // make a POST request to the Pets API
  // make sure it's the right endpoint
  // with the right data
  axios.post(URL, petData)
    .then((response) => {
      // console.log(response);
      reportStatus(`Successfully added a pet with ID ${response.data.id}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });

  // Display any feedback we want to give to the user
  clearForm();
};


const ampers = () => {
  axios.post(POSTURL,
    {'name': 'Ampers are the best', 'continent': 'North America', 'about': 'Literally the best of all times.', 'category': '#1', 'weeks': 42, 'cost': 125.43})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error.response);
  });
};

$(document).ready(() => {

  $('#load-trips-button').click(loadTrips);
  $('#fuck-yeah-ampers-button').click(ampers);
  $('#trips-list').on('click', function(event) {
    getTrip(event.target.classList[1]);
  });

});
