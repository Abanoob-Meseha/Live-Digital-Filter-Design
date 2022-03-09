from flask import Flask, render_template, request, jsonify
import pandas as pd
from scipy import signal as sig
import math 
app = Flask(__name__)

@app.route('/')
def home():
   return render_template('index.html')
	
# @app.route('/upload', methods = ['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':

#     return render_template('index.html')
        
@app.route('/plot', methods = ['GET', 'POST'])
def digital_filter_data():
    Xaxis_data = pd.read_csv("file1.csv").iloc[:, 0].tolist()
    Yaxis_data = pd.read_csv("file1.csv").iloc[:, 1].tolist()
    zeros = []
    poles = []
    if request.method == 'POST':
        data = request.json
        for index in range(len(data)):
            if data[index]['type'] == "nonConjZero" or data[index]['type'] == "ConjZero":
                zeros.append(math.sqrt(math.pow(data[index]['point'][0],2) + math.pow(data[index]['point'][1],2)))

        for index in range(len(data)):
            if data[index]['type'] == "nonConjPole" or data[index]['type'] == "ConjPole":
                poles.append(math.sqrt(math.pow(data[index]['point'][0],2) + math.pow(data[index]['point'][1],2)))


    sysDnum, sysDden = sig.zpk2tf(zeros, poles, 1)
    print(sysDnum)
    print(sysDden)
    transfer_function = sig.TransferFunction(sysDnum, sysDden)
    x,y = sig.step(transfer_function)
    filtered_data = sig.convolve(Yaxis_data, y)
    print(filtered_data)
    data = jsonify({"data_Xaxis": Xaxis_data, "non_Filtered_Data" : Yaxis_data, "Filtered_Data" : filtered_data.tolist()})

    return data

if __name__ == '__main__':
    
    app.run(debug=True)
