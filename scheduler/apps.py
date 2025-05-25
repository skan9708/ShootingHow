from django.apps import AppConfig
import sys
import os
# from django.contrib.staticfiles.management.commands.runserver import Command as RunserverCommand
# class Command(RunserverCommand):
#     def run(self, *args, **options):
#         if os.environ.get('RUN_MAIN') != 'true':
#             self.stdout.write('About to start running on ' + self.addr)
#         super(Command, self).run(*args, **options)


class SchedulerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scheduler'
    
    def ready(self):
        # runserver의 auto reload 기능으로 인한 코드 2번 실행 방지
        if os.environ.get('RUN_MAIN'):
            from scheduler import schedulers
            # print("start app scheduler!!")
            # schedulers.start()