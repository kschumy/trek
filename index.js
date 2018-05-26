const FORM_FIELDS = ['name', 'email'];
const inputField = name => $(`#reservation-form input[name="${name}"]`);
const getInput = name => { return inputField(name).val() || undefined };

const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field); });
  return formData;
};


const clearForm = () => {
  FORM_FIELDS.forEach((field) => { inputField(field).val(''); });
};

const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${URL}/${tripId}/reservations` };

const reportStatus = (message) => { $('#status-message').html(message); };

const reportError = (message, errors) => {
  let content = '';
  for (const field in errors) {
    for (const problem of errors[field]) { content += `<li>${field}: ${problem}</li>`; }
  }
  reportStatus(`<p>${message}</p><ul>${content}</ul>`);
};


const tripLink = function tripLink(tripId) {
  const getTripURL = getTripURL(tripId);
  const mather = function mather(num)  {
    return num ** power;
  };

  return mather;
};

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();

  axios.get(URL)
    .then((response) => {
      response['data'].forEach((trip) => {
        // let tripURL = `${URL}/${trip.id}`;
        // const newDiv = document.createElement('li');
        //   $(`this`).on('click', function(tripURL) {
        //   );
        //
        //   }
        // }
        // include message about successfully loading n number of trips
        tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
      })
    })
    .catch((error) => {
      console.log(error)
    });
};
// const getTrip = (tripURL) => {
//   const tripInfo = $('#trip-info');
//   tripInfo.empty();
//   axios.get(tripURL)
//     .then((response) => {
//       // console.log(response['data']);
//       tripInfo.append(`<h3 class='${tripID}'>${response['data']['name']}</h3><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`);
//       // loadForm(`${response['data']['name']}`);
//     })
//     .catch((error) => {
//       console.log(error)
//     });
//
// };


const getTrip = (tripID) => {
  const tripInfo = $('#trip-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
    .then((response) => {
      // console.log(response['data']);
      tripInfo.append(`<h3 class='${tripID}'>${response['data']['name']}</h3><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`);
      // loadForm(`${response['data']['name']}`);
    })
    .catch((error) => {
      console.log(error)
    });

};

// const loadForm = (tripName) => {
//   const formBullshit = $('#trip-name-for-form');
//   formBullshit.empty();
//   $(formBullshit).append(tripName);
// };

const createReservation = (event) => {
  event.preventDefault();
  let reservationData = reservationFormData();
  // console.log(`#trip-info h3`);
  const reservationURL = getReservationURL($('#trip-info h3')['0'].classList[0]);

  axios.post(reservationURL, reservationData)
    .then((response) => {
      console.log(response);
      reportStatus(`Successfully added a reservation with ID ${response.data.trip_id}!`);
      // clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        console.log(error.response.data.errors);
        reportError(
          `Encountered an error: ${error.message}`,
          error.response.data.errors
        );
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
  // clearForm();
};

$(document).ready(() => {
  $('.hidden-at-start').hide();

  $('#load-trips-button').on('click', function(event) {
    $('#list').slideDown('slow');
      // .promise().done(function() {
      loadTrips(event);
    // });
  });

  $('#trips-list').on('click', function(event) {
    $('.side-info').slideUp('slow')
      .promise().done(function() {
        getTrip(event.target.classList[1]);
        $('.side-info').slideDown('slow');
    });
  });

  // $('#trip-info').on('scroll', function() {});
  $('#reservation-form').on('submit', function(event) { createReservation(event); });
});




// $('#fuck-yeah-ampers-button').click(ampers);
