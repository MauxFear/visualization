# Data Visualization

## Assignment 3: Final Project

### Requirements:
- We will finish this class by giving you the chance to use what you have learned in a practical context, by creating data visualizations from raw data. 
- Choose a dataset of interest from the [City of Toronto’s Open Data Portal](https://www.toronto.ca/city-government/data-research-maps/open-data/) or [Ontario’s Open Data Catalogue](https://data.ontario.ca/). 
- Using Python and one other data visualization software (Excel or free alternative, Tableau Public, any other tool you prefer), create two distinct visualizations from your dataset of choice.  
- For each visualization, describe and justify: 

- Visualization 1:
    * What was your rationale for choosing this particular dataset?
    >This dataset comprised different types of information such as crime rates for different crime types and their incidence in specific areas of Toronto per year. This will allow me to use creative visualization to show the data in a meaningful way to get insights about the trends in crime rates over time and across different neighborhoods. 

    * What software did you use to create your data visualization?
    >Python

    * Who is your intended audience? 
    >Academic community and policy makers.
    
    * What information or message are you trying to convey with your visualization? 
    > The main message conveyed through my visualization is that there has been a significant increase in crime rates over the years, particularly in certain crime types. Additionally, I aim to highlight the particular neighborhoods experiencing higher crime rates compared to others. By highlighting these trends, I hope to provide valuable insights for policymakers and researchers interested in understanding crime patterns and trends in Toronto for prevention purposes.
    
    * What aspects of design did you consider when making your visualization? How did you apply them? With what elements of your plots? 
    > I considered several key design principles when creating these visualizations:
    >Color coding: I used distinct colors for each crime type to ensure clear differentiation between trends. This was especially important for the time series plot where multiple lines needed to be easily distinguishable. I used also a different color to differentiate the outlier neighborhoods in the PCA plot. Additionally, different colors were used to help in differentiate the loadings (crime types) in the PCA plot.
    > Dual axes structure: To accommodate different scales of crime rates (some much higher than others), I implemented dual Y-axes in the time series plot. This allowed me to effectively display both high-frequency crimes (assault, theft) and lower-frequency but critical crimes (homicide, shooting) on the same graph without smaller trends becoming invisible. Also I used a different line style to help in distinguishing the used of the second axis. 
    > Strategic labeling: I selectively labeled outlier neighborhoods to highlight areas with distinctive crime patterns while avoiding overcrowding the visualization with text.
    > Channel of marker shape: In the time series plot, I utilized different marker styles for each crime type.
    > Statistical inference: I incorporated statistical inference techniques such as Principal Component Analysis (PCA) to identify underlying patterns in the data. This helped in reducing dimensionality and identifying the correlations between crime types and neighborhoods. Also, I used a statistical approach to detect outliers in the PCA plot.

    * How did you ensure that your data visualizations are reproducible? If the tool you used to make your data visualization is not reproducible, how will this impact your data visualization? 
    > I ensured reproducibility by developing my visualizations using Python, which provides a fully programmable environment. I created structured code with clear documentation and maintained version control of my scripts. The analysis process was implemented as a reproducible pipeline where data loading, cleaning, analysis, and visualization are handled in discrete, documented steps. I also saved the specific versions of all libraries used to avoid compatibility issues in future reproductions.

    * How did you ensure that your data visualization is accessible?
    > I ensured accessibility by using appropriate color contrast ratios, providing descriptive labels for axes and legends, and ensuring sufficient spacing between elements to avoid cluttering. Additionally, I provided a legend explaining the meaning behind different markers and colors used in the time series plot.  
    
    * Who are the individuals and communities who might be impacted by your visualization?
    >This visualization could impact: Residents of Toronto neighborhoods, especially those highlighted as outliers; Police and public safety officials ; Community organizations working on crime prevention; Property developers and real estate professionals; Policy makers and city planners; Academic researchers studying urban crime patterns; Potential residents considering moving to specific neighborhoods
    I'm particularly mindful that neighborhood-specific crime data can potentially lead to stigmatization of certain communities, so context around socioeconomic factors is important when sharing these visualizations.  
    
    * How did you choose which features of your chosen dataset to include or exclude from your visualization? 
    >In this case, I chose to discard geometry data since I was not intending to visualize geographic locations. Instead, I focused on analyzing crime rates and trends over time within specific neighborhoods. 
    >I also decided to use PCA to combine multiple crime dimensions rather than showing isolated statistics that might miss important correlations between crime types and neighborhoods. 

    * What ‘underwater labour’ contributed to your final data visualization product?
    >The final visualizations represent only a fraction of the total work involved. The "underwater labour" included: Extensive data cleaning to handle inconsistencies in reporting across different years; Normalization of crime rates by population to enable fair comparison between neighborhoods; Extensive testing of different visualization approaches before selecting the final design.
    

- Visualization 2:
    * What was your rationale for choosing this particular dataset?
    > This dataset contains specific information about crime rates per neighborhoods in Toronto. My goal was to provide a dynamic visualization that would help to understand the distribution of crime rates across different neighborhoods and identify potential hotspots for certain crime types. 

    * What software did you use to create your data visualization?
    > I used JavaScript and D3.js library to create interactive visualizations. 

    * Who is your intended audience? 
    > My target audience includes anyone interested in crime rates in Toronto, including residents, policymakers, law enforcement agencies, and academics. In this case the visualization and the information is pretty straightforward therefore a general audience could still finding useful.
    
    * What information or message are you trying to convey with your visualization? 
    > I aimed to present an overview of crime rates across different neighborhoods in Toronto. Specifically, I wanted to highlight the distribution of crime rates per neighborhoods facilitating the identification of hotspots for a certain crime type. 
    
    * What aspects of design did you consider when making your visualization? How did you apply them? With what elements of your plots?  
    > Dynamic interaction: I used a dynamic type of graph to split the data in maneagable portion of information to facilitate their interpretation so the user can interact with the visualization by displaying data based on the selected crime type and year. Users can filter the data by selecting specific neighborhoods or crime types, enabling them to focus on particular aspects of the visualization. When hovering over a neighborhood, additional details about its crime rate are displayed, enhancing interactivity and engagement.
    > Color coding: I used different colors to represent different crime types, allowing users to quickly identify them. Additionally, I used color as a magnitude channel where the intensity of the color represent the crime rate for the selected criteria. This heatmap visualization allow the user to quickly interpret the data and identify hotspots and low crime areas.   
    > Geographical data integration: I integrated geographical data to enhance the visualization's contextual relevance. By overlaying crime rate heatmaps on top of a map of Toronto, users can visually connect crime rates with specific neighborhoods, aiding in understanding the spatial distribution of crime.
    
    * How did you ensure that your data visualizations are reproducible? If the tool you used to make your data visualization is not reproducible, how will this impact your data visualization? 
    > I used JavaScript and D3.js library which can be used to ensure reproducibility. I added a README file whith instructions on how to create the visualization locally. 
    
    * How did you ensure that your data visualization is accessible? 
    > I ensure of using a color scheme that works well for people with color vision deficiencies. I also ensured that the visualization is responsive and adjusts appropriately to different screen sizes. 
    
    * Who are the individuals and communities who might be impacted by your visualization?  
    > Similar to the visualization 1, I'm aware that neighborhood-specific crime data can potentially lead to stigmatization of certain communities.

    * How did you choose which features of your chosen dataset to include or exclude from your visualization? 
    > In this case, I focused on using the geometry data along with neighborhood metadata to create a more comprehensive view of crime rates in Toronto. Additionally, I used crime rates per year to use it as the main indicator of the color scale, while I showed additional details by hovering or in a table. 
    
    * What ‘underwater labour’ contributed to your final data visualization product?
    > Additionally to the reasons mentioned above, the use of JavaScript and D3.js library was an additional struggle because I had little experience and many research was required to find solutions to the multiple iterations. 

- This assignment is intentionally open-ended - you are free to create static or dynamic data visualizations, maps, or whatever form of data visualization you think best communicates your information to your audience of choice! 
- Total word count should not exceed **(as a maximum) 1000 words** 
 
### Why am I doing this assignment?:  
- This ongoing assignment ensures active participation in the course, and assesses the learning outcomes: 
* Create and customize data visualizations from start to finish in Python
* Apply general design principles to create accessible and equitable data visualizations
* Use data visualization to tell a story  
- This would be a great project to include in your GitHub Portfolio – put in the effort to make it something worthy of showing prospective employers!

### Rubric:

| Component         | Scoring  | Requirement                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| Data Visualizations | Complete/Incomplete | - Data visualizations are distinct from each other<br>- Data visualizations are clearly identified<br>- Different sources/rationales (text with two images of data, if visualizations are labeled)<br>- High-quality visuals (high resolution and clear data)<br>- Data visualizations follow best practices of accessibility |
| Written Explanations | Complete/Incomplete | - All questions from assignment description are answered for each visualization<br>- Explanations are supported by course content or scholarly sources, where needed |
| Code              | Complete/Incomplete | - All code is included as an appendix with your final submissions<br>- Code is clearly commented and reproducible |

## Submission Information

🚨 **Please review our [Assignment Submission Guide](https://github.com/UofT-DSI/onboarding/blob/main/onboarding_documents/submissions.md)** 🚨 for detailed instructions on how to format, branch, and submit your work. Following these guidelines is crucial for your submissions to be evaluated correctly.

### Submission Parameters:
* Submission Due Date: `23:59 - 09/05/2025`
* The branch name for your repo should be: `assignment-3`
* What to submit for this assignment:
    * A folder/directory containing:
        * This file (assignment_3.md)
        * Two data visualizations 
        * Two markdown files for each both visualizations with their written descriptions.
        * Link to your dataset of choice.
        * Complete and commented code as an appendix (for your visualization made with Python, and for the other, if relevant) 
* What the pull request link should look like for this assignment: `https://github.com/<your_github_username>/visualization/pull/<pr_id>`
    * Open a private window in your browser. Copy and paste the link to your pull request into the address bar. Make sure you can see your pull request properly. This helps the technical facilitator and learning support staff review your submission easily.

Checklist:
- [ ] Create a branch called `assignment-3`.
- [ ] Ensure that the repository is public.
- [ ] Review [the PR description guidelines](https://github.com/UofT-DSI/onboarding/blob/main/onboarding_documents/submissions.md#guidelines-for-pull-request-descriptions) and adhere to them.
- [ ] Verify that the link is accessible in a private browser window.

If you encounter any difficulties or have questions, please don't hesitate to reach out to our team via our Slack. Our Technical Facilitators and Learning Support staff are here to help you navigate any challenges.
