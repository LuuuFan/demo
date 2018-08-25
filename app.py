from flask import Flask, request, render_template, url_for, redirect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
