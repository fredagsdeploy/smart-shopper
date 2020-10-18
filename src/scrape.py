

import pandas as pd
from collections import defaultdict
from pathlib import Path

dataStore = {}
paths = Path('queries').glob('query-svenska*.csv')

for path in paths:
    print(path)
    df = pd.read_csv(path)
    valid_food_labels = [label for label in set(df["foodLabel"]) if label[0] != "Q"]
    df = df.query("foodLabel in @valid_food_labels")

    for _, row in df.iterrows():
        df_ = df.query(f'subclass_ofLabel == "{row.subclass_ofLabel}"')
        if row.foodLabel not in dataStore:
            dataStore[row.foodLabel] = defaultdict(int)

        for _, subrow in df_.iterrows():
            dataStore[row.foodLabel][subrow.foodLabel] += 5




dataStoreUnique = {
    key.capitalize(): [{"item": name.capitalize(), "score": score} for name, score in val.items()]
    for key, val in dataStore.items()
}


import json

with Path("dataStoreSvenska.json").open("w") as f:
    json_string = json.dumps(dataStoreUnique, ensure_ascii=False)
    f.write(json_string)
