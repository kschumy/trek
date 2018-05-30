// Sets and Arrays  ////////////////////////////////////////////////////////////////////////////////
const FORM_FIELDS = ['name', 'email'];
let continents = new Set([
  'Antartica', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australasia'
]);
const INFO_FIELD = ['about','continent', 'category', 'weeks', 'cost'];

// URL logic ///////////////////////////////////////////////////////////////////////////////////////
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${getTripURL(tripId)}/reservations` };
const getQueryByLocationURL = (continent) => { return `${URL}/continent?query=${continent}/` };

// One trip info components ////////////////////////////////////////////////////////////////////////
const selectedTripInfo = (data) => {
  let returnString = `<section id='trip-info'><h3>${data['name']}</h3>`;
  INFO_FIELD.forEach((infoField) => {
    returnString +=
      `<p><strong>${infoField}: </strong><span class='info-field'>${data[`${infoField}`]}</span></p>`;
  });
  returnString += `</section>`;
  return returnString;
};

// Form building components ////////////////////////////////////////////////////////////////////////
// Returns a form String field for provided field.
const formFieldHTMLString = (field) => {
  return `<label for=${field}>${field}</label><input type='string' name=${field} id=${field} />`;
};

const inputField = name => $(`#reservation-form input[name='${name}']`);
const getInput = name => { return inputField(name).val() || undefined };

// Returns a Map of the reservation form data, which the keys as form field names and the values as
// the user-provided input to the reservation form.
const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field) });
  return formData;
};

// Returns a String of HTML for the reservation form.
const loadForm = () => {
  let resFormString = `<section id='book'><h4>Reserve Trip</h4><form id='reservation-form'>`;
  FORM_FIELDS.forEach((field) => { resFormString += formFieldHTMLString(field) });
  resFormString +=
    `<br /><input type='submit' name='add-reservation' value='Add Reservation' /></form></section>`;
  return resFormString;
};

// Clears all form fields.
const clearForm = () => { FORM_FIELDS.forEach((field) => { inputField(field).val(''); }) };

// Error/message reporting  ////////////////////////////////////////////////////////////////////////
const reportStatus = (message) => { $('#status-message').html(message); };


const reportError = (message, errors) => {
  let content = '';
  for (const field in errors) {
    for (const problem of errors[field]) { content += `${field}: ${problem}. `; }
  }
  reportStatus(`<p>${message} ${content}</p>`);
};

// Get all trips  //////////////////////////////////////////////////////////////////////////////////
const loadTrips = (query) => {
  const tripsList = $('#trips-list');
  tripsList.empty();
  loadTripURL = query === null ? URL : getQueryByLocationURL(query);
  axios.get(loadTripURL)
    .then((response) => {
      response['data'].forEach((trip) => {
        continents.add(trip.continent); // updates continents list if new continent
        tripsList.append(`<li class='trip ${trip.id}'>${trip.name}</li>`)
      });
    })
    .catch((error) => { console.log(error) }
    );
};

// Get one trip  ///////////////////////////////////////////////////////////////////////////////////
const getTrip = (tripID) => {
  const tripInfo = $('#right-side-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
    .then((response) => {
      tripInfo.append(selectedTripInfo(response['data']))
              .append(loadForm()); // reservation form
      $('#reservation-form').submit(function(event) { createReservation(event, tripID); });
    })
    .catch((error) => {
      console.log(error)
    });
};

// Post new reservation  ///////////////////////////////////////////////////////////////////////////
const createReservation = (event, tripID) => {
  event.preventDefault();
  axios.post(getReservationURL(tripID), reservationFormData())
    .then((response) => {
      reportStatus(`Successfully added a reservation with ID ${response.data.trip_id}!`);
      clearForm();
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.data && error.response.data.errors) {
        console.log(error.response.data.errors);
        reportError(`Oh no! `, error.response.data.errors);
      } else {
        reportStatus(`Encountered an error: ${error.message}`);
      }
    });
};

// $(document).ready... ////////////////////////////////////////////////////////////////////////////
$(document).ready(() => {
  $('.hidden-at-start').hide();

  $('#load-trips-button').on('click', function() {
    $('#list').slideDown('slow');
    loadTrips(null);
  });

  $('#trips-list').on('click', function(event) {
    $('.side-info').slideUp('slow')
      .promise().done(function() {
        getTrip(event.target.classList[1]);
        $('.side-info').slideDown('slow');
    });
  });

});