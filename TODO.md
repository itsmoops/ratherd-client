TODO:

Integrate LESS or SASS to improve styling productivity

Live reload from grunt would be nice

Check for better font

Consider different background image/gradient

Info link should be on splash page as well as navbar

If database is down, would you rather... go outside? because our servers are down. Try again later

Finish user system:
* Check if username exists
* Ability to reset password
* Password strength
* Only one user per email

Login/Signup Pages:
* Look at Facebook and some other login pages. Tighten up the styles. Panels are too wide.
* Make signup/login buttons stretch to be the same size as the input fields. Round Edges. Make bigger.
* Signup: make it so input fields don't turn yellow on blur

Recover Password:
* Check if username exists, respond with message if not
* Send email from django with a link to reset the password

Play Page:
* Have a different color rather panel if one rather is submitted by the user?
* Timer for how long it takes?

"This sucks" button:
* Display under Rather button
* Flag/Thumbs Down glyphicon
* Incrementing this_sucks field on rather model
* Need to add active flag on rather model - default value is 1
* On PUT, if ((this_sucks > arbitrary_number) && (ratio < arbitrary_number) && (total_games > arbitrary_number)), set active flag to 0
* Inactive rathers should not be allowed to be displayed in the game
* Possible popup with options (ex. Nonsense, Not funny, etc.)

"Info" or "Stats" button:
* Display: Possible button underneath Rather button or possibly an icon on the bottom right of the button iteslf
* Pops up modal (on top of the rather which it was selected? in the center?) to display stats about a specific Rather
* Stats glyphicon
* Stats should include
** User
** Date submitted
** Wins
** Losses
** Win ratio
** "This sucks" votes (+ reason?)

Submit Page
* On submit in django, convert to lowercase and check against database to make sure not a duplicate
* Probably have submit button match the styles of signup/login buttons
* Think about fixing the fading success messages
* Think about whether the success messages should be funny or just "success"

Info Page:
* Icon glyphicon in top right?
* Should display general point of the game (GOOD COPY)
* Should explain the social aspect
* Should explain the ability to create and track your own Rathers
* Should cover details about:
** How rathers are paired up against their best opponent
** Specifics about:
*** How many games a Rather must have played before it can be considered for a leaderboard
*** How your Rather can be deactivated if it meets certain criteria
* Contact Link

User Page:
* Display all Rathers in Sortable, Paginated List
* Click a Rather and go to stats:
** Date submitted
** Wins
** Losses
** Win ratio
** "This sucks" votes (+ reason?)
** Think about tracking more historical data like who it won against
** Each Rather should have the option to delete (with a warning)
* ** Send email from django with a link to reset the password

Include Facebook API:
* Ability to log in through Facebook
* Ability to share funny question to Facebook