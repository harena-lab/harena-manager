#!/bin/sh

cp .env.example .env

adonis migration:run
adonis seed --files InitialSeeder.js
adonis serve --dev --debug
