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
  const dropElements = document.getElementsByClassName("attachment-drop");
  for (var i = 0; i < dropElements.length; i++) {
    const el = dropElements[i];
    el.innerHTML = '<span class="progress"></span><em>Drop attachment</em>';
    el.classList.remove('active');
    el.classList.remove('done');
  }

  return new Promise(function(resolve) {
    console.log(`Build mock CRM data for ${email}`);

    const trackingId = subject.match(/#[A-Z0-9]+/g);

    if (!trackingId)
      return resolve({info: {}});

    const info = {
      id: Math.floor(Math.random() * 1000),
      trackingId: trackingId[0].substr(1),
      location: accounts[Math.floor(Math.random() * accounts.length)],
      pickup: moment().subtract(Math.round(Math.random() * 48 + 24), 'hours').format('DD/MM/YY \\at HH:00'),
      delivery: moment().format('DD/MM/YY \\at HH:00'),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };

    resolve({info});
  });
}
