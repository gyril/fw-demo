// This file provides fake CRM functionality to provide information to the sample plugin
// and should be seen as an analog for the functionality developers add for their custom plugin.
//
// This function returns mock CRM data and simply picks a random index from the mockStatus and organizes data related to the index.

const accounts = [
  'Little Shipper LLC',
  'Transatlantic Inc.',
  'The Fruit Company',
  'Spencer, Sims & Jung',
  'Logitech',
  'Hitachi USA',
  'Trucks United',
  'Always On-Time',
  'Expedite SA',
  'C&C GmbH',
];

const statuses = ['Pending dispatch', 'Dispatched', 'Delivered', 'Lost contact', 'Available'];

function mockQueryCRM(email, subject, source) {
  const dzElement = document.getElementById("dropzone");
  dzElement.classList.remove('dropped');

  return new Promise(function(resolve) {
    console.log(`Build mock CRM data for ${email}`);

    const trackingId = subject.match(/\d+/g);

    if (!trackingId)
      return resolve({});

    const info = {
      id: Math.floor(Math.random() * 1000),
      trackingId: trackingId[0],
      location: accounts[Math.round(Math.random() * accounts.length)],
      pickup: moment().subtract(Math.round(Math.random() * 48 + 24), 'hours').format('DD/MM/YY \\at HH:00'),
      delivery: moment().format('DD/MM/YY \\at HH:00'),
      status: statuses[Math.round(Math.random() * statuses.length)],
    };

    resolve({info});
  });
}
