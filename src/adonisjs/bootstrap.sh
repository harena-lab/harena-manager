#!/bin/bash

adonis migration:run
adonis seed --files InitialSeeder.js

adonis serve --dev --debug
