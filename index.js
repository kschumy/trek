const FORM_FIELDS = ['name', 'email'];
const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
let continents = new Set(['Antartica', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australasia']);
// const CONTINENTS = ['Antartica', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australasia'];


const inputField = name => $(`#reservation-form input[name="${name}"]`);
const getInput = name => { return inputField(name).val() || undefined };

// Provided field must be a String. Returns HTML for a form field with name of provided field.
const formFieldHTMLString = field => {
  return `<label for=${field}>${field.toUpperCase()}</label><input type='string' name=${field} id=${field} />`;
};

// Returns a Map of the reservation form data, which the keys as form field names and the values as
// the
const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field); });
  return formData;
};

// Returns a String of HTML for the reservation form.
const loadForm = () => {
  let form = `<section id='book'><h4>Reserve Trip</h4><form id='reservation-form'>`;
  FORM_FIELDS.forEach((field) => { form += formFieldHTMLString(field) });
  form += `<br /><input type="submit" name="add-reservation" value="Add Reservation" /></form></section>`;
  return form;
};

// Sets all
const clearForm = () => { FORM_FIELDS.forEach((field) => { inputField(field).val(''); }) };



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


const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();
  axios.get(URL)
    .then((response) => {
      response['data'].forEach((trip) => {
        continents.add(trip.continent); // updates continents list if new continent
        tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
      });

      // for (let entry of continents) {
      //   console.log(entry);
      //   // expected output: [42, 42]
      //   // expected output: ["forty two", "forty two"]
      // }
    continents.forEach((continent) => {
     $('#filers').append(`<option value="${continent}">${continent}</option>`)
    });
    })
    .catch((error) => {
      console.log(error)
    });
};

const getTrip = (tripID) => {
  const tripInfo = $('#right-side-info');
  tripInfo.empty();
  axios.get(getTripURL(tripID))
    .then((response) => {
      tripInfo.append(`<section id="trip-info"><h3 class='${tripID}'>${response['data']['name']}</h3><p>${response['data']['about']}</p><p>${response['data']['category']}</p></section>`);
      tripInfo.append(loadForm());
    })
    .catch((error) => {
      console.log(error)
    });

};

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
  $('#filters').on('select', function(event) {
    const tripsList = $('#trips-list');
    tripsList.empty();
    axios.get(URL + '/continent?query=Asia')
      .then((response) => {
        response['data'].forEach((trip) => {
          tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
        })
      })
      .catch((error) => {
        console.log(error)
      });
  });

  // $('#trip-info').on('scroll', function() {});
  $('#reservation-form').on('submit', function(event) { createReservation(event); });
});




// $('#fuck-yeah-ampers-button').click(ampers);
