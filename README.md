# Boston Neighborhood Mapping Project
Web application for viewing and interacting with gentrification data in the greater boston area.
- see project structure for application requirements

TODO:
- find mapbox qeues for load events, atempt loading pane for filtering and visualizations
- finish download PDF/PNG:
  - potential solutions:
    - https://wkhtmltopdf.org/ on the server
    - https://github.com/Flipboard/react-canvas or https://github.com/reactjs/react-art for a snapshot
    - finish pursuing the canvas method
- consider adding in compiled criteria statements for filters and pass/fail visualizations
- consider adding 'change' to year range labels
- have legend title wrap after a certain number of characters
- standardize the scrolling on sidebar panes
- add tip to create subrange on the visualization settings
- try to add an animation on legend update (since it gets finessed so much)
- try to find a way to disassociate clicks from processing lag
- rounding is off between multiple parts of the app including but not limited to the class slider tooltips and the legend
- make the visualization and filter loading more intelligent (not load at unecessary times)
- find a better option for the popup -- potentially pitch the selection as a anchored popup
- download should only return the features returned by the filter
- standardize z-indexes to at least allow clean overlap of major element groups
- local storage reload session:
  - delete filters when the filters are full-range is not updating to state
  - when the map is at a blank state, it should delete the local storage and not cause a loading prompt on next session
- classes slider: 
  - some values are failing to be assigned, check for those errors and resolve them
  - find a way to make slider colors that are light popout on classes slider
  - add in min/max as marks
  - find a way to handle overflow / text-wrapping of min/max/median marks
  - spread out mark values and center the slider (will also make room for tooltips)
  - make a function that sweeps, finds tooltips and closes them -- they are being left over from hovers in buggy ways
  - make the slider steps form dynamically based off of total ranges in a way that gives the user precise and smooth selections

MIGHT BE OVERRIDEN BY DESIGN CHANGES:
- turn the add filter button into a SVG (is mis-centered in other browsers);
- consider zooming in on new visualization/filter choice;
- optimize the opacity inverses upon legend use for fails
- add in a landing page

POSSIBILITIES:
- add map extent into memory?

TODO FROM FEEDBACK:
- See if base map can clearly label city/town boundary lines
- have them create some map selections

EXTRAS:
- ESL Options (Spanish)
- See if we can come up with a way to show transit stops and a tract’s distance from the nearest rapid transit stop.

COMPETITORS:
- http://www.socialexplorer.com/