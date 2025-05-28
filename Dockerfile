FROM python:3.10

ENV PYTHONUNBUFFERED 1

RUN mkdir /app

WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn
