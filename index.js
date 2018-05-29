const FORM_FIELDS = ['name', 'email'];
let continents = new Set([
  'Antartica', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australasia'
]);


const URL = 'https://ada-backtrek-api.herokuapp.com/trips';
const getTripURL = (tripId) => { return `${URL}/${tripId}` };
const getReservationURL = (tripId) => { return `${getTripURL(tripId)}/reservations` };
const getQueryByLocationURL = (continent) => { return `${URL}/continent?query=${continent}/` };

const formFieldHTMLString = field => {
  return `<label for=${field}>${field.toUpperCase()}</label><input type='string' name=${field} id=${field} />`;
};


const inputField = name => $(`#reservation-form input[name="${name}"]`);
const getInput = name => { return inputField(name).val() || undefined };

// Returns a Map of the reservation form data, which the keys as form field names and the values as
// the
const reservationFormData = () => {
  const formData = {};
  FORM_FIELDS.forEach((field) => { formData[field] = getInput(field); });
  return formData;
};

// TODO: Complete after filter with budget
const filterFormData = () => {
};

// Returns a String of HTML for the reservation form.
const loadForm = () => {
  let resFormString = `<section id='book'><h4>Reserve Trip</h4><form id='reservation-form'>`;
  FORM_FIELDS.forEach((field) => { resFormString += formFieldHTMLString(field) });
  resFormString += `<br /><input type="submit" name="add-reservation" value="Add Reservation" /></form></section>`;
  return resFormString;
};

// Sets all
const clearForm = () => { FORM_FIELDS.forEach((field) => { inputField(field).val(''); }) };

const reportStatus = (message) => { $('#status-message').html(message); };

const reportError = (message, errors) => {
  let content = '';
  for (const field in errors) {
    for (const problem of errors[field]) { content += `<li>${field}: ${problem}</li>`; }
  }
  reportStatus(`<p>${message}</p><ul>${content}</ul>`);
};

const loadTrips = (query) => {
  const tripsList = $('#trips-list');
  tripsList.empty();
  loadTripURL = query === null ? URL : getQueryByLocationURL(query);
  axios.get(loadTripURL)
    .then((response) => {
      response['data'].forEach((trip) => {
        continents.add(trip.continent); // updates continents list if new continent
        tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
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

const filterTrips = (event) => {
  event.preventDefault();
  console.log(event);
};


const loadFilter = () => {
  const formFilterInfo = $('#right-side-info');
  formFilterInfo.empty();
  // let fuckThis = `;
  // fuckThis += ``;
  // fuckThis += ``;
  // // continents.forEach((continent) => {
  // //   // console.log(contString);
  // //   fuckThis += `<li class='${continent}'>${continent}</li>`;
  // // });
  // fuckThis += ``;
  formFilterInfo.append(`<section id='book'><h4>Filter Trips</h4><ul><li class='continent asia'>Asia</li><li class='continent africa'>Africa</li></ul></section>`);
  // let fuckThis = '';
  // fuckThis += `<section id='whole-right-subside'><h4>Filter Trips</h4><form id='filter-trips-form'><select>`;
  // continents.forEach((continent) => {
  //   // console.log(contString);
  //   fuckThis += `<option value='${continent}'>${continent}</option>`;
  // });
  // fuckThis += `</select><br /><input type='submit' name='filter-trips' value='Filter' /></form></section>`;
  // formFilterInfo.append(fuckThis);
};

const createReservation = (event) => {
  event.preventDefault();
  let reservationData = reservationFormData();
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

  $('#load-trips-button').on('click', function() {
    $('#list').slideDown('slow');
      // .promise().done(function() {
      loadTrips(null);
    // });
  });

  $('#trips-list').on('click', function(event) {
    $('.side-info').slideUp('slow')
      .promise().done(function() {
        getTrip(event.target.classList[1]);
        $('.side-info').slideDown('slow');
    });
  });
  $('#filter-trips-button').on('click', function(event) {
    $('.side-info').slideUp('slow')
      .promise().done(function() {
      loadFilter();
      $('.side-info').slideDown('slow');
    });
    // axios.get(URL + '/continent?query=Asia')
    //   .then((response) => {
    //     response['data'].forEach((trip) => {
    //       tripsList.append(`<li class="trip ${trip.id}">${trip.name}</li>`)
    //     })
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   });
  });
  $('#book li .asia').on('click', function(event) {
    console.log('foo');
    // $('#trips-list').slideUp('slow')
    //   .promise().done(function() {
    $('#list').slideDown('slow');
    // throw "fuck this";
    filterTrips(event);
        // console.log(${`#filter-trips-form`});
      // loadTrips(select(name).val());
      // $('#trips-list').slideDown('slow');
    // });

  });

  // $('#trip-info').on('scroll', function() {});
  $('#reservation-form').on('submit', function(event) { createReservation(event); });
});




// $('#fuck-yeah-ampers-button').click(ampers);


// const loadFilter = () => {
//   const tripInfo = $('#right-side-info');
//   tripInfo.empty();
//
//   const formFoo = formInfo();
//   tripInfo.append(`${formFoo.formStart('whole-right-subside', 'Filter Trips', 'filter-trips-form')}`);
//   // TODO: do not delete! Use for filter with budget
//   // $(`#whole-right-subside`).append(`${formFoo.numberField('budget')}`)
//   $(`#filter-trips-form`).append(`${formFoo.selectField(continents)}`)
//     .append(`${formFoo.formEnd('filter-trips', 'Filter')}`);
//
//   // $('.filter-trips').on('click', function(event) {
//   //   $('.side-info').slideUp('slow')
//   //     .promise().done(function() {
//   //     loadFilter();
//   //     $('.side-info').slideDown('slow');
//   //   });
//   // console.log(formFoo.stringField('foo'));
//   // tripInfo.append(`<section id="whole-right-subside">${formFoo.stringField('foo')}</section>`);
// };

// let formInfo = function formInfo() {
//   function inputField(field, type) {
//     return `<label for=${field}>${field.toUpperCase()}</label>
//             <input type=${type} name=${field} id=${field} />`;
//   }
//   return {
//     formStart: function(sectionID, formName,formID) {
//       return `<section id=${sectionID}><h4>${formName}</h4><form id=${formID}>`;
//     },
//     formEnd: function(submitName, submitValue) {
//       return `<br /><input type="submit" name=${submitName} value=${submitValue} /></form></section>`;
//     },
//     stringField: function(field) {
//       return inputField(field, 'string');
//     },
//     selectField: function(selectionOptions) {
//       let selectionString = `<select>`;
//       selectionOptions.forEach((item) => {
//         selectionString += (`<option value=${item}>${item}</option>`)
//       });
//       selectionString += `</select>`;
//       return selectionString;
//     },
//     numberField: function(field) {
//       return inputField(field, 'integer');
//     }
//   }
// };