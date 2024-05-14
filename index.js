const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'MY_TOKEN';

// Render the update page and pass the email value to the template
app.get('/update', (req, res) => {
    // Assuming you have the email stored somewhere (e.g., retrieved from the database)
    const email = 'example@example.com'; // Replace with the actual email value
    res.render('update', { title: 'Update Contact | HubSpot APIs', email: email });
});

// Handle form submission for updating contact's favorite book
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.body.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        // Redirect to the contacts page after updating
        res.redirect('/contacts');
    } catch(err) {
        console.error(err);
    }
});

// Render the contacts page
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
