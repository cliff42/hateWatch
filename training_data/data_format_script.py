import pandas as pd
import numpy as np

formatted_data = []
comments_df = pd.read_csv("./hatespeech_data.csv")

def get_raw_comments(text):
  raw_comments = []
  comments = text.splitlines()

  for comment in comments:
    raw_comment = comment[3:].lstrip()
    raw_comments.append(raw_comment)

  return raw_comments


def process_row(comments, indices):
  if type(indices) == str:
    string_indices = indices[1:-1].split(", ")
    num_indices = list(map(int, string_indices))

    for index, comment in enumerate(comments):
      if index+1 in num_indices:
        formatted_data.append([comment, 1])
      else:
        formatted_data.append([comment, 0])

  else:
    for index, comment in enumerate(comments):
      formatted_data.append([comment, 0])


for index, row in comments_df.iterrows():
  process_row(get_raw_comments(row['text']), row['hate_speech_idx'])


data = np.array(formatted_data)
df = pd.DataFrame(data=data, columns=['comment', 'hate_speech'])
df.to_csv('formatted_data.csv', index=False)
