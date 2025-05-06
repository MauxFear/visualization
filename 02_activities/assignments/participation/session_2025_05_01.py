#%% SUBPLOTS AND COMBINING VISUALIZATIONS

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import scipy
import PIL
import requests

np.random.seed(9076)
x1 = np.arange(50)
y1 = np.random.randint(0, 75,50)
x2 = np.array(["Luffy", "Zoro", "Nami", "Usopp", "Sanji"])
y2 = np.array([110, 180, 240, 99, 220])

fig,(ax1, ax2) = plt.subplots(ncols=2, nrows=1, figsize=(7, 3))

ax1.scatter(x1,y1)
ax2.bar(x2,y2)
fig.show()

# %%
fig,(ax1, ax2) = plt.subplots(ncols=2, nrows=1, figsize=(7, 3))

ax1.scatter(x1,y1, color='purple', marker='^')
ax1.set_title('Scatter plot', fontdict={'fontsize': 14, 'color': 'Purple'})
ax1.set_xlabel('X axis', fontdict={'fontsize': 12, 'color': 'blue'})
ax1.set_ylabel('Y axis', fontdict={'fontsize': 12, 'color': 'blue'})
ax2.set_title('Bar plot', fontdict={'fontsize': 14, 'color': 'Orange'})
ax2.set_xlabel('X axis', fontdict={'fontsize': 12, 'color': 'blue'})
ax2.set_ylabel('Y axis', fontdict={'fontsize': 12, 'color': 'blue'})
ax2.bar(x2,y2, color='orange')
fig.show()


#%%

fig, someaxes = plt.subplot_mosaic([['ax1', 'ax3'], ['ax2', 'ax3']], figsize=(7, 4))
for label, ax in someaxes.items():
    ax.text(0.5, 0.5, f'This is {label!r}', 
            fontsize=14, ha = 'center', 
            transform=ax.transAxes)


#%%

fig, someaxes = plt.subplot_mosaic([['ax1', 'ax3'], ['ax2', 'ax3']], figsize=(7, 4))
someaxes["ax1"].scatter(x1,y1, color='purple', marker='^')
someaxes["ax1"].set_title('Scatter plot', fontdict={'fontsize': 14, 'color': 'Purple'})
someaxes["ax1"].set_xlabel('X axis', fontdict={'fontsize': 12, 'color': 'blue'})
someaxes["ax1"].set_ylabel('Y axis', fontdict={'fontsize': 12, 'color': 'blue'})
someaxes["ax2"].bar(x2,y2, color='orange')
someaxes["ax2"].set_title('Bar plot', fontdict={'fontsize': 14, 'color': 'Orange'})
someaxes["ax2"].set_xlabel('X axis', fontdict={'fontsize': 12, 'color': 'blue'})
someaxes["ax2"].set_ylabel('Y axis', fontdict={'fontsize': 12, 'color': 'blue'})
someaxes["ax3"].set_title('Line plot', fontdict={'fontsize': 14, 'color': 'Green'})
someaxes["ax3"].plot(x1,y1, color='gold', marker='*', label='Scatter plot')

plt.show()


#%%



fig, someaxes = plt.subplot_mosaic([['ax1', 'ax3'], ['ax2', 'ax3']], figsize=(7, 4)) 
someaxes["ax1"].scatter(x1,y1)
someaxes["ax2"].bar(x2,y2)
someaxes["ax3"].plot(x1,y1)
someaxes["ax1"].set_xlabel('A Big Label',fontsize=18)
someaxes["ax2"].set_xlabel('Another Label',fontsize=18)
someaxes["ax3"].set_xlabel('Label 2: 2 Fast 2 Furious',fontsize=18 )
plt.show()


# %%

fig, someaxes = plt.subplot_mosaic([['ax1', 'ax3'], ['ax2', 'ax3']], figsize=(7, 4), layout = "constrained")
someaxes["ax1"].scatter(x1,y1)
someaxes["ax2"].bar(x2,y2)
someaxes["ax3"].plot(x1,y1)
someaxes["ax1"].set_xlabel('A Big Label', fontsize=18)
someaxes["ax2"].set_xlabel('Another Label', fontsize=18)
someaxes["ax3"].set_xlabel('Label 2: 2 Fast 2 Furious', fontsize=18)
plt.show()
# %%

# first make our sample 
x = np.array(["Luffy", "Zoro", "Nami", "Usopp", "Sanji"])
y1 = np.array([110, 180, 240, 99, 220])
y2 = np.array([170, 100, 90, 120, 50])
# define our figure and axes (just one this time)
fig, ax = plt.subplots(figsize=(7, 3))
# now call both bar and plot elements to the same axes (ax)
ax.bar(x, y1,color = "indigo")
ax.plot(x, y2,color = "red")
# %%
y2_sd = np.std(y2)
fig, ax = plt.subplots(figsize=(7, 3))
ax.plot(x, y2, color = "red")
ax.errorbar(x, #our x values 
            y2, #our y values 
            yerr = y2_sd, 
            fmt = "none")

# %%

fig, ax = plt.subplots(figsize=(7, 3))
ax.plot(x, y2, color = "red")
ax.errorbar(x, y2, yerr = y2_sd, fmt = "none", ecolor= "indigo", elinewidth= 4, capsize = 6, capthick= 4 )
# %%
fig, ax = plt.subplots(figsize=(7, 3))
ax.plot(x, y2, color = "red")
ax.errorbar(x, y2, yerr = y2_sd, fmt = "none", ecolor = "indigo", elinewidth = 4, capsize = 6, capthick = 4, errorevery= 2 )

# %%

from PIL import Image # to open images
import requests # to get images from URLs
from io import BytesIO # to store images

response = requests.get('https://upload.wikimedia.org/wikipedia/en/c/cb/Monkey_D_Luffy.png')
image_file = BytesIO(response.content)
image = Image.open(image_file)

fig, ax = plt.subplots(figsize=(7, 3))
ax.plot(x, y2, color = "red")
ax_image = fig.add_axes([0.1, # x coordinate (ON FIGURE, NOT AXES) 
                         0.11, # y coordinate (ON FIGURE, NOT AXES) 
                         0.15, # image width 
                         0.35] # image height
                         )

fig, ax = plt.subplots(figsize=(7, 3))
ax.plot(x, y2, color = "red")
ax_image = fig.add_axes([0.1, 0.11, 0.15, 0.35])
ax_image.imshow(image)
ax_image.axis('off')
plt.show()

# %%

# can be full path or relative 
pathfilename = '/fig1a.png'

plt.savefig(path+filename, dpi=300)
# note that path shouldn't end with / since filename starts with it

