#!/bin/sh

RUN adonis migration:run
RUN adonis seed --files InitialSeeder.js

adonis serve --dev --debug
