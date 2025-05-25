from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from scheduler.views import reservation_notify, register_instructor_expired_notify

# TODO https://stackoverflow.com/questions/16053364/make-sure-only-one-worker-launches-the-apscheduler-event-in-a-pyramid-web-app-ru
def start():
    scheduler = BackgroundScheduler(timezone="Asia/Seoul")
    scheduler.add_jobstore(DjangoJobStore(), 'djangojobstore')
    
    scheduler.add_job(reservation_notify.start, 'cron', **reservation_notify.schedule)
    scheduler.add_job(register_instructor_expired_notify.start, 'cron', **register_instructor_expired_notify.schedule)
    scheduler.start()