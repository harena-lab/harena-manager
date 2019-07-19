#!/bin/sh
adonis migration:run
adonis seed --files InitialSeeder.js
adonis serve --debug
