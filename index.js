const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();

  // reportStatus('Loading trips...🛫');

  axios.get(URL)
    .then((response) => {
      console.log(response['data']);
      response['data'].forEach((trip) => {
        // include message about successfully loading n number of trips
        tripsList.append(`<li>${trip.name}</li>`)
      })
    })
    .catch((error) => {
      console.log(error)
    });
};


$(document).ready(() => {
  $('#load-trips-button').click(loadTrips);
  // $('#trip-form').submit(createTrip);
});

// $(document).foundation();

