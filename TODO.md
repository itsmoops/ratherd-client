TODO

Finish user system
Integrate LESS or SASS to improve styling productivity
Live reload from grunt would be nice

Contact Link at bottom (right/center) of Info page

"This sucks" button:
* Display under Rather button
* Flag glyphicon
* Incrementing this_sucks field on rather model
* Need to add active flag on rather model - default value is 1
* On PUT, if ((this_sucks > arbitrary number) && (ratio < arbitrary_number) && (total_games > arbitrary_number)), set active flag to 0
* Inactive rathers should not be allowed to be displayed in the game
* Possible popup with options (ex. Nonsense, Not funny, etc.)

"Info" or "Stats" button:
* Display: Possible button underneath Rather button or possibly an icon on the bottom right of the button iteslf
* Pops up modal (on top of the rather which it was selected? in the center?) to display stats about a specific Rather
* Stats glyphicon
* Stats should include
** User
** Wins
** Losses
** Win ratio
** "This sucks" votes (+ reason?)

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

Include Facebook API:
* Ability to log in through Facebook
* Ability to share funny question to Facebook