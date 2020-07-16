# FileReplacer
Tool to recursively replace strings in files following using REGEX. Files are unzipped and rezipped in memory.

in index.js:

var first -> directory to walk through;
var dir_name -> the name of the directory to walk through
var new_dir_name -> the name of the clone directory

options:
  regex -> the pattern that finds the links to replace
  test -> the pattern that finds the changed links (for testing purposes only)
  to -> what should be prepended to the new link
  end -> what should be appended to the new link
