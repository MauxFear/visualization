#%%
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import scipy
import PIL 
import requests

np.random.seed(865)
x = np.arange(50)
y= np.random.randint(0, 100, 50)

fig_1, ax_1 = plt.subplots(figsize=(5, 3))
ax_1.scatter(x, y)
plt.show()

# %%

fig_2, ax_2 = plt.subplots(figsize=(5, 3))
ax_2.bar(x, y)
plt.show()

# %%
fig_3, ax_3 = plt.subplots(figsize=(5, 3))
ax_3.plot(x, y)
plt.show()
# %%
fig_4, ax_4 = plt.subplots(figsize=(5, 3))
ax_4.hist(y)
plt.show()
# %%
fig_5, ax_5 = plt.subplots(figsize=(5, 3))
ax_5.plot(x, y, '--')

ax_5.set_title('Total growth over time')
ax_5.set_xlabel('Years since start')
ax_5.set_ylabel('Total Growth')

# %%
font1 = {'family':'sans-serif','color':'blue','size':20}

font2 = {'family':'monospace','color':'green',
         'size':14}
fig_6, ax_6 = plt.subplots(figsize=(5, 3))
ax_6.plot(x, y, '--')

ax_6.set_title('Total growth over time lets make this a really long title', fontdict = font1, loc='left')
ax_6.set_ylabel('Total growth', fontdict = font2)
ax_6.set_xlabel('Years since start', fontdict = font2)
fig_6.tight_layout()

# %%
fig_7, ax_7 = plt.subplots(figsize=(5, 3))
y_1 = np.random.randint(0, 100, 50)
y_2 = np.random.randint(0, 100, 50)
ax_7.scatter(x, y_1, marker='^', color='indigo')
ax_7.scatter(x, y_2, marker='>', color='orange')

# %%
fig_8, ax_8 = plt.subplots(figsize=(5, 3))
x_sine = np.linspace(0, 4*np.pi, 50)
y_sine = np.sin(x_sine)

ax_8.plot(x_sine,y_sine,
        marker = 'v',
        color = '#7129a9',
        linestyle = '--',
        linewidth = 2, 
        markersize = 10,)
# %%
fig_9, ax_9 = plt.subplots(figsize=(5, 3))
y_cos = np.cos(x_sine)
ax_9.plot(x_sine,y_sine,
        marker = '^',
        color = '#e28743',
        linestyle = '--',
        linewidth = 2, 
        markersize = 7,
        markeredgecolor = '#9E221B',
        markerfacecolor = '#bbbbbb')
ax_9.plot(x_sine,y_cos,
        marker = '^',
        color = '#2596be',
        linestyle = '--',
        linewidth = 2, 
        markersize = 7,
        markeredgecolor = '#fa9359',
        markerfacecolor = '#000000'
)
# %%
# Activity

import matplotlib.pyplot as plt
import pandas as pd
from math import pi
 
# Set data
df = pd.DataFrame({
'Character': ['Barbarian','Mage','Rogue','Elf'],
'Strength': [38, 1.5, 30, 4],
'Stamina': [29, 10, 9, 34],
'Magic': [8, 39, 23, 24],
'Speed': [7, 31, 33, 14],
'Resistance': [28, 15, 32, 14]
})
 
# ------- PART 1: Create background
 
# number of variable
categories=list(df)[1:]
N = len(categories)
 
# What will be the angle of each axis in the plot? (we divide the plot / number of variable)
angles = [n / float(N) * 2 * pi for n in range(N)]
angles += angles[:1]
 
# Initialise the spider plot
ax = plt.subplot(111, polar=True)
 
# If you want the first axis to be on top:
ax.set_theta_offset(pi / 2)
ax.set_theta_direction(-1)
 
# Draw one axe per variable + add labels
plt.xticks(angles[:-1], categories)
 
# Draw ylabels
ax.set_rlabel_position(0)
plt.yticks([10,20,30], ["10","20","30"], color="grey", size=7)
plt.ylim(0,40)
 

# ------- PART 2: Add plots
 
# Plot each individual = each line of the data
# I don't make a loop, because plotting more than 3 groups makes the chart unreadable
 
# Ind1
values=df.loc[0].drop('Character').values.flatten().tolist()
values += values[:1]
ax.plot(angles, values, linewidth=1, linestyle='solid', label="Barbarian", color='#82BE25')
ax.fill(angles, values, '#82BE25', alpha=0.1)
 
# Ind2
values=df.loc[1].drop('Character').values.flatten().tolist()
values += values[:1]
ax.plot(angles, values, linewidth=1, linestyle='solid', label="Mage", color='#7425BE')
ax.fill(angles, values, '#7425BE', alpha=0.1)
 
# Add legend
plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))

# Show the graph
plt.show()

# %%