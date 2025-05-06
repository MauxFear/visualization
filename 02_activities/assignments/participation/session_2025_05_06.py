#%%
# Making vis with seaborn

import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import PIL
import requests

tips = sns.load_dataset("tips")
print(tips)
# %%
sns.set_style('darkgrid')

sns.lineplot(data=tips, # choose our dataset
x='total_bill', # define our x variable 
y='tip') # define our y variable
plt.show()

# %%
tipgraph = sns.lineplot(data=tips, x='total_bill', y='tip')
tipgraph.set(title='Tips vs. Total Bill', xlabel='Total Bill ($)', ylabel='Tip Amount ($)')

plt.show()
# %%
sns.set_style('darkgrid')
sns.set_palette('pastel')
fig = plt.subplots(figsize=(10, 3))
tipgraph = sns.lineplot(data=tips, x='total_bill', y='tip', color = 'skyblue', linestyle = ':', linewidth = 3, marker = 'o', markerfacecolor = 'orangered', markersize = 8)
tipgraph.set(title='Tips vs. Total Bill', xlabel='Total Bill ($)', ylabel='Tip Amount ($)')
plt.show()

# %%
sns.set_style('darkgrid')
tipgraph = sns.scatterplot(data=tips, x='total_bill', y='tip', style = 'time', hue = 'day', palette = ['purple', 'hotpink', 'deepskyblue', 'yellowgreen'])
tipgraph.set(title='Tips vs. Total Bill', xlabel='Total Bill ($)', ylabel='Tip Amount ($)')
plt.show()
# %%
sns.set_style('darkgrid')
sns.set_palette('flare')
tipgraph = sns.scatterplot(data=tips, x='total_bill', y='tip', style = 'time', hue = 'day')
tipgraph.set(title='Tips vs. Total Bill', xlabel='Total Bill ($)', ylabel='Tip Amount ($)')
plt.show()
# %%
sns.pairplot( data = tips, hue = 'day', palette = ['purple', 'hotpink', 'deepskyblue', 'yellowgreen'])
plt.show()
# %%
sns.set_style('darkgrid')
sns.set_palette(['purple', 'hotpink', 'deepskyblue', 'yellowgreen'])
daysplot = sns.relplot( data=tips, x="total_bill", y="tip", hue="sex", col="day", kind="scatter", col_wrap=2)
plt.show()
# %%

import plotly.graph_objects as go # 'go' is 'graph objects’
from wordcloud import WordCloud
from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
#load the data
x1 = np.array(["Luffy", "Zoro", "Nami", "Usopp", "Sanji"])
y1 = np.array([110, 180, 240, 99, 220])
# %%

graph = go.Figure()
graph.add_trace(go.Bar(x=x1, y=y1, name='Bar Chart', marker_color='indianred'))
graph.update_layout( title="Pirate Scores", xaxis_title="Pirates", yaxis_title="Score")
graph.show()

# %%
graph.write_html("pirategraph.html")

# %%

graph = go.Figure()
graph.add_trace(go.Scatter(x=x1, y=y1, mode='markers', # we want points for a scatter plot
    marker=dict( size=15, # point size 
    color='hotpink', # point colour 
    opacity=1, # point transparency/alpha 
    line=dict(width=5, color='purple') # point outline
)))
graph.update_layout( title='Interactive Pirate Plot', xaxis_title='Pirates', yaxis_title='Scores', width=500, height=500)
graph.show()
# %%
from wordcloud import WordCloud
df = pd.read_csv("https://raw.githubusercontent.com/prasertcbs/basic-dataset/master/movie_quotes.csv",on_bad_lines='skip')
display(df)
# %%
# join all our text from each row from our quote column into a string
text = " ".join(each for each in df.quote)# generate our wordcloud image
wordcloud = WordCloud(background_color="white",colormap = 'jet').generate(text)# use matplotlib syntax to put our image in a figure
fig, ax = plt.subplots(figsize=(7, 3))
ax.imshow(wordcloud, # remember 'imshow' from when we added pictures to our matplotlib axes
interpolation='bilinear') # this line helps smooth our image
ax.axis("off")
plt.show()
# %%
from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
A = set(["apple", "banana", "watermelon"])
B = set(["pumpkin", "blueberry", "apple", "key lime"])
diagram = venn2_unweighted([A, B], set_labels = ('Fruits', 'Pies'), set_colors=("blue", "red"), alpha=0.5)
plt.show()

# %%
diagram = venn2_unweighted([A, B], set_labels = ('Fruits', 'Pies'), set_colors=("blue", "red"), alpha=0.5)
diagram.get_label_by_id("10") .set_text("n".join(A - B))
diagram.get_label_by_id("11") .set_text("n".join(A & B))
diagram.get_label_by_id("01") .set_text("n".join(B - A))
plt.show()

# %%
