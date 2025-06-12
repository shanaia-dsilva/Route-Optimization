import requests
import pandas as pd
from scipy.optimize import linear_sum_assignment

def get_distance(origin, destination):
    url = f"http://localhost:5000/route/v1/driving/{origin};{destination}?overview=false"
    res = requests.get(url).json()
    return res["routes"][0]["distance"]

def process_and_optimize(df):
    buses = df[df["type"] == "bus"]["coords"].tolist()
    routes = df[df["type"] == "route"]["coords"].tolist()

    # distance matrix
    matrix = [[get_distance(bus, route) for route in routes] for bus in buses]

    row_ind, col_ind = linear_sum_assignment(matrix)

    matches = [{"bus": buses[i], "route": routes[j], "distance": matrix[i][j]}
               for i, j in zip(row_ind, col_ind)]
    return matches
