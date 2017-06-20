Edit the .bat file (in case you don't have a D drive) and run it.
- react & axios are used to load the data from the api (ws.js file)
- objects of class Story will be loaded into the view as soon as the last callback is done
- getting the random ids: 10 times picking a random array-position number and removing it afterwards, so it does not re-occur
- using callbacks to load dependent data
- another requirement was to show items (sorted) on page when all of them are done loading. Going through the array twice, switching the items' position if the order isn't ascending
- putting all data in the StoryCard class's properties and loading everything to the render view

