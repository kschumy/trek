const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reservation-form input[name="${name}"]`);

const reservationFormData = () => {
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

const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${URL}/${tripId}/reservations` };

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
      tripInfo.append(`<h3 class='${tripID}'>${response['data']['name']}</h3><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`);
      loadForm(`${response['data']['name']}`);
      // const tripNameForForm = $('#trip-name-for-form');
      // tripNameForForm.clear();
      // tripNameForForm.append(`<p>${response['data']['name']}</p>`);
    })
    .catch((error) => {
      console.log(error)
    });

};

const loadForm =(tripName) => {
  const formBullshit = $('#trip-name-for-form');
  formBullshit.empty();
  $(formBullshit).append(tripName);
};



// https://ada-backtrek-api.herokuapp.com/trips/1/reservations
// const loadReservationForm = (tripNameAndId) => {
//   // const tripNameAndId = $('#trip-info');
//   // tripInfo.empty();
//   const tripName = tripNameAndId[0];
//   const tripid = tripNameAndId[1];
//   axios.post(getReservationURL(tripID))
//     .then((response) => {
//       console.log(response);
//
//     })
//     .catch((error) => {
//       console.log(error)
//     });
// };

const createReservation = (event) => {
  // Note that createPet is a handler for a `submit`
  // event, which means we need to call `preventDefault`
  // to avoid a page reload


  event.preventDefault();
  let reservationData = reservationFormData(); // new verson. See below.
  const reservationURL = getReservationURL($('#trip-info h3')['0'].classList[0]);
  // ORIGINAL VERSION
  // let petData = {};
  // petData['name'] = $(`input[name="name"]`).val();
  // petData['age'] = $(`input[name="age"]`).val();
  // petData['owner'] = $(`input[name="owner"]`).val();
  // console.log(petData);

  // make a POST request to the Pets API
  // make sure it's the right endpoint
  // with the right data
  axios.post(reservationURL, reservationData)
    .then((response) => {
      console.log(response);

      // reportStatus(`Successfully added a reservation with ID ${response.data.id}!`);
      // clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        console.log(error.response.data.errors);
        // reportError(
        //   `Encountered an error: ${error.message}`,
        //   error.response.data.errors
        // );
      } else {
        // reportStatus(`Encountered an error: ${error.message}`);
      }
    });

  // Display any feedback we want to give to the user
  // clearForm();
};
// const ampers = () => {
//   axios.post(POSTURL,
//     {'name': 'Ampers 👏👏', 'continent': 'North America', 'about': '❤️', 'category': '#1', 'weeks': 42, 'cost': 42.42})
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error.response);
//   });
// };



$(document).ready(() => {

  $('#load-trips-button').click(loadTrips);
  $('#trips-list').on('click', function(event) { getTrip(event.target.classList[1]); });
  $('#reservation-form').on('submit', function(event) {
    createReservation(event);
    // event.preventDefault();
    // // const someshit = $('#trip-info h3');
    // console.log('foo');
    // console.log($('#trip-info h3')['0'].classList[0]);
    // console.log('bar');
    // getTrip(event.target.classList[1]);
  });
  // $('#fuck-yeah-ampers-button').click(ampers);

});


// const ampers = () => {
//   axios.post(POSTURL,
//     {'name': 'Ampers are the best', 'continent': 'North America', 'about': 'Literally the best of all times.', 'category': '#1', 'weeks': 42, 'cost': 125.43})
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error.response);
//   });
// };

// $('#fuck-yeah-ampers-button').click(ampers);
