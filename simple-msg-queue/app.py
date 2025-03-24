from flask import Flask
from celery import Celery
from celery.result import AsyncResult

app = Flask(__name__)

# Celery Configuration
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379/0',
    CELERY_RESULT_BACKEND='redis://localhost:6379/0',
    CELERY_ACCEPT_CONTENT=['json'],
    CELERY_TASK_SERIALIZER='json'
)

# Celery Initialization
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)
    return celery

celery = make_celery(app)

# Define Celery Task
@celery.task
def add(x, y):
    return x + y

# Flask Routes
@app.route('/add/<int:a>/<int:b>')
def add_numbers(a, b):
    result = add.delay(a, b)  # Execute the task asynchronously
    return f"Task sent! Task ID: {result.id}"

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

if __name__ == "__main__":
    app.run(debug=True)
