const express = require('express');
const path = require('path');
require('dotenv').config(); // Import and configure dotenv

const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');



const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const multer = require('multer'); // Import multer for file uploads
const sqlite3 = require('sqlite3').verbose();
const sequelize = require('./config/database.js');
const cors = require('cors');

//const { Sequelize } = require('sequelize');
const passport = require('./auth'); // Import GitHub passport strategy from auth.js
const User = require('./models/sqlmodels/user.model');
const Event = require('./models/sqlmodels/event.model');
const Category = require('./models/sqlmodels/category.model'); // Adjust the path to your model

const PORT =  3000;
const app = express();
app.use(cookieParser());
app.use(cors());
require('dotenv').config();



// Initialize SQLite using sqlite3
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
      console.error('Could not connect to SQLite database', err);
    } else {
      console.log('Connected to SQLite');
    }
  });





  app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false } // Set secure to true if using HTTPS
  }));
  app.use(passport.initialize());
  app.use(passport.session());
// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  db.get(`SELECT * FROM current_user WHERE id = ?`, [id], (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});




app.use(cors()); // Allow all CORS requests for testing


// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
    },
  });
  
  const upload = multer({ storage: storage });






  // Middleware to parse JSON body
app.use(express.json()); // This parses incoming requests with JSON payloads

// If you're still using body-parser explicitly, make sure it's set up correctly
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Serve static files from the 'static' directory
app.use(express.static(path.resolve(__dirname, 'static')));
// Serve specific index.html from the 'static' directory
app.get('/index.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
});
app.get('/profile.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static', 'profile.html'));
});


app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home with session saved
    res.redirect('/home');
  }
);

app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      // If there's an error during logout, pass it to the next middleware
      return next(err);
    }
    // Successfully logged out, redirect to home page
    res.redirect('/home');
  });
});


  app.get('/api/current_user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user); // Send the logged-in user’s data to the frontend
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });




// Serve static files from the build directory
app.use('/home', express.static(path.resolve(__dirname, 'buildr')));

// Serve specific index.html for client-side routing compatibility
app.get('/home/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'buildr/index.html'));
});





    app.get('/api/events', (req, res) => {
        db.all(`
            SELECT 
                events.*, 
                Users.name AS creator_name, 
                Users.image AS creator_image
            FROM 
                events 
            LEFT JOIN 
                Users 
            ON 
                events.createdBy = Users.id
        `, [], (err, rows) => {
            if (err) {
                console.error("Error fetching events:", err);
                return res.status(500).send('Error fetching events');
            }
        
            try {
                // Modify rows to parse categoryIds
                const modifiedRows = rows.map(row => {
                    let parsedCategoryIds = JSON.parse(row.categoryIds || '[]');
                    parsedCategoryIds = parsedCategoryIds.filter(id => id !== null); // Remove null values
                    row.categoryIds = parsedCategoryIds;
                    return row;
                });
                res.json(modifiedRows);
            } catch (parseError) {
                console.error("Error parsing categoryIds in events:", parseError);
                res.status(500).send('Error parsing event data');
            }
        });
    });


    app.get('/api/events/:id', (req, res) => {
        const { id } = req.params;
      
        if (!id) {
          console.error("Event ID is missing in request parameters.");
          return res.status(400).json({ message: "Event ID is required." });
        }
      
        db.get(`
          SELECT 
            events.*, 
            Users.name AS creator_name, 
            Users.image AS creator_image
          FROM 
            events
          LEFT JOIN 
            Users
          ON 
            events.createdBy = Users.id
          WHERE 
            events.id = ?
        `, [id], (err, row) => {
          if (err) {
            console.error("Error fetching event:", err);
            return res.status(500).json({ message: 'Error fetching event' });
          }
      
          if (!row) {
            return res.status(404).json({ message: 'Event not found' });
          }
      
          try {
            // Parse categoryIds if it's stored as a JSON string in the database
            row.categoryIds = JSON.parse(row.categoryIds || '[]');
            res.json({
              ...row,
              _id: row.id // Convert 'id' to '_id' for compatibility with React component
            });
          } catch (parseError) {
            console.error("Error parsing categoryIds:", parseError);
            res.status(500).json({ message: 'Error parsing event data' });
          }
        });
      });
  
  // Example Route for Fetching Categories
  app.get('/api/categories', async (req, res) => {
    try {
      db.all(`SELECT * FROM Categories`, [], (err, rows) => {
        if (err) {
          console.error("Error fetching categories:", err);
          res.status(500).send('Error fetching categories');
          return;
        }
        res.json(rows);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send('Error fetching categories');
    }
  });
  
  // Example Route for Fetching Users
  app.get('/api/users', async (req, res) => {
    try {
      db.all(`SELECT * FROM Users`, [], (err, rows) => {
        if (err) {
          console.error("Error fetching users:", err);
          res.status(500).send('Error fetching users');
          return;
        }
        res.json(rows);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send('Error fetching users');
    }
  });
  


  app.post('/api/events', (req, res) => {
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;

    // Ensure categoryIds is properly parsed from JSON
    let parsedCategoryIds;
    try {
        parsedCategoryIds = JSON.parse(categoryIds); // Parse categoryIds if it's a JSON string
    } catch (error) {
        console.error("Error parsing categoryIds:", error);
        return res.status(400).send('Invalid categoryIds format');
    }

    db.run(`
        INSERT INTO events (title, description, image, startTime, endTime, location, categoryIds, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        title,
        description,
        image,
        startTime,
        endTime,
        location,
        JSON.stringify(parsedCategoryIds), // Store as a JSON string
        createdBy
    ], function (err) {
        if (err) {
            console.error("Error inserting event:", err);
            return res.status(500).send('Error creating event');
        }

        // Send back the created event including the new ID
        res.status(201).json({
            id: this.lastID,
            title,
            description,
            image,
            startTime,
            endTime,
            location,
            categoryIds: parsedCategoryIds,
            createdBy
        });
    });
});





app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    db.get(`SELECT * FROM current_user WHERE email = ?`, [email], async (err, row) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (row) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the current_user table
      db.run(
        `INSERT INTO current_user (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        function (err) {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ message: 'Error registering user' });
          }

          // Retrieve the newly created user for session management
          db.get(`SELECT * FROM current_user WHERE id = ?`, [this.lastID], (err, newUser) => {
            if (err) {
              console.error('Error retrieving new user from database:', err);
              return res.status(500).json({ message: 'Error registering user' });
            }

            // Use Passport's login function to create a session
            req.login(newUser, (err) => {
              if (err) {
                console.error('Error logging in new user:', err);
                return res.status(500).json({ message: 'Error logging in new user' });
              }

              // User successfully created and logged in
              res.status(201).json({ message: 'User registered successfully', user: newUser });
            });
          });
        }
      );
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});




  
  
  // Route to create a new user with avatar image link (optional)
  app.post('/users', upload.single('image'), async (req, res) => {
    try {
      const { name } = req.body;
      const file = req.file;
  
      // Validate input
      if (!name || !file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Get the next user ID (incremental)
      const lastUser = await User.findOne().sort({ id: -1 });
      const newUserId = lastUser ? lastUser.id + 1 : 1;
  
      // Construct image URL
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  
      const newUser = new User({
        id: newUserId,
        name,
        image: imageUrl,
      });
  
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Error saving user to database:", error);
      res.status(500).json({ message: 'Error saving user to the database', error: error.message });
    }
  });
  
  app.put('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, image, startTime, endTime, location, categoryIds, createdBy } = req.body;
  
    db.run(`
      UPDATE events
      SET title = ?, description = ?, image = ?, startTime = ?, endTime = ?, location = ?, categoryIds = ?, createdBy = ?
      WHERE id = ?
    `, [
      title,
      description,
      image,
      startTime,
      endTime,
      location,
      JSON.stringify(categoryIds),  // Store categoryIds as JSON string in SQLite
      createdBy,
      id
    ], function (err) {
      if (err) {
        console.error("Error updating event:", err);
        return res.status(500).send('Error updating event');
      }
  
      if (this.changes === 0) {
        return res.status(404).send('Event not found');
      }
  
      // Send updated event back to the client
      res.status(200).json({
        id: parseInt(id, 10), // Send back numeric ID
        title,
        description,
        image,
        startTime,
        endTime,
        location,
        categoryIds,
        createdBy
      });
    });
  });
  
  
 
// Route to update an existing event
app.get('/api/events/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        console.error("Event ID is missing in request parameters.");
        return res.status(400).send("Event ID is required.");
    }

    // Fetch the event by the ID provided in the request
    db.get(`
      SELECT 
        events.*, 
        Users.name AS creator_name, 
        Users.image AS creator_image
      FROM 
        events
      LEFT JOIN 
        Users
      ON 
        events.createdBy = Users.id
      WHERE 
        events.id = ?
    `, [id], (err, row) => {
      if (err) {
        console.error("Error fetching event:", err);
        return res.status(500).send('Error fetching event');
      }

      if (!row) {
        return res.status(404).send('Event not found');
      }

      try {
        // Parse categoryIds if it's stored as a JSON string in the database
        row.categoryIds = JSON.parse(row.categoryIds || '[]');
        res.json({
          ...row,
          _id: row.id // Convert 'id' to '_id' for compatibility with React component
        });
      } catch (parseError) {
        console.error("Error parsing categoryIds:", parseError);
        res.status(500).send('Error parsing event data');
      }
    });
});
  
  
  
  // Other routes (e.g., fetching events, categories, users)...
  // Route to delete an event
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if the ID is valid (should be an integer for SQLite)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
  
      // Find and delete the event by ID using Sequelize's `destroy` method
      const deletedEvent = await Event.destroy({
        where: {
          id: id
        }
      });
  
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
  });





// Example route to display personalized message
app.get('/welcome', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`Hey, ${username}! Welcome back!`);
  } else {
    res.send('Welcome, guest!');
  }
});




app.post('/submitmesx', async (req, res) => {
  try {
    // Extract name, email, and message from the form data
    const { name, email, message } = req.body;

    // Check if any of the fields are empty
    if (!name && !email && !message) {
      console.log("No valid data provided, skipping processing.");
      return res.status(400).send('No valid data provided.');
    }

    // Instantiate the Message class with the form data
    const userMessage = new Message(name, email, message);

    // Use the formattedMessage method to convert the properties into a string
    const formattedMessage = userMessage.formattedMessage();

    const TOKEN = "da95d54c576369870c39b46f762ba713";
    const ENDPOINT = "https://send.api.mailtrap.io/";

    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

    const sender = {
      email: "mailtrap@arnhem-front-end.site",
      name: "ryzhov",
    };

    const recipients = [
      { email: "torbezpeka.bayer.post@gmail.com" }
    ];

    // Send the primary email if there is a valid message
    if (message) {
      await client.send({
        from: sender,
        to: recipients,
        subject: "Hy from arnhem-front-end.site!",
        text: formattedMessage,
        category: "Integration Test",
      });

      console.log("Email sent successfully");
    }

    // Send the reply email only if the email is present and valid
    if (email) {
      await userMessage.sendReply();
      console.log("Reply email sent successfully");
    }

    // Write the message to a file only if the message text is present
    if (message) {
      const child = userMessage.writeToFile('user_message.txt');
      userMessage.catchErrorsMessage(child, res); // Handle child process errors
    } else {
      // If no file writing is necessary, still send the success response
      res.redirect('/profile.html');
    }

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send('Error processing your request');
  }
});

app.set('views', path.join(__dirname, 'views')); // Set the directory for views
app.set('view engine', 'ejs'); // Set EJS as the view engine










  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });