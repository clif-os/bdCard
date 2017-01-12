# Boston Neighborhood Mapping Project

### Requirements:
categorical map of data across tracts of the Boston Metro Area (BMA):
  - **As many as 50 variables varying across 4 years:** 
    - 4 years: 1990, 2000, 2010, 2014
    - 4 basic categories:
      - normal variable value (across all 4 years)
      - decile rank of tract for that variable (across all 4 years)
      - changes in values for certain time periods (ex: 2000 --> 2010, 1990 --> 2014)
      - decile rank of changes in values for certain time periods (ex: 2000 --> 2010, 1990 --> 2014)
  - **User-defined tract selections:**
    - tracts will default to entire BMA, but user will also be able to make tract subselections and map visualizations across those
    - the subselection is caused by filtering as such: user picks the `selection filter variable (SFV)` they want and then uses a slider to choose values within its whole value range -- tracts which fall within this `Selection Filter Variable Range` will be the subselection
    - for example: a user should be able to map income growth 1990-2014 for low-income tracts by defining a low-income tract as being in the bottom 4 deciles of tracts ranked by median tract income // via these steps:
      - user defines 'Decile of Income in 1990' as the `SFV`
      - user is then provided a slider based off the full range of the values within the `SFV` and selects tracts of deciles 1-4 as the `Selection Filter Variable Range`, areas outside of this filter are "greyed out"
      - with the subselection now shown, the user is now able to pick any variable to be the `data visualization variable` for mapping, in this case: 'Income Growth 1990-2014'
    - user should also be able to stack `SFVs` into a `Selection Filter Variable Stack`: 
      - up to 3 per stack
      - ex: a user should be able to create a two-variable stacked filter to look only at tracts that are low-income AND low-rent as of 2000 AND whatever
  - **Double stacking selections for a pass/fail data visualization:**
    - as well as the option of using a simple/single `Data Visualization Variable`, users will be granted the ability to cause a binary pass/fail (red/green) visualization based off of secondary selection
    - this could be done by taking the exact same logic from the `Selection Filter Variable Stacks`:
      - in essence this is like a doubling up of the `SFVS` stacks where the first `SFVS` causes the normal greying out and subselection and the second `SFVS` causes a visualization of its results within that subselection
      - for the user, the first `SVFS` would go on as normal // but the second would be some sort of special option/alternative in the Field selection area -- but perhaps with a very familiar UX to the one in the selection area
    - the data visualization `SVFS` will have a limit of 2 `SFVs` per stack whereas the normal `SVFS` will have 3 per stack (im inferring the 2-limit from the specs in Harvard but perhaps three would still be fine)

### Key Project Terms:
> - `Selection Filter Variable`: variable used to define the subselection of tracts
> - `Selection Filter Variable Range`: selected range of values defined by the user and returned for the `SFV` (this is intrinsic to an `SFV`, with the default being the whole range)
> - `Selection Filter Variable Stack`: when multiple `SFVs` and their associated ranges are used to define a tract subselection together
> - `Data Visualization Variable`: variables used to render the data visualizations

### Variables:
- Income:
  -	Median household income
  - Poverty rate of population 
- Housing Costs:
  - Median gross rent  
  - Median home value of owner occupied units  
  - Renter cost burden rate (share paying over 30% on housing)
  - Homeownership rate
- Education: 
  - Share of adults aged 25 and over with a Bachelor's degree
  - School enrollment rate for children age 5-17
- Demographics:
  - Share of pop by race/ethnicity (white, black, Hispanic, Asian/other)
  - Share of households headed by young adults aged 25-34
- Family Type:  
  - Share of households that are non-family / with children / married-couple families (3 variables)
