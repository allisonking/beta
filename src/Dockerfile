FROM ubuntu:bionic-20180710

# need this for OSX
ENV DEBIAN_FRONTEND noninteractive
# need this for proper ascii decoding
ENV LC_CTYPE en_US.UTF-8

# system requirements
RUN apt-get update && apt-get install -y \
  sudo \
  less \
  python3 \
  python3-pip \
  python3-dev \
  build-essential \
  emacs-nox \
  postgresql-all \
  postgresql-client \
  jq \
  git \
  curl \
  && apt-get clean && locale-gen en_US.UTF-8 && update-locale LANG=en_US.UTF-8

# python requirements
COPY ./python/requirements.txt /tmp/requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r /tmp/requirements.txt

# set up a user and group named 'dev'
RUN groupadd dev && \
    useradd --no-log-init -s /bin/bash -m -g dev dev && \
    adduser dev sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/all-sudo

# set up a dev database in postgres
COPY ./postgres-setup.sql /tmp/postgres-setup.sql
RUN /etc/init.d/postgresql start && \
    su postgres -c "psql -f /tmp/postgres-setup.sql" && \
    /etc/init.d/postgresql stop

ADD . src/
ENV PYTHONPATH /src/python
# add our own bin to path for handy scripts
ENV PATH="/src/bin:${PATH}"
WORKDIR /src