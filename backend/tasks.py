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
