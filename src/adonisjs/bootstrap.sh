#!/bin/bash

echo "Migration process started"

adonis migration:run
adonis seed --files InitialSeeder.js

adonis serve --dev --debug
