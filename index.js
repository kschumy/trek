const URL = 'https://ada-backtrek-api.herokuapp.com/trips';

const getTripURL = (tripId) => {
  return `https://ada-backtrek-api.herokuapp.com/trips/${tripId}`;
};

const loadTrips = () => {
  const tripsList = $('#trips-list');
  tripsList.empty();

  // reportStatus('Loading trips...🛫');

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
  // console.log(getTripURL(tripID));
  const tripInfo = $('#trip-info');
  tripInfo.empty();

  // tripURL =

  axios.get(getTripURL(tripID))
    .then((response) => {
      console.log(response);

      tripInfo.append(`<p>${response['data']['name']}</p><p>${response['data']['about']}</p><p>${response['data']['category']}</p>`)

      // response['data'].forEach((trip) => {
      //   // include message about successfully loading n number of trips
      //   tripsList.append(`<li>${trip.name}</li>`)
      // })
    })
    .catch((error) => {
      console.log(error)
    });
};



$(document).ready(() => {
  $('#load-trips-button').click(loadTrips);
  // $('#trip-form').submit(createTrip);
  $('#trips-list').on('click', function(event) {
    let foo = event.target.classList[1];
    // console.log("hi");
    // console.log(event.target.classList[1]);
    // console.log(`"${$(this).html()}"`);
    getTrip(foo);
    // console.log(`results: "${$(this).html()}"`);
  });
});

// $(document).foundation();

// .target.className