// The Front object is loaded through the Front script added in the header of the main HTML.
// This object can be used to listen to conversation event data as it occurs on Front, request information from Front, and perform actions on Front.
// See the full plugin API documentation here: https://dev.frontapp.com/plugin.html

// This keeps track of if Front has returned a conversation to the plugin.
let hasConversation;

// Listen for the `conversation` event from Front and print its contents, then load the contact to the plugin.
Front.on('conversation', function (data) {
  console.log('Event data', data);

  // Set the conversation state.
  hasConversation = true;

  // Load the Contact information based off of the event data. And set tab to 'Info'.
  loadContact(data.contact, data.conversation);
  
  // If attachments, show them
  resetAttachments();
  if (data.message && data.message.attachments && data.message.attachments.length > 0) {
    displayAttachments(data.message.attachments);
  }
});

// Listen for the `no_conversation` event.  This can happen when opened to Inbox Zero.
Front.on('no_conversation', function () {
  console.log('No conversation');

  // Set the conversation state.
  hasConversation = false;

  // Display `No Contact` data and clear the notes and set the tab to 'Info'.
  displayContactInfo();
  displayCRMInfo();
});

// Asynchronously loads the contact through our mocked CRM service once the body of the plugin is loaded.
// This will call our mocked CRM service for data and then add the contact information and notes to the page.
async function loadContact(contact, conversation) {
  // Display Front contact info.
  displayContactInfo(contact.display_name || contact.handle, contact.handle);

  // Build and display our CRM data.
  const crmData = await mockQueryCRM(contact.handle, conversation.subject, contact.source);

  // Cheap store
  window.crmData = crmData.info;

  displayCRMInfo(
    crmData.info.id,
    crmData.info.trackingId,
    crmData.info.location,
    crmData.info.pickup,
    crmData.info.delivery,
    crmData.info.status
  );
}

// Displays Front contact information.
function displayContactInfo(display_name = "No Contact", handle = "-") {
  const nameElement = document.getElementById("name");
  const handleElement = document.getElementById("handle");

  nameElement.textContent = display_name;
  handleElement.textContent = handle;
}

// Displays mocked CRM Info.
function displayCRMInfo(id = "-", trackingId = "-", location = "-", pickup = "-", delivery = "-", status = "-") {
  const idElement = document.getElementById("id");
  const trackingIdElement = document.getElementById("tracking-id");
  const locationElement = document.getElementById("location");
  const pickupElement = document.getElementById("pickup");
  const deliveryElement = document.getElementById("delivery");
  const statusElement = document.getElementById("status");

  idElement.textContent = id;
  trackingIdElement.textContent = trackingId;
  locationElement.textContent = location;
  pickupElement.textContent = pickup;
  deliveryElement.textContent = delivery;
  statusElement.textContent = status;
}

function updateStage() {
  const mockStatuses = [{id: 0, title: 'Pending dispatch'}, {id: 1, title: 'Dispatched'}, {id: 2, title: 'Delivered'}, {id: 3, title: 'Lost contact'}, {id: 4, title: 'Available'}];
  Front.fuzzylist({
    items: mockStatuses
  }, (item) => {
    const statusElement = document.getElementById("status");
    statusElement.textContent = item.title;
  });
}

function resetAttachments() {
  document.getElementById('attachments').innerHTML = '';
}

function displayAttachments(files) {
  const holder = document.getElementById('attachments');
  files.forEach(file => {
    const div = document.createElement('li');
    div.classList.add('attachment');
    div.textContent = file.filename;
    div.draggable = true;
    div.addEventListener('dragstart', (ev) => ev.dataTransfer.setData('filename', file.filename));
    holder.appendChild(div);
  });
}

function allowDrop(event) {
  event.preventDefault();
}

let hoverStateCounter = 0;
function activate(event) {
  if (hoverStateCounter === 0)
    event.target.classList.add('active');
  hoverStateCounter++;
}

function deactivate(event) {
  hoverStateCounter--;
  if (hoverStateCounter === 0)
    event.target.classList.remove('active');
}

function dropped(e) {
  console.log('dropped', e);
  hoverStateCounter = 0;
  const targetEl = e.target.classList.contains('attachment-drop') ? e.target : e.target.parentNode;
  targetEl.childNodes[1].textContent = e.dataTransfer.getData('filename');
  targetEl.classList.add('uploading');
  console.log(e);
  window.setTimeout(() => targetEl.childNodes[0].style.width = '20%', 500);
  window.setTimeout(() => targetEl.childNodes[0].style.width = '50%', 1000);
  window.setTimeout(() => targetEl.childNodes[0].style.width = '90%', 1500);
  window.setTimeout(() => {
    targetEl.childNodes[0].style.width = '0%';
    targetEl.classList.remove('uploading');
    targetEl.classList.add('done');
  }, 2000);
  
}

function draftUpdate() {
  const data = window.crmData;

  Front.reply({
    body: `Here is an update on shipment #${data.trackingId} for ${data.location}:

Cargo was picked up on ${data.pickup} and is expected to be delivered on ${data.delivery}. The current status is: ${data.status.toLowerCase()}.
    
Thanks for your patience, let us know if you have additional questions.
`
  });
}