### State Object Overview:
  - **visActive**: controller variable used to turn off map renders,
  - **selectedProp**: interpretive variable used to build `min`, `max`, `median`, `units`, `stepVal`, `stepMin`, `stepMax` using the `fieldUnitAndRangeHandler` function
  
  - **fieldValue**: controller and interpretive variable
    - as a controller it informs the `Fields` dropdown
    - as an interpretive variable, it is used to select the `selectedProp` from the propRegistry on `handleYearSelection`
  - **fieldLabel**: externally used interpretive variable used (out of convenience) to determine `Fields` dropdown defaults
    - seems to be used only superficially and that potentially it could be taken away
    - produced in the `analysisUtils.jsx`
  - **fieldOptions**: controller variable used to inform the options available for the `Fields` dropdown
  - **yearValue**: controller variable that informs the `Years` dropdown
  - **yearOptions**: controller and interpretive variable

  - **classNumValue**: controller and interpretive variable
  - **paletteValue**: controller and interpretive variable
  
  - **freezeValidity**: interpretive variable used to freeze filter from firing map rendering events while the slider is being changed
  - **alertChangeOfFieldSelection**: because the onSliderChange gets called after onSliderAfterChange during redefinitions 
                                     of the major slider values (cased by field and possibly year selections), 
                                     this boolean was created to communicate selections after to onSliderChange and avoid
                                     undesired validity freezes

  - **range**: currently doesn't seem to be used by anything, but could also be an external interpretive variable for the filter.jsx
  - **selectedRange**: controller variable for the slider
  - **selectedSplitRanges**: [DRAFT] i think this is actually a data structure precreated to be shipped to the filter on map rendering event that parallels selectedRanges
  - **medianMark**: controller variable for the slider
  - **units**: interpretive variable used to convert values to their corresponding strings throughout the component
  - **stepMax**: controller variable for the slider
  - **stepMin**: controller variable for the slider
  - **stepVal**: controller variable for the slider