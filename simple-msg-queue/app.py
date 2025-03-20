from flask import Flask

app = Flask(__name__)

from celery import Celery
# from main import app
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend='redis://localhost:6379/0',  # Result backend
        broker='redis://localhost:6379/0'   # Broker URL
    )
    celery.conf.update(app.config)
    return celery

celery = make_celery(app)


# @app.route('/')
# def index():
#     return "Welcome to Flask with Celery!"


@app.route('/add/<int:a>/<int:b>')
def add_numbers(a, b):
    result = add.delay(a, b)  # Execute the task asynchronously
    return f"Task sent! Result will be: {result.id}"

@celery.task
def add(x, y):
    return x + y

from celery.result import AsyncResult

@app.route('/result/<task_id>')
def get_result(task_id):
    result = AsyncResult(task_id, app=celery)
    if result.state == 'PENDING':
        return "The task is still processing."
    elif result.state == 'SUCCESS':
        return f"The result is: {result.result}"
    elif result.state == 'FAILURE':
        return "The task failed."
    else:
        return f"Task status: {result.state}"

# if __name__ == "__main__":
#     app.run(debug=True)