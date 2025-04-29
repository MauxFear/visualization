# %%

# customizing out plots

#load libraries
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import PIL
import requests

# sample data
np.random.seed(542)
x = np.arange(50)
y1 = np.random.randint(0,100,50)
y2 = np.random.randint(0,100,50)

fig, ax = plt.subplots(figsize=(10,6))
plt.plot(x, y1, color='skyblue', label="first")
plt.plot(x, y2, color='orange', label="second")
plt.legend(loc="upper left", bbox_to_anchor=(1, 1))  # Place legend outside the plot
plt.title("Random data / line plots")
plt.xlabel("X axis")
plt.ylabel("Y axis")
plt.show()

# %%
y3 = np.random.randint(0,100,50)

fig, ax = plt.subplots(figsize=(10,6))
plt.plot(x,y1, color='green', label='Person 1')
plt.plot(x,y2, color='blue', label='Person 2')
plt.plot(x,y3, color='red', label='Person 3')
plt.legend(loc="upper left", bbox_to_anchor=(1, 1), title='Sample', shadow=True, ncols=2, fontsize=14)  # Place legend outside the plot

# %%
from sklearn.datasets import load_iris
data = load_iris()
data_df = pd.DataFrame(data.data, columns=data.feature_names)

data_df.head()
columns = data_df.columns.to_list()

# %%

fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')

ax.text(2,1, 'This value is important!', ha='center', color='orange', size=14)
plt.show()
# %%
fig, ax = plt.subplots()
ax.axis([0, 10, 0, 10])

ax.text(1, 5, ". Data:(1, 5)", transform=ax.transData )
ax.text(0.5, 0.1, ". Axes:(0.5, 0.1)", transform=ax.transAxes )
ax.text(0.2, 0.2, ". Figure:(0.2, 0.2)", transform=fig.transFigure )
# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')
# Add an annotation with an arrow pointing to a specific point on the graph
ax.annotate('This value is important!', xy=(2, 0.5), xytext=(2, 2), arrowprops=dict(facecolor='black', shrink=0.05), ha= 'center', color='orange', size=14)
plt.show()  
# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')
# Add an annotation with a wedge arrow

ax.annotate('This value is important!', xy=(2, 0.5), xytext=(2, 2), arrowprops=dict(arrowstyle='wedge', color='hotpink'), ha= 'center', color='orange', size=14)
plt.show()  
# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')

# Remove the ticks using locators and formatters
ax.yaxis.set_major_locator(plt.NullLocator())
ax.xaxis.set_major_formatter(plt.NullFormatter())

# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')

# Limit the number of tick labels displayed along the x-axis
ax.xaxis.set_major_locator(plt.MaxNLocator(3))
ax.yaxis.set_major_locator(plt.MaxNLocator(4))

# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width')
ax.set_xlabel('Length')
ax.set_title('Iris data')

# Set the inrerval of the ticks along the x-axis and y-axis
ax.xaxis.set_major_locator(plt.MultipleLocator(1))
ax.yaxis.set_major_locator(plt.MultipleLocator(0.5))

# %%
fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width', fontdict={'fontsize': 20, 'color': 'green'})
ax.set_xlabel('Length', fontdict={'fontsize': 20, 'color': 'purple'})
ax.set_title('Iris data', fontdict={'fontsize': 20, 'color': 'red'})

plt.xticks(fontsize=14, color='blue', rotation=45, ha='right')
plt.yticks(fontsize=14, color='blue', rotation=45, ha='right')
plt.show()

# %%
font1= {'family':'serof', 'color':'indigo', 'fontsize': 30}

fig, ax = plt.subplots(figsize=(10,6))
ax.scatter(data_df[columns[0]], data_df[columns[1]], label='Sepal data', color='blue')
ax.scatter(data_df[columns[2]], data_df[columns[3]], label='Petal data', color='red')
ax.legend(loc="upper right")
ax.set_ylabel('Width', fontdict={'fontsize': 20, 'color': 'green'})
ax.set_xlabel('Shiny New X Axis!', fontdict=font1)
ax.set_title('Iris data', fontdict= font1)

# %%

plt.style.use('dark_background')
              
np.random.seed(613)
x = np.arange(50)
y1 = np.random.randint(0, 100,50)
y2 = np.random.randint(0, 100,50)
fig, ax = plt.subplots(figsize=(5, 3))
ax.plot(x,y1)
ax.plot(x,y2)
fig.show()


# %%
plt.style.available
# %%
